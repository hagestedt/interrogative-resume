import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, AlertTriangle, CheckCircle, Lightbulb, ChevronRight, Sparkles } from 'lucide-react';
import { JOBS, type Highlight, type Job } from '../data';
import { AIChatModal } from './AIChatModal';
import clsx from 'clsx';

export const DeepResume: React.FC = () => {
    const [expandedJob, setExpandedJob] = useState<number | null>(null);

    const toggleJob = (index: number) => {
        setExpandedJob(expandedJob === index ? null : index);
    };

    return (
        <section className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-6 h-6 text-accent-sage" />
                <h2 className="text-2xl font-bold text-cream-100">The deep résumé</h2>
            </div>

            <div className="space-y-4">
                {JOBS.map((job, index) => {
                    const isExpanded = expandedJob === index;
                    return (
                        <motion.div
                            key={index}
                            initial={false}
                            className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded
                                ? 'bg-nature-900 border-stone-600 shadow-xl ring-1 ring-stone-700/50'
                                : 'bg-nature-900/40 border-stone-800 hover:bg-nature-900/60'
                                }`}
                        >
                            <button
                                onClick={() => toggleJob(index)}
                                className="w-full text-left p-6 flex items-start justify-between gap-4 outline-none focus:ring-2 focus:ring-inset focus:ring-accent-gold/50 rounded-xl"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-xl font-bold text-cream-100">{job.role}</h3>
                                        <span className="text-cream-300 font-medium">@ {job.company}</span>
                                    </div>
                                    <p className="text-sm text-stone-500">{job.period}</p>
                                    <p className="text-cream-200 mt-2 leading-relaxed">{job.summary}</p>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-nature-950 text-cream-300 border border-stone-800">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-cream-300 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180 text-cream-100' : ''
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-2 border-t border-stone-700/50 space-y-4">
                                            <p className="text-xs tracking-widest text-stone-500 font-semibold mb-4">Key contributors</p>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {job.highlights && job.highlights.map((highlight, hIndex) => (
                                                    <HighlightCard key={hIndex} highlight={highlight} job={job} />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

const HighlightCard: React.FC<{ highlight: Highlight; job: Job }> = ({ highlight, job }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    const handleAIClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAIModalOpen(true);
    };

    return (
        <>
            <div
                className={clsx(
                    "rounded-lg border transition-all duration-300 overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-gold relative",
                    isOpen ? "col-span-1 md:col-span-3 bg-stone-900/50 border-stone-600" : "bg-nature-950/30 border-stone-700 hover:border-stone-500"
                )}
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen); }}
            >
                <div className="p-4 flex items-center justify-between pr-12">
                    <h4 className="font-bold text-cream-100 text-sm">{highlight.title}</h4>
                    <ChevronRight className={clsx("w-4 h-4 text-stone-500 transition-transform", isOpen && "rotate-90 text-cream-100")} />
                </div>

                {/* Ask AI Button - Top Right */}
                <button
                    onClick={handleAIClick}
                    className="absolute right-10 top-3.5 p-1.5 rounded-full bg-stone-800 text-accent-sage hover:bg-stone-700 hover:text-white transition-colors z-10 border border-stone-700"
                    title="Ask AI about this"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-0 grid md:grid-cols-3 gap-4 border-t border-stone-700/30 mt-2">
                                {/* Refactored to Stone cards with colored accents */}
                                <div className="p-4 rounded bg-stone-900 border border-amber-900/50 group hover:border-amber-900/80 transition-colors">
                                    <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-xs tracking-wider">
                                        <AlertTriangle className="w-3 h-3" /> Broken
                                    </div>
                                    <p className="text-sm text-cream-200 leading-relaxed">{highlight.broken}</p>
                                </div>

                                <div className="p-4 rounded bg-stone-900 border border-garnet-800/50 group hover:border-garnet-700/80 transition-colors">
                                    <div className="flex items-center gap-2 mb-3 text-garnet-400 font-bold text-xs tracking-wider">
                                        <CheckCircle className="w-3 h-3" /> Fixed
                                    </div>
                                    <p className="text-sm text-cream-200 leading-relaxed">{highlight.fixed}</p>
                                </div>

                                <div className="p-4 rounded bg-stone-900 border border-stone-700/50 group hover:border-stone-700/80 transition-colors">
                                    <div className="flex items-center gap-2 mb-3 text-cream-300 font-bold text-xs tracking-wider">
                                        <Lightbulb className="w-3 h-3" /> Lesson
                                    </div>
                                    <p className="text-sm text-cream-200 leading-relaxed">{highlight.lesson}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AIChatModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                context={{
                    role: job.role,
                    company: job.company,
                    highlightTitle: highlight.title,
                    initialQuery: `Tell me more about the "${highlight.title}" experience at ${job.company}. Specifically regarding: ${highlight.fixed}`
                }}
            />
        </>
    );
}
