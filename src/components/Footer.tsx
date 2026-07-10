import React from 'react';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { CONTACT } from '../data';

interface FooterProps {
    onContactClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactClick }) => {
    return (
        <footer className="border-t border-nature-900 bg-nature-950 py-14 px-4 text-center">
            <div className="max-w-xl mx-auto">
                <p className="text-xs tracking-[0.2em] text-stone-500 mb-4">Get in touch</p>

                <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-lg md:text-xl font-semibold text-accent-gold hover:text-cream-100 transition-colors"
                >
                    {CONTACT.email}
                </a>

                <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
                    <a
                        href={CONTACT.resumePdf}
                        download
                        className="inline-flex items-center gap-2 text-sm font-semibold border border-accent-gold text-accent-gold px-4 py-2 rounded-full hover:bg-accent-gold/10 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download résumé (PDF)
                    </a>
                </div>

                <div className="flex justify-center gap-5 mt-8">
                    <a
                        href={CONTACT.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-3 bg-nature-900 rounded-full text-cream-400 hover:text-white hover:bg-nature-800 transition-all"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href={CONTACT.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-3 bg-nature-900 rounded-full text-cream-400 hover:text-white hover:bg-nature-800 transition-all"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <button
                        onClick={onContactClick}
                        aria-label="Open contact form"
                        className="p-3 bg-nature-900 rounded-full text-cream-400 hover:text-white hover:bg-nature-800 transition-all"
                    >
                        <Mail className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-8 text-sm font-medium text-cream-300">
                    <a href="/writing/" className="hover:text-cream-100 transition-colors">
                        Writing — the Thoughtful interfaces essays
                    </a>
                </div>

                <p className="text-stone-600 text-sm mt-8">
                    &copy; {new Date().getFullYear()} Adam Hagestedt. Built with agentic AI —{' '}
                    <a
                        href="https://github.com/hagestedt/interrogative-resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-stone-700 hover:text-cream-400"
                    >
                        source on GitHub
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
};
