import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
    onContactClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactClick }) => {
    return (
        <footer className="border-t border-nature-900 bg-nature-950 py-12 px-4 text-center">
            <div className="flex justify-center gap-6 mb-8">
                <a href="https://www.linkedin.com/in/adam-hagestedt/" target="_blank" rel="noopener noreferrer" className="p-3 bg-nature-900 rounded-full text-nature-400 hover:text-white hover:bg-nature-800 transition-all">
                    <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/hagestedt" target="_blank" rel="noopener noreferrer" className="p-3 bg-nature-900 rounded-full text-nature-400 hover:text-white hover:bg-nature-800 transition-all">
                    <Github className="w-5 h-5" />
                </a>
                <button onClick={onContactClick} className="p-3 bg-nature-900 rounded-full text-nature-400 hover:text-white hover:bg-nature-800 transition-all">
                    <Mail className="w-5 h-5" />
                </button>
            </div>
            <p className="text-nature-600 text-sm">
                &copy; {new Date().getFullYear()} Adam Hagestedt. Built with Agentic AI.
            </p>
        </footer>
    );
};
