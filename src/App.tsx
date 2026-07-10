import { useState } from 'react';
import { Hero } from './components/Hero';
import { DeepResume } from './components/DeepResume';
import { SkillsMatrix } from './components/SkillsMatrix';
import { FitAssessment } from './components/FitAssessment';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { SelectedWork } from './components/SelectedWork';
import { CONTACT } from './data';
import { Download } from 'lucide-react';

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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-bold text-cream-100 tracking-wider text-sm flex items-center gap-2 hover:text-white transition-colors"
          >
            <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
            Adam Hagestedt
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-cream-300">
            <button onClick={() => scrollToSection('work')} className="hover:text-cream-100 transition-colors">Work</button>
            <button onClick={() => scrollToSection('resume')} className="hover:text-cream-100 transition-colors">Resume</button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-cream-100 transition-colors">Skills</button>
            <button onClick={() => scrollToSection('fit')} className="hover:text-cream-100 transition-colors">Fit check</button>
            <a href="/writing/" className="hover:text-cream-100 transition-colors">Writing</a>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={CONTACT.resumePdf}
              download
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-cream-200 border border-stone-700 px-3 py-2 rounded-full hover:bg-nature-900 hover:text-cream-100 transition-colors"
            >
              <Download className="w-4 h-4" /> Résumé
            </a>
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-sm font-bold border border-accent-gold text-accent-gold px-4 py-2 rounded-full hover:bg-accent-gold/10 transition-colors focus:ring-2 focus:ring-accent-gold focus:outline-none"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 space-y-16 md:space-y-32 pb-32">
        <Hero onContactClick={() => setIsContactOpen(true)} />

        <div id="work" className="scroll-mt-24">
          <SelectedWork />
        </div>

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
