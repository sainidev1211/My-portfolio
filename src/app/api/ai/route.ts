import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/data";
import { askPortfolioAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawQuestion = body.message || body.question || "";
    const question = String(rawQuestion).trim();
    const previousMessages = Array.isArray(body.previousMessages) ? body.previousMessages : [];

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question or message is required.",
        },
        { status: 400 }
      );
    }

    if (question.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is too long (max 1000 characters).",
        },
        { status: 400 }
      );
    }

    // Load full dynamic content from DB
    const content = await getContent();

    const hero = content.hero || {};
    const about = content.about || {};
    const experience = content.experience || [];
    const projects = content.projects || [];
    const certifications = content.certifications || [];
    const resume = content.resume || {};
    const contactInfo = content.contactInfo || {};
    const aiKnowledge = content.aiKnowledge || [];

    const context = `
=== PROFILE SUMMARY ===
Name: Dev Saini
Title: ${hero.title || "Full Stack Developer & AI Engineer"}
Subtitle: ${hero.subtitle || "CSE (AIML) student at Chandigarh University"}
Status: ${hero.status || "Available for Work & Internships"}
Location: ${contactInfo.location || "Chandigarh / Mohali, India"}
Email: ${contactInfo.email || "devs08107@gmail.com"}
Phone: ${contactInfo.phone || "+91 87644 51718"}

=== ABOUT & EDUCATION ===
${about.text1 || ""}
${about.text2 || ""}
Degree: ${about.education?.degree || "B.E. Computer Science & Engineering (AI & ML)"}
University: ${about.education?.institution || "Chandigarh University"} (${about.education?.duration || "2024 - 2028"})
Currently: ${(about.currently || []).join("; ")}
Skills: ${(about.skills || []).join(", ")}

=== EXPERIENCE & TIMELINE ===
${experience
  .map(
    (exp: any) => `
Role: ${exp.role}
Company/Institution: ${exp.company} (${exp.period})
Location: ${exp.location || ""}
Description: ${exp.description || ""}
Highlights: ${(exp.highlights || []).join("; ")}
Tech: ${(exp.technologies || []).join(", ")}
`
  )
  .join("\n")}

=== PROJECTS ===
${projects
  .map(
    (p: any) => `
Project: ${p.title}
Category: ${p.category || "Full Stack"}
Description: ${p.description}
Technologies: ${(p.tags || []).join(", ")}
Highlights: ${(p.highlights || []).join("; ")}
GitHub: ${p.githubUrl || ""}
Live: ${p.link || ""}
`
  )
  .join("\n")}

=== CERTIFICATIONS ===
${certifications
  .map(
    (c: any) => `
Certificate: ${c.title}
Issuer: ${c.issuer} (${c.date})
Category: ${c.category || "General"}
Verify Link: ${c.link || ""}
`
  )
  .join("\n")}

=== RESUME SUMMARY ===
${resume.summary || "Full Stack developer with AI/ML expertise."}

=== ADDITIONAL KNOWLEDGE & FAQ ===
${aiKnowledge
  .map((k: any) => `Topic: ${k.topic}\nDetails: ${k.content}`)
  .join("\n\n")}
`;

    const formattedHistory = previousMessages.map((m: any) => ({
      role: m.sender === 'user' || m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text || m.content || ''
    }));

    const answer = await askPortfolioAI(question, context, formattedHistory);

    return NextResponse.json({
      success: true,
      response: answer,
      answer: answer,
    });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      {
        success: true,
        response:
          "Dev Saini is a full-stack developer and AI/ML engineer at Chandigarh University specializing in Next.js, Node.js, Python, and AI systems. Feel free to explore the projects, certificates, or connect via the contact form!",
        answer:
          "Dev Saini is a full-stack developer and AI/ML engineer at Chandigarh University specializing in Next.js, Node.js, Python, and AI systems. Feel free to explore the projects, certificates, or connect via the contact form!",
      }
    );
  }
}