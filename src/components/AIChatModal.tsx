import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useClaudeChat } from '../hooks/useClaudeChat';

interface AIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    context?: {
        role: string;
        company: string;
        highlightTitle?: string;
        initialQuery?: string;
    };
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, context }) => {
    const { messages, isLoading, sendMessage, clearChat } = useClaudeChat();
    const [query, setQuery] = useState('');
    const hasSentRef = React.useRef(false);

    useEffect(() => {
        if (isOpen && context) {
            // Only execute if we haven't already sent the initial query for this open session
            if (!hasSentRef.current) {
                clearChat();

                if (context.initialQuery) {
                    hasSentRef.current = true;
                    // Small delay for animation
                    setTimeout(() => {
                        sendMessage(context.initialQuery!, { role: context.role, company: context.company });
                    }, 500);
                } else {
                    // Just clear chat and mark as ready
                    hasSentRef.current = true;
                }
            }
        } else if (!isOpen) {
            // Reset the flag when the modal closes so it runs again next time it opens
            hasSentRef.current = false;
        }
    }, [isOpen, context, clearChat, sendMessage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        sendMessage(query, context);
        setQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-nature-950/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-nature-900 border border-nature-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-nature-800 bg-nature-950/50">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-accent-gold" />
                                <div>
                                    <h2 className="text-lg font-bold text-cream-100">Ask AI Agent</h2>
                                    {context && (
                                        <p className="text-xs text-cream-300">Context: {context.role} @ {context.company}</p>
                                    )}
                                </div>
                            </div>
                            <button onClick={onClose} className="hover:bg-nature-800 p-1 rounded-full transition-colors text-cream-300 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
                            {messages.length === 0 && !isLoading && (
                                <div className="text-center text-stone-500 mt-20">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>Ask anything about this role...</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-stone-800 text-cream-100 rounded-br-none'
                                            : 'bg-nature-950 border border-stone-800 text-cream-200 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-nature-950 border border-stone-800 text-cream-200 rounded-2xl rounded-bl-none p-4 flex gap-2 items-center">
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce delay-75" />
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-nature-800 bg-nature-950/30">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Dive deeper..."
                                    className="w-full bg-nature-950 border border-stone-700 rounded-xl py-3 pl-4 pr-12 text-cream-100 focus:ring-2 focus:ring-accent-gold focus:border-stone-600 transition-all outline-none placeholder-stone-600 shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!query || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-800 hover:bg-stone-700 text-cream-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? <span className="animate-spin">⌛</span> : <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
