import React, { useState } from 'react';
import { X, Send, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwvqadzk';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStep('submitting');

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStep('success');
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Something went wrong. Please try again.');
                setStep('error');
            }
        } catch {
            setErrorMessage('Network error. Please check your connection and try again.');
            setStep('error');
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form state after animation completes
        setTimeout(() => {
            setStep('form');
            setErrorMessage('');
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-nature-950/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        className="fixed left-4 top-4 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto bg-nature-900 border border-nature-800 rounded-xl shadow-2xl z-50 p-6 text-cream-100"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Lock className="w-5 h-5 text-accent-sage" />
                                Secure Contact
                            </h2>
                            <button onClick={handleClose} className="hover:bg-nature-800 p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {step === 'form' || step === 'submitting' ? (
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-cream-200">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        disabled={step === 'submitting'}
                                        className="w-full bg-nature-950 border border-nature-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-sage focus:outline-none placeholder-nature-800 disabled:opacity-50"
                                        placeholder="Recruiter / Founder Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-cream-200">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        disabled={step === 'submitting'}
                                        className="w-full bg-nature-950 border border-nature-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-sage focus:outline-none placeholder-nature-800 disabled:opacity-50"
                                        placeholder="you@company.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1 text-cream-200">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        disabled={step === 'submitting'}
                                        className="w-full bg-nature-950 border border-nature-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-sage focus:outline-none placeholder-nature-800 disabled:opacity-50"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-cream-200">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        disabled={step === 'submitting'}
                                        rows={4}
                                        className="w-full bg-nature-950 border border-nature-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-sage focus:outline-none placeholder-nature-800 disabled:opacity-50"
                                        placeholder="We're looking for an agentic systems leader..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={step === 'submitting'}
                                    className="w-full border border-accent-gold text-accent-gold font-semibold py-2 rounded-lg hover:bg-accent-gold/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {step === 'submitting' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : step === 'success' ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-nature-800 rounded-full flex items-center justify-center mx-auto">
                                    <Send className="w-8 h-8 text-accent-sage" />
                                </div>
                                <h3 className="text-xl font-bold text-accent-sage">Message Sent</h3>
                                <p className="text-cream-200">
                                    Thanks for reaching out. Adam will review your inquiry shortly.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-4 px-6 py-2 border border-nature-800 hover:bg-nature-800 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto">
                                    <X className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-red-400">Failed to Send</h3>
                                <p className="text-cream-200">
                                    {errorMessage}
                                </p>
                                <button
                                    onClick={() => setStep('form')}
                                    className="mt-4 px-6 py-2 border border-nature-800 hover:bg-nature-800 rounded-lg transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
