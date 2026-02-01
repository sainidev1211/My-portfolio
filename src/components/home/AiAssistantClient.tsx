"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AiAssistant.module.css';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const SUGGESTIONS = [
    "What is your tech stack?",
    "Tell me about your experience.",
    "Do you have any certifications?",
    "How can I contact you?"
];

export default function AiAssistantClient() {
    const [messages, setMessages] = useState<{ id: number, text: string, sender: 'user' | 'ai' }[]>([
        { id: 1, text: "Hello! I am Dev's AI Assistant. I can tell you everything about his work, skills, and experience. What would you like to know?", sender: 'ai' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg = { id: Date.now(), text, sender: 'user' as const };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    previousMessages: messages.slice(-5) // Send context
                })
            });

            const data = await res.json();

            if (data.response) {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: data.response, sender: 'ai' }]);
            } else {
                throw new Error("No response");
            }
        } catch (err) {
            console.error(err);
            // Only triggers on network failure (API returns 200 even on logic errors)
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "I am having trouble connecting to the internet. Please check my Resume slide for details.", sender: 'ai' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.section} id="ai-assistant">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.container}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>AI Assistant</h2>
                    <p className={styles.subtitle}>Ask anything about my professional background.</p>
                </div>

                <div className={styles.chatWindow}>
                    <div className={styles.messages} ref={scrollRef}>
                        {messages.map(m => (
                            <div key={m.id} className={`${styles.message} ${m.sender === 'user' ? styles.userMsg : styles.aiMsg}`}>
                                <div className={styles.icon}>{m.sender === 'user' ? <FaUser /> : <FaRobot />}</div>
                                <div className={styles.bubble}>{m.text}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className={`${styles.message} ${styles.aiMsg}`}>
                                <div className={styles.icon}><FaRobot /></div>
                                <div className={styles.bubble}>
                                    <span className={styles.dot}>.</span><span className={styles.dot}>.</span><span className={styles.dot}>.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.inputArea}>
                        <div className={styles.suggestions}>
                            {SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => handleSend(s)} className={styles.suggestionBtn}>{s}</button>
                            ))}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                                placeholder="Ask a question..."
                                className={styles.input}
                            />
                            <button onClick={() => handleSend(input)} disabled={loading} className={styles.sendBtn}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
