import React from 'react';
import { PROFILE } from '../data';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export const SkillsMatrix: React.FC = () => {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-center mb-12 text-cream-100">The Honest Skills Matrix</h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Strong */}
                <div className="bg-nature-900/50 rounded-xl p-6 border border-emerald-900/50 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        Superpowers
                    </h3>
                    <ul className="space-y-4">
                        {PROFILE.skills.strong.map((skill, i) => (
                            <li key={i} className="flex items-start gap-3 text-cream-200">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500/60 flex-shrink-0 mt-0.5" />
                                <span>{skill}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Moderate */}
                <div className="bg-nature-900/50 rounded-xl p-6 border border-nature-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-nature-600/50" />
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Circle className="w-5 h-5 text-nature-400" />
                        Competent
                    </h3>
                    <ul className="space-y-4">
                        {PROFILE.skills.moderate.map((skill, i) => (
                            <li key={i} className="flex items-start gap-3 text-cream-200">
                                <Circle className="w-5 h-5 text-nature-600/60 flex-shrink-0 mt-0.5" />
                                <span>{skill}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gaps */}
                <div className="bg-nature-900/50 rounded-xl p-6 border border-amber-900/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold/40" />
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <AlertCircle className="w-5 h-5 text-accent-gold" />
                        Strategic Gaps
                    </h3>
                    <ul className="space-y-4">
                        {PROFILE.skills.gaps.map((skill, i) => (
                            <li key={i} className="flex items-start gap-3 text-cream-200">
                                <AlertCircle className="w-5 h-5 text-accent-gold/60 flex-shrink-0 mt-0.5" />
                                <span>{skill}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
