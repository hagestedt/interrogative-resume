import React from 'react';
import { ExternalLink, Code2, Award } from 'lucide-react';
import { SELECTED_WORK } from '../data';

export const SelectedWork: React.FC = () => {
    return (
        <section className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-cream-100 text-center">Selected work</h2>
            <p className="text-cream-300 text-center mt-2 mb-10 max-w-2xl mx-auto">
                Proof, not adjectives — shipped code you can read and outcomes you can check.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SELECTED_WORK.map((w) => (
                    <div
                        key={w.title}
                        className="flex flex-col bg-nature-900/40 border border-stone-800 rounded-xl p-5 hover:border-stone-600 transition-colors"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            {w.kind === 'code' ? (
                                <Code2 className="w-4 h-4 text-accent-sage" />
                            ) : (
                                <Award className="w-4 h-4 text-accent-gold" />
                            )}
                            <span className="text-[11px] font-bold tracking-wide text-stone-500">
                                {w.kind === 'code' ? 'Shipped code' : 'Outcome'}
                            </span>
                        </div>

                        <h3 className="font-bold text-cream-100 mb-2 leading-snug">{w.title}</h3>
                        <p className="text-sm text-cream-300 leading-relaxed flex-1">{w.blurb}</p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {w.tags.map((t) => (
                                <span
                                    key={t}
                                    className="text-[11px] px-2 py-0.5 rounded bg-nature-950 text-cream-300 border border-stone-800"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div className="mt-4">
                            {w.href ? (
                                <a
                                    href={w.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-gold hover:text-cream-100 transition-colors"
                                >
                                    {w.hrefLabel ?? 'View'} <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            ) : (
                                <span className="text-xs text-stone-500">Details on request</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
