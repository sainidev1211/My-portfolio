import Hero from "@/components/home/Hero";
import AboutResume from "@/components/home/AboutResume";
import Contact from "@/components/home/Contact";
import Projects from "@/components/home/Projects";
import Resume from "@/components/home/Resume";
import Header from "@/components/layout/Header";
import AiAssistant from "@/components/home/AiAssistant";
import Certifications from "@/components/home/Certifications";

export default function Home() {
  return (
    <main className="snap-container">
      {/* Global Header */}
      <Header />

      {/* Slide 1: Hero */}
      <div className="snap-section" id="hero">
        <Hero />
      </div>

      {/* Slide 2: About + Resume (Profile) */}
      <div className="snap-section" id="about">
        <AboutResume />
      </div>

      {/* Slide 3: Projects */}
      <div className="snap-section" id="projects">
        <Projects />
      </div>

      {/* Slide 4: Certifications */}
      <div className="snap-section" id="certifications">
        <Certifications />
      </div>

      {/* Slide 5: AI Assistant */}
      <div className="snap-section" id="ai-assistant">
        <AiAssistant />
      </div>

      {/* Slide 5: Standalone Resume */}
      <div className="snap-section" id="resume-slide">
        <Resume />
      </div>

      {/* Slide 6: Contact (with Socials & Footer) */}
      <div className="snap-section" id="contact">
        <Contact />
      </div>
    </main>
  );
}

