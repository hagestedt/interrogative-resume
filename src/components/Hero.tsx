import React, { useState } from 'react';
import { useClaudeChat } from '../hooks/useClaudeChat';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowRight, FileText, Target } from 'lucide-react';
import { PROFILE, HEADLINE } from '../data';
import { Avatar } from './Avatar';

interface HeroProps {
    onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactClick }) => {
    const [query, setQuery] = useState('');
    const { messages, isLoading: isTyping, sendMessage } = useClaudeChat();

    const handleAskAI = (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const q = overrideQuery || query;
        if (!q.trim()) return;
        if (overrideQuery) setQuery(overrideQuery);
        sendMessage(q);
    };

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const lastResponse = messages.filter(m => m.role === 'model').slice(-1)[0];
    const suggestions = ["AI rollouts", "Shipping speed", "P&L instinct", "Leadership"];

    return (
        <section className="relative px-4 md:px-0 max-w-4xl mx-auto text-center">
            <div className="mb-6">
                <Avatar size={88} />
            </div>
            {/* PRIMARY — built for a 6-second scan: who, what title, one-line value
                prop, three proof metrics. Rendered statically (no entrance animation
                that hides text) so it is instantly legible to humans and present in
                the prerendered HTML that crawlers / ATS / unfurlers read. */}
            <p className="text-sm font-semibold tracking-wide text-cream-400 mb-4">
                AI-transformation executive
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-cream-100">
                Adam Hagestedt<span className="text-accent-gold">.</span>
            </h1>
            <p className="mt-3 text-lg md:text-2xl text-accent-gold font-medium">
                {PROFILE.title}
            </p>
            <p className="mt-5 text-xl md:text-2xl text-cream-100 font-light max-w-2xl mx-auto leading-snug">
                {HEADLINE.valueProp}
            </p>

            {/* Three headline metrics */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                {HEADLINE.metrics.map((m) => (
                    <div
                        key={m.label}
                        className="bg-nature-900/40 border border-stone-800 rounded-xl p-5 hover:border-stone-600 transition-colors"
                    >
                        <div className="text-3xl md:text-4xl font-bold text-accent-sage tracking-tight">
                            {m.stat}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-cream-100">{m.label}</div>
                        <div className="mt-1 text-xs text-cream-300 leading-relaxed">{m.context}</div>
                    </div>
                ))}
            </div>

            {/* Primary calls to action */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={() => scrollTo('resume')}
                    className="flex items-center gap-2 border border-accent-gold text-accent-gold font-semibold px-5 py-2.5 rounded-full hover:bg-accent-gold/10 transition-colors focus:ring-2 focus:ring-accent-gold focus:outline-none"
                >
                    <FileText className="w-4 h-4" /> Explore the résumé
                </button>
                <button
                    onClick={() => scrollTo('fit')}
                    className="flex items-center gap-2 bg-nature-900 border border-stone-700 text-cream-100 font-semibold px-5 py-2.5 rounded-full hover:bg-nature-800 transition-colors focus:ring-2 focus:ring-accent-gold focus:outline-none"
                >
                    <Target className="w-4 h-4" /> Check your role's fit
                </button>
                <button
                    onClick={onContactClick}
                    className="px-5 py-2.5 rounded-full text-cream-300 font-semibold hover:text-cream-100 hover:bg-nature-900/50 transition-colors focus:ring-2 focus:ring-accent-gold focus:outline-none"
                >
                    Get in touch
                </button>
            </div>

            {/* Marquee — employers only (honesty-framed: where he's built, not clients) */}
            <p className="mt-8 text-xs md:text-sm text-stone-500">
                15 years building at{' '}
                <span className="text-cream-300 font-medium">{HEADLINE.builtAt.join('  ·  ')}</span>
            </p>

            {/* SECONDARY (demoted delight) — the AI agent. Still here, just no longer
                the headline act. */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-xl mx-auto mt-16"
            >
                <div className="flex items-center justify-center gap-2 mb-3 text-stone-500">
                    <Sparkles className="w-4 h-4 text-accent-sage" />
                    <span className="text-xs font-medium tracking-wide">
                        Or interrogate this résumé — ask my AI agent anything
                    </span>
                </div>

                <div className="bg-nature-900/20 backdrop-blur-md border border-stone-800 rounded-2xl p-4">
                    <form onSubmit={(e) => handleAskAI(e)} className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. How has Adam rolled out AI at enterprise scale?"
                            className="w-full bg-nature-950 border border-stone-700 rounded-xl py-3 pl-11 pr-12 text-sm text-cream-100 focus:ring-2 focus:ring-accent-gold focus:border-stone-600 transition-all outline-none placeholder-stone-600"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-accent-gold transition-colors" />
                        <button
                            type="submit"
                            disabled={!query}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-800 hover:bg-stone-700 text-cream-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Ask the AI agent"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="flex gap-2 mt-3 justify-center flex-wrap">
                        {suggestions.map(s => (
                            <button
                                key={s}
                                onClick={() => handleAskAI(undefined, s)}
                                className="text-xs px-3 py-1 bg-nature-950/50 hover:bg-nature-800 border border-stone-800 rounded-full text-cream-300 hover:text-white transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 flex gap-2 text-sm text-cream-300 items-center justify-center p-3"
                            >
                                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce delay-75" />
                                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce delay-150" />
                                Agent is thinking...
                            </motion.div>
                        )}

                        {lastResponse && !isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-left bg-stone-900/90 rounded-xl p-5 border border-stone-700 shadow-lg"
                            >
                                <h4 className="text-accent-gold font-bold text-sm mb-2 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    AI Agent Response
                                </h4>
                                <p className="text-cream-100 text-sm leading-relaxed whitespace-pre-wrap">
                                    {lastResponse.text}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </section>
    );
};
