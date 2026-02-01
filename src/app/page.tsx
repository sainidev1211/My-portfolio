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

      {/* Slide 1: Hero */}
      <div className="snap-section" id="hero">
        <Hero />
      </div>

      {/* Slide 2: About & Resume */}
      <div className="snap-section" id="about" style={{ scrollMarginTop: '100px' }}>
        <AboutResume />
      </div>

      {/* Slide 3: Projects */}
      <div className="snap-section" id="projects" style={{ scrollMarginTop: '100px' }}>
        <Projects />
      </div>

      {/* Slide 4: Certifications */}
      <div className="snap-section" id="certifications" style={{ scrollMarginTop: '100px' }}>
        <Certifications />
      </div>

      {/* Slide 5: AI Assistant */}
      <div className="snap-section" id="ai-assistant" style={{ scrollMarginTop: '100px' }}>
        <AiAssistant />
      </div>

      {/* Slide 6: Resume PDF View */}
      <div className="snap-section" id="resume-slide" style={{ scrollMarginTop: '100px' }}>
        <Resume />
      </div>

      {/* Slide 7: Contact */}
      <div className="snap-section" id="contact" style={{ scrollMarginTop: '100px' }}>
        <Contact />
      </div>
    </main>
  );
}
