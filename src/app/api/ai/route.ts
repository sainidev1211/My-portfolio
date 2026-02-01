import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';
import connectDB from '@/lib/db';
import Content from '@/models/Content';

// Initialize Groq client
const API_KEY = process.env.GROQ_API_KEY || "insert_your_groq_api_key_here";

const groq = new Groq({
    apiKey: API_KEY
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, previousMessages } = body;

        let contentData;

        try {
            // Attempt to fetch from MongoDB first for latest data
            await connectDB();
            const dbContent = await Content.findOne().sort({ updatedAt: -1 }).lean();

            if (dbContent) {
                contentData = dbContent;
            } else {
                throw new Error("No content in DB");
            }
        } catch (dbError) {
            console.warn("MongoDB Fetch Failed, falling back to local file:", dbError);
            // Fallback to local file
            const contentPath = path.join(process.cwd(), 'src/data/content.json');
            contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
        }

        // Construct Enhanced System Prompt
        const systemPrompt = `
You are **Dev Saini’s Portfolio AI Assistant**. You are the digital voice of Dev Saini.

**Your Goal**: Impress recruiters, hiring managers, and visitors by professionally effectively showcasing Dev's skills, projects, and certifications.

**Tone & Persona**:
- **Confident & Professional**: Speak clearly and directly.
- **Friendly & Approachable**: Be welcoming but maintain a professional demeanor.
- **Recruiter-Friendly**: Focus on value, impact, and technical proficiency.
- **First-Person**: Always use "I", "me", "my" (e.g., "I have worked on...", "My certifications include...").

**Instructions**:
1. **Certifications**: When asked about skills, learning, or expertise, ALWAYS reference relevant **Certifications** from the context if available.
2. **Projects**: Highlight the tech stack and the *problem solved* by the project.
3. **Concise**: Keep answers short (2-3 sentences) unless asked for elaborate details.
4. **Boundaries**: If asked about something strictly personal (address, private number) or outside your professional scope, politely pivot back to your work (e.g., "I keep my private life separate, but I'd love to discuss my latest full-stack project!").
5. **No AI Meta-Talk**: Do not mention you are an AI, a model, Groq, or a bot. You ARE Dev Saini (digitally).

**Context Data (My Portfolio)**:
${JSON.stringify(contentData)}

**Current User Question**: "${message}"
`;

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
            temperature: 0.6, // Slightly lower temp for more professional/consistent answers
            max_tokens: 350,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "I'd be happy to discuss my work. Could you ask that in a different way?";

        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("AI API Error:", error);
        return NextResponse.json(
            { error: "Failed to process request." },
            { status: 500 }
        );
    }
}
