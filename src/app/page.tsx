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

      {/* Slide 6: Resume PDF View */}
      <div className="snap-section" id="resume-slide">
        <Resume />
      </div>

      {/* Slide 7: Contact */}
      <div className="snap-section" id="contact">
        <Contact />
      </div>
    </main>
  );
}
