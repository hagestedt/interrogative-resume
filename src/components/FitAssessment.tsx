import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { assessFit, type FitResult } from '../lib/claude';

type Status = 'idle' | 'loading' | 'done';

// Full class strings (no dynamic concatenation) so Tailwind's purge keeps them.
const VERDICT_STYLES = {
    HIGH: { label: 'High alignment', text: 'text-garnet-400', border: 'border-l-garnet-500', Icon: CheckCircle },
    MEDIUM: { label: 'Partial alignment', text: 'text-amber-400', border: 'border-l-amber-500', Icon: AlertTriangle },
    LOW: { label: 'Low alignment', text: 'text-stone-500', border: 'border-l-stone-700', Icon: XCircle },
} as const;

export const FitAssessment: React.FC = () => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [result, setResult] = useState<FitResult | null>(null);

    const runAssessment = async () => {
        if (!input.trim()) return;
        setStatus('loading');
        setResult(null);
        const res = await assessFit(input);
        setResult(res);
        setStatus('done');
    };

    const reset = () => {
        setInput('');
        setResult(null);
        setStatus('idle');
    };

    const style = result && !result.error ? VERDICT_STYLES[result.verdict] : VERDICT_STYLES.MEDIUM;
    const VerdictIcon = style.Icon;

    return (
        <section className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-cream-100 mb-2">The fit assessment</h2>
            <p className="text-cream-300 mb-8 max-w-xl mx-auto">
                Paste a job description and Claude will assess it against my actual background — honestly, gaps
                included. Powered by the same agent that answers questions above.
            </p>

            <div className="bg-nature-900/30 rounded-2xl p-1 border border-stone-800 shadow-2xl backdrop-blur-sm">
                <textarea
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (status === 'done') {
                            setStatus('idle');
                            setResult(null);
                        }
                    }}
                    placeholder="Paste a job description here..."
                    rows={6}
                    disabled={status === 'loading'}
                    className="w-full bg-nature-950 border border-stone-800 rounded-xl p-6 text-cream-100 focus:ring-2 focus:ring-accent-gold focus:outline-none placeholder-stone-600 transition-all resize-none text-sm md:text-base leading-relaxed disabled:opacity-60"
                />

                <div className="mt-4 flex justify-between items-center px-2 pb-2">
                    <span className="text-xs text-stone-500 font-mono">{input.length} chars</span>

                    {status !== 'done' && (
                        <button
                            onClick={runAssessment}
                            disabled={!input.trim() || status === 'loading'}
                            className="border border-accent-gold text-accent-gold font-semibold px-6 py-2 rounded-lg hover:bg-accent-gold/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {status === 'loading' ? (
                                <>
                                    Analyzing
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Analyze Fit
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Error state — service unreachable / bad response */}
                {status === 'done' && result?.error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-2 mb-2 rounded-xl p-6 border-l-4 border-l-stone-500 bg-stone-900/80 border-y border-r border-stone-800 text-left"
                    >
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-stone-300">
                            <AlertTriangle className="w-5 h-5" />
                            Assessment unavailable
                        </h3>
                        <p className="text-cream-300 leading-relaxed text-sm">{result.rationale}</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={runAssessment}
                                className="text-xs text-accent-gold hover:text-cream-100 underline decoration-stone-700"
                            >
                                Retry
                            </button>
                            <button
                                onClick={reset}
                                className="text-xs text-stone-500 hover:text-cream-100 underline decoration-stone-700"
                            >
                                Clear & restart
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Verdict state */}
                {status === 'done' && result && !result.error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mx-2 mb-2 rounded-xl p-6 border-l-4 text-left bg-stone-900/80 border-y border-r border-stone-800 ${style.border}`}
                    >
                        <h3 className={`text-lg font-bold mb-1 flex items-center gap-2 ${style.text}`}>
                            <VerdictIcon className="w-5 h-5" />
                            {style.label}
                        </h3>
                        {result.headline && (
                            <p className="text-cream-100 font-semibold mb-2 text-sm">{result.headline}</p>
                        )}
                        {result.rationale && (
                            <p className="text-cream-200 leading-relaxed text-sm">{result.rationale}</p>
                        )}

                        {result.strengths.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs tracking-wider text-stone-500 mb-2">Where I map</p>
                                <ul className="space-y-1.5">
                                    {result.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 text-cream-200 text-sm">
                                            <CheckCircle className="w-4 h-4 text-garnet-400 mt-0.5 shrink-0" />
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.watchouts.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs tracking-wider text-stone-500 mb-2">Honest watch-outs</p>
                                <ul className="space-y-1.5">
                                    {result.watchouts.map((w, i) => (
                                        <li key={i} className="flex items-start gap-2 text-cream-300 text-sm">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                            <span>{w}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={reset}
                                className="text-xs text-stone-500 hover:text-cream-100 underline decoration-stone-700"
                            >
                                Clear & restart
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};
