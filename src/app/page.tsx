import Hero from "@/components/home/Hero";
import AboutResume from "@/components/home/AboutResume";
import Contact from "@/components/home/Contact";
import Projects from "@/components/home/Projects";
import Resume from "@/components/home/Resume";
import Header from "@/components/layout/Header";
import Certifications from '@/components/home/Certifications';
import AiAssistant from '@/components/home/AiAssistant';

export default function Home() {
  return (
    <main className="snap-container">
      <Header />

      {/* Hero Section */}
      <div className="snap-section" id="hero">
        <Hero />
      </div>

      {/* About & Resume Section */}
      <div className="snap-section" id="about" style={{ scrollMarginTop: '100px' }}>
        <AboutResume />
      </div>

      {/* Projects Section */}
      <div className="snap-section" id="projects" style={{ scrollMarginTop: '100px' }}>
        <Projects />
      </div>

      {/* Certifications Section */}
      <div className="snap-section" id="certifications" style={{ scrollMarginTop: '100px' }}>
        <Certifications />
      </div>

      {/* AI Assistant Section */}
      <div className="snap-section" id="ai-assistant" style={{ scrollMarginTop: '100px' }}>
        <AiAssistant />
      </div>

      {/* Resume PDF View */}
      <div className="snap-section" id="resume-slide" style={{ scrollMarginTop: '100px' }}>
        <Resume />
      </div>

      {/* Contact Section */}
      <div className="snap-section" id="contact" style={{ scrollMarginTop: '100px' }}>
        <Contact />
      </div>
    </main>
  );
}
