import React, { useState } from 'react';
import { useClaudeChat } from '../hooks/useClaudeChat';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowRight } from 'lucide-react';
import { PROFILE } from '../data';

export const Hero: React.FC = () => {
    const [query, setQuery] = useState('');

    const { messages, isLoading: isTyping, sendMessage } = useClaudeChat();

    const handleAskAI = (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const q = overrideQuery || query;
        if (!q.trim()) return;

        if (overrideQuery) setQuery(overrideQuery);

        sendMessage(q);
    };

    // Get the last message from the model to display
    const lastResponse = messages.filter(m => m.role === 'model').slice(-1)[0];


    const suggestions = ["Scale", "Innovation", "Culture", "AI Transition"];

    return (
        <section className="relative pt-20 pb-0 px-4 md:px-0 max-w-4xl mx-auto text-center space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-cream-100">
                    Adam <span className="text-cream-300/80">Hagestedt</span>
                </h1>
                <p className="text-xl md:text-2xl text-cream-200 font-light">
                    {PROFILE.title}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {PROFILE.superpowers.map((sp, i) => (
                        <span key={i} className="px-3 py-1 bg-nature-900 border border-stone-800 rounded-full text-xs md:text-sm text-accent-sage">
                            {sp}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Ask AI Interface */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl mx-auto mt-12"
            >
                <div className="bg-nature-900/30 backdrop-blur-md border border-stone-700 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5">
                    <div className="flex items-center gap-2 mb-4 text-accent-sage">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">ASK AI AGENT ABOUT ME</span>
                    </div>

                    <form onSubmit={(e) => handleAskAI(e)} className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about 'AI Transition', 'Scale', or 'Innovation'..."
                            className="w-full bg-nature-950 border border-stone-700 rounded-xl py-3 pl-12 pr-4 text-cream-100 focus:ring-2 focus:ring-accent-gold focus:border-stone-600 transition-all outline-none placeholder-stone-600 shadow-inner"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-accent-gold transition-colors" />
                        <button
                            type="submit"
                            disabled={!query}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-800 hover:bg-stone-700 text-cream-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Suggested Queries */}
                    <div className="flex gap-2 mt-4 justify-center flex-wrap">
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
                                className="mt-4 text-left flex gap-3 text-sm text-cream-300 items-center justify-center p-4"
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
