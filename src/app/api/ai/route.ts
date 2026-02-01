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

// Fallback: Local Keyword Search
function localSearch(query: string, data: any): string {
    const lowerQuery = query.toLowerCase();
    const matches: string[] = [];

    // Search Projects
    if (data.projects) {
        data.projects.forEach((p: any) => {
            if (p.title.toLowerCase().includes(lowerQuery) || p.tags.some((t: string) => t.toLowerCase().includes(lowerQuery))) {
                matches.push(`Project: ${p.title} - ${p.description}`);
            }
        });
    }

    // Search Skills/About
    if (data.about) {
        if (data.about.text1 && data.about.text1.toLowerCase().includes(lowerQuery)) matches.push(`About: ${data.about.text1}`);
        if (data.about.skills && data.about.skills.some((s: string) => s.toLowerCase().includes(lowerQuery))) matches.push(`Skill: ${data.about.skills.join(', ')}`);
    }

    // Search Certifications
    if (data.certifications) {
        data.certifications.forEach((c: any) => {
            if (c.title.toLowerCase().includes(lowerQuery) || c.issuer.toLowerCase().includes(lowerQuery)) {
                matches.push(`Certification: ${c.title} from ${c.issuer}`);
            }
        });
    }

    // Search Knowledge
    if (data.knowledgeFiles) {
        data.knowledgeFiles.forEach((k: any) => {
            if (k.type === 'text' && k.content.toLowerCase().includes(lowerQuery)) {
                matches.push(`Note: ${k.content}`);
            }
        });
    }

    if (matches.length > 0) {
        return `I found some specific details in my records:\n\n${matches.slice(0, 3).join('\n\n')}\n\nI can tell you more if you specify exactly what you're looking for!`;
    }

    // STRICT DYNAMIC FALLBACK - NO PLACEHOLDERS
    // If no specific match, return a broad summary of the profile
    const summary = [];
    if (data.about && data.about.text1) summary.push(data.about.text1);
    if (data.about && data.about.skills) summary.push(`My core skills are: ${data.about.skills.slice(0, 5).join(', ')}.`);

    if (summary.length > 0) {
        return `I don't have a specific answer for "${query}" in my immediate index, but here is my professional validation: \n\n${summary.join('\n\n')}`;
    }

    return "I am a Full Stack Developer specializing in Next.js and AI. I have built multiple production-ready applications. Please ask about my projects.";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, previousMessages } = body;

        let contentData;

        try {
            await connectDB();
            const dbContent = await Content.findOne().sort({ updatedAt: -1 }).lean();
            contentData = dbContent || { knowledgeFiles: [] }; // Default to empty object if DB empty
        } catch (dbError) {
            console.warn("MongoDB Fetch Failed, using empty context:", dbError);
            contentData = { knowledgeFiles: [] };
        }

        // 1. Check API Key presence for immediate fallback
        if (!API_KEY || API_KEY.includes("insert") || API_KEY.length < 10) {
            console.warn("Invalid API Key, using local fallback.");
            return NextResponse.json({ response: localSearch(message, contentData) });
        }

        // 2. Construct System Prompt with Knowledge
        const knowledgeText = contentData.knowledgeFiles
            ? contentData.knowledgeFiles.map((k: any) => k.type === 'text' ? `[Note: ${k.title}] ${k.content}` : `[File: ${k.title}] (${k.url})`).join('\n')
            : "No extra knowledge notes.";

        const systemPrompt = `
You are **Dev Saini’s Portfolio AI Assistant**.
**Goal**: Impress recruiters with accurate, professional answers about Dev Saini.

**PRIORITY KNOWLEDGE**:
${knowledgeText}

**PORTFOLIO DATA**:
${JSON.stringify({ ...contentData, knowledgeFiles: undefined })}

**INSTRUCTIONS**:
1. **First Person**: Always speak as Dev ("I", "my").
2. **Priority**: specific "Knowledge Notes" > Resume > General Data.
3. **Tone**: Confident, Professional, Friendly.
4. **Fallback**: If you don't know, politely suggest checking the Resume slide.
5. **No Meta**: Never say "I am an AI" or "According to the data".

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
                max_tokens: 350,
            });

            const responseText = chatCompletion.choices[0]?.message?.content || "I'd be happy to discuss my work. Could you ask that in a different way?";
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
