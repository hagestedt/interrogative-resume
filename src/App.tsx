import { useState } from 'react';
import { Hero } from './components/Hero';
import { DeepResume } from './components/DeepResume';
import { SkillsMatrix } from './components/SkillsMatrix';
import { FitAssessment } from './components/FitAssessment';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-nature-950 text-cream-100 selection:bg-accent-gold/30 font-sans">
      <nav className="fixed top-0 w-full z-40 bg-nature-950/90 backdrop-blur-md border-b border-stone-800 transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-cream-100 tracking-wider text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-sage rounded-full"></span>
            THE INTERROGATIVE INTERFACE
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-cream-300">
            <button onClick={() => scrollToSection('resume')} className="hover:text-cream-100 transition-colors">Resume</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-cream-100 transition-colors">Skills</button>
            <button onClick={() => scrollToSection('fit')} className="hover:text-cream-100 transition-colors">Fit Check</button>
          </div>

          <button
            onClick={() => setIsContactOpen(true)}
            className="text-sm font-bold bg-cream-100 text-nature-950 px-4 py-2 rounded-full hover:bg-white transition-colors focus:ring-2 focus:ring-accent-gold focus:outline-none"
          >
            Contact
          </button>
        </div>
      </nav>

      <main className="pt-24 space-y-16 md:space-y-32 pb-32">
        <Hero />

        <div id="resume" className="scroll-mt-24">
          <DeepResume />
        </div>

        <div id="skills" className="scroll-mt-24">
          <SkillsMatrix />
        </div>

        <div id="fit" className="scroll-mt-24">
          <FitAssessment />
        </div>
      </main>

      <Footer onContactClick={() => setIsContactOpen(true)} />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default App;
