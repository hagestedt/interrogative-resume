import { useState, useCallback } from 'react';
import { askClaude } from '../lib/claude';

export interface Message {
    role: 'user' | 'model';
    text: string;
}

export function useClaudeChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (query: string, metadata?: { role?: string; company?: string }) => {
        setIsLoading(true);
        setError(null);

        // Optimistic update
        setMessages(prev => [...prev, { role: 'user', text: query }]);

        try {
            // Convert current messages to Anthropic chat history ({ role, content }).
            // The UI uses 'model' for assistant turns; Claude expects 'assistant'.
            const history = messages.map(m => ({
                role: m.role === 'model' ? ('assistant' as const) : ('user' as const),
                content: m.text,
            }));

            const result = await askClaude(metadata, query, history);

            setMessages(prev => [...prev, { role: 'model', text: result.text }]);
            if (result.error) {
                setError("AI Connection Issue");
            }
        } catch {
            setError("Failed to send message");
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const clearChat = useCallback(() => {
        setMessages([]);
    }, []);

    return { messages, isLoading, error, sendMessage, clearChat };
}
