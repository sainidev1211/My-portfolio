import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import connectDB from '@/lib/db';
import Content from '@/models/Content';

// Initialize Groq client
// CRITICAL: process.env.GROQ_API_KEY must be set in Vercel/Local env
const API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({
    apiKey: API_KEY || "missing_key_fallback" // Do not use usable dummy keys, let it fail to fallback if missing
});

// Fallback: Local Keyword Search (FIRST PERSON ONLY)
function localSearch(query: string, data: any): string {
    const lowerQuery = query.toLowerCase();
    const matches: string[] = [];

    // Search Projects
    if (data.projects) {
        data.projects.forEach((p: any) => {
            if (p.title.toLowerCase().includes(lowerQuery) || p.tags.some((t: string) => t.toLowerCase().includes(lowerQuery))) {
                matches.push(`I built **${p.title}**, which is a ${p.description}`);
            }
        });
    }

    // Search Skills/About
    if (data.about) {
        if (data.about.text1 && data.about.text1.toLowerCase().includes(lowerQuery)) matches.push(`About me: ${data.about.text1}`);
        if (data.about.skills && data.about.skills.some((s: string) => s.toLowerCase().includes(lowerQuery))) matches.push(`I am skilled in: ${data.about.skills.join(', ')}`);
    }

    // Search Certifications
    if (data.certifications) {
        data.certifications.forEach((c: any) => {
            if (c.title.toLowerCase().includes(lowerQuery) || c.issuer.toLowerCase().includes(lowerQuery)) {
                matches.push(`I earned the **${c.title}** certification from ${c.issuer} in ${c.date}`);
            }
        });
    }

    // Search Knowledge
    if (data.knowledgeFiles) {
        data.knowledgeFiles.forEach((k: any) => {
            if (k.type === 'text' && k.content.toLowerCase().includes(lowerQuery)) {
                matches.push(`From my notes: ${k.content}`);
            }
        });
    }

    if (matches.length > 0) {
        return `Here is what I found in my portfolio matching your question:\n\n${matches.slice(0, 3).join('\n\n')}\n\nAsk me for more details!`;
    }

    // STRICT DYNAMIC FALLBACK - NO PLACEHOLDERS
    const summary = [];
    if (data.about && data.about.text1) summary.push(data.about.text1);
    if (data.about && data.about.skills) summary.push(`My core skills include: ${data.about.skills.slice(0, 7).join(', ')}.`);

    if (summary.length > 0) {
        return `I don't have a specific answer for "${query}" right now, but let me introduce myself:\n\n${summary.join('\n\n')}`;
    }

    return "I am a Full Stack Developer specializing in Next.js and AI. I have built multiple production-ready applications. Please ask about my projects or skills.";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, previousMessages } = body;

        let contentData;

        try {
            await connectDB();
            const dbContent = await Content.findOne().sort({ updatedAt: -1 }).lean();
            contentData = dbContent || { knowledgeFiles: [] };
        } catch (dbError) {
            console.warn("MongoDB Fetch Failed, using empty context:", dbError);
            contentData = { knowledgeFiles: [] };
        }

        // 1. Check API Key presence
        // If missing or invalid, immediately use local fallback to avoid crashing or exposing errors
        if (!API_KEY || API_KEY === "missing_key_fallback" || API_KEY.length < 10) {
            console.warn("Invalid/Missing API Key, using local fallback logic.");
            return NextResponse.json({ response: localSearch(message, contentData) });
        }

        // 2. Construct System Prompt with FULL REAL CONTEXT
        const knowledgeText = contentData.knowledgeFiles
            ? contentData.knowledgeFiles.map((k: any) => k.type === 'text' ? `[My Note: ${k.title}] ${k.content}` : `[My File: ${k.title}] (${k.url})`).join('\n')
            : "";

        const projectText = contentData.projects ? JSON.stringify(contentData.projects.map((p: any) => ({ title: p.title, description: p.description, tech: p.tags }))) : "[]";
        const skillsText = contentData.about?.skills ? contentData.about.skills.join(", ") : "";
        const certsText = contentData.certifications ? JSON.stringify(contentData.certifications.map((c: any) => ({ title: c.title, issuer: c.issuer, date: c.date }))) : "[]";
        const aboutText = contentData.about?.text1 || "";

        const systemPrompt = `
You are **Dev Saini**. You are NOT an AI assistant. You ARE the portfolio owner.
**Goal**: Speak to recruiters/visitors as IF you are Dev Saini himself.

**YOUR CONTEXT (REAL DATA ONLY)**:
- **About Me**: "${aboutText}"
- **My Skills**: ${skillsText}
- **My Projects**: ${projectText}
- **My Certifications**: ${certsText}
- **My Notes**: ${knowledgeText}

**INSTRUCTIONS**:
1. **Persona**: ALWAYS speak in the **FIRST PERSON** ("I", "my", "me").
   - BAD: "Dev Saini has built..." or "The portfolio shows..."
   - GOOD: "I built..." or "I have experience in..."
2. **Accuracy**: Use ONLY the provided context. If the answer is not there, say:
   "I haven't listed that specific detail in my portfolio yet, but I can tell you about my skills in [Skill] or my project [Project]."
3. **Tone**: Professional, confident, friendly, and concise.
4. **No Meta-Talk**: NEVER say "As an AI", "Based on the database", or "I cannot answer".
5. **Resume Referral**: If asked for contact details or the full resume, direct them to the "Resume" or "Contact" section.

**User Question**: "${message}"
`;

        try {
            const messages: any[] = [
                { role: 'system', content: systemPrompt },
                ...(previousMessages || []).map((msg: any) => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                })),
                { role: 'user', content: message }
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.6,
                max_tokens: 300,
            });

            const responseText = chatCompletion.choices[0]?.message?.content || "I'm not sure how to answer that yet. Ask me about my projects!";
            return NextResponse.json({ response: responseText });

        } catch (apiError) {
            console.error("Groq API Failed:", apiError);
            // 3. Fallback on API failure
            return NextResponse.json({ response: localSearch(message, contentData) });
        }

    } catch (error) {
        console.error("Critical AI Error:", error);
        return NextResponse.json(
            { response: "I am a Full Stack Developer. Please ask me about my specific projects or skills." },
            { status: 200 }
        );
    }
}
