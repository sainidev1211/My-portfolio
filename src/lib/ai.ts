import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";


export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function askPortfolioAI(
  question: string,
  context: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  const systemPrompt = `You are the official, intelligent AI Assistant for Dev Saini's portfolio.
Your role is to represent Dev Saini professionally, enthusiastically, and accurately to visitors, recruiters, and clients.

### Dev Saini's Core Titles & Domains:
- Primary Domain: Artificial Intelligence & Machine Learning Engineer (AI & ML Engineer)
- Key Roles: Software Engineer, Machine Learning Specialist, Python Developer, Full Stack Developer
- Education: Bachelor of Engineering in Computer Science & Engineering (Artificial Intelligence and Machine Learning) at Chandigarh University (2024–2028).

### Dev Saini's Profile & Portfolio Knowledge:
${context}

### Strict Guidelines:
1. Speak as Dev Saini's AI Portfolio Assistant. Never mention internal vendor names, model providers, or the term "Groq" on screen.
2. WORD LIMIT & CONCISENESS: Keep answers strictly moderate in length (between 40 to 90 words maximum). Provide direct, accurate, and crisp answers. Avoid long, repetitive essays. Use clean bullet points when listing items.
3. Use full "Artificial Intelligence and Machine Learning" instead of abbreviations like "AIML" wherever referring to his field or degree.
4. If asked about projects, highlight "Suroor" (Music Streaming), "Swasthya" (Smart Healthcare), and "Truthify AI" (Fake News Detection).
5. If asked how to contact Dev, mention email (devs08107@gmail.com), LinkedIn (linkedin.com/in/dev-sainii), and the "Let's Connect" form below.
6. Stay factual and polite. Do not hallucinate qualifications or external jobs.`;

  // 1. Try with AI engine
  if (GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: GROQ_API_KEY });
      const candidateModels = [GROQ_MODEL, 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b', 'openai/gpt-oss-120b'];

      for (const model of candidateModels) {
        try {
          const messages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-6).map(h => ({
              role: (h.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
              content: h.content
            })),
            { role: 'user', content: question }
          ];

          const response = await groq.chat.completions.create({
            messages,
            model,
            temperature: 0.4,
            max_tokens: 220,
          });

          const reply = response.choices?.[0]?.message?.content;
          if (reply) {
            return reply.trim();
          }
        } catch (modelErr: any) {
          console.warn(`AI model ${model} attempt failed:`, modelErr?.message || modelErr);
          continue;
        }
      }
    } catch (groqErr) {
      console.error("AI engine error:", groqErr);
    }
  }

  // 2. Intelligent Context-Aware Fallback (concise & moderate word count)
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('project') || lowerQ.includes('suroor') || lowerQ.includes('healthcare') || lowerQ.includes('swasthya') || lowerQ.includes('truthify')) {
    return "Dev Saini has built impactful projects including **Suroor** (full-stack Spotify-like music streaming), **Swasthya** (smart healthcare & wellness platform), and **Truthify AI** (intelligent misinformation detection). Explore the Featured Projects section above for live demos and code!";
  }
  if (lowerQ.includes('skill') || lowerQ.includes('tech') || lowerQ.includes('stack') || lowerQ.includes('domain')) {
    return "Dev is an **AI & ML Engineer, Software Engineer, Python Developer, and Full Stack Developer**. His core tech stack includes **Python, Machine Learning Concepts, TensorFlow, PyTorch, Next.js, React, Node.js, TypeScript, MongoDB**, and **PostgreSQL**.";
  }
  if (lowerQ.includes('education') || lowerQ.includes('college') || lowerQ.includes('university') || lowerQ.includes('degree')) {
    return "Dev Saini is pursuing a **Bachelor of Engineering in Computer Science (Artificial Intelligence and Machine Learning)** at **Chandigarh University** (2024–2028), specializing in machine learning algorithms, deep learning, and scalable software systems.";
  }
  if (lowerQ.includes('contact') || lowerQ.includes('email') || lowerQ.includes('hire') || lowerQ.includes('connect')) {
    return "You can reach Dev directly at **devs08107@gmail.com**, connect on LinkedIn at **linkedin.com/in/dev-sainii**, or send a message via the **Let's Connect** form below.";
  }
  if (lowerQ.includes('resume') || lowerQ.includes('cv')) {
    return "You can preview and download Dev Saini's official resume using the interactive **Open Resume Preview** drawer in the Resume section!";
  }

  return "Dev Saini is an **AI & ML Engineer, Software Engineer, Python Developer, and Full Stack Developer** at Chandigarh University specializing in Artificial Intelligence and Machine Learning. Feel free to ask about his projects, skills, certifications, or get in touch!";
}