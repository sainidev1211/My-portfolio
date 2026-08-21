"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AiAssistant.module.css';
import { FaPaperPlane, FaUser, FaRobot, FaRedo, FaMagic } from 'react-icons/fa';

const SUGGESTIONS = [
    "Tell me about Dev Saini's background",
    "What projects has Dev built?",
    "What are his Machine Learning & Software concepts?",
    "What is his education at Chandigarh University?",
    "How can I contact or hire Dev?"
];

export default function AiAssistantClient() {
    const [messages, setMessages] = useState<{ id: number; text: string; sender: 'user' | 'ai'; timestamp?: string }[]>([
        { 
            id: 1, 
            text: "Hello! I am Dev Saini's AI Portfolio Assistant. Ask me anything about Dev's background in Artificial Intelligence and Machine Learning, software engineering, Python development, full-stack projects, or technical expertise!", 
            sender: 'ai',
            timestamp: 'Just now'
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // IntersectionObserver scroll animations hook
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

        const anims = document.querySelectorAll('#ai-assistant .animate-on-scroll');
        anims.forEach(el => observer.observe(el));

        return () => {
            anims.forEach(el => observer.unobserve(el));
        };
    }, []);

    const handleSend = async (text: string) => {
        if (!text.trim() || loading) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { id: Date.now(), text, sender: 'user' as const, timestamp: timeStr };
        
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    previousMessages: messages.slice(-6).map(m => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text
                    }))
                })
            });

            const data = await res.json();
            const replyText = data.response || data.answer || "Dev Saini is an AI & ML Engineer, Software Engineer, Python Developer, and Full Stack Developer at Chandigarh University.";

            setMessages(prev => [
                ...prev, 
                { 
                    id: Date.now() + 1, 
                    text: replyText, 
                    sender: 'ai',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [
                ...prev, 
                { 
                    id: Date.now() + 1, 
                    text: "Dev Saini is an AI & ML Engineer, Software Engineer, Python Developer, and Full Stack Developer at Chandigarh University specializing in Artificial Intelligence and Machine Learning. You can explore his projects above or reach out via the Let's Connect section!", 
                    sender: 'ai',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleResetChat = () => {
        setMessages([
            { 
                id: Date.now(), 
                text: "Chat reset. How can I help you explore Dev Saini's work today?", 
                sender: 'ai',
                timestamp: 'Just now'
            }
        ]);
    };

    // Helper to render basic markdown formatting
    const renderFormattedText = (raw: string) => {
        const lines = raw.split('\n');
        return lines.map((line, i) => {
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            const cleanLine = isBullet ? line.trim().substring(2) : line;

            const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
            const renderedParts = parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} style={{ color: 'var(--accent)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            if (isBullet) {
                return (
                    <div key={i} style={{ display: 'flex', gap: '6px', margin: '4px 0' }}>
                        <span style={{ color: 'var(--accent)' }}>•</span>
                        <span>{renderedParts}</span>
                    </div>
                );
            }

            return <div key={i} style={{ minHeight: line ? 'auto' : '8px' }}>{renderedParts}</div>;
        });
    };

    return (
        <section className={styles.section} id="ai-assistant">
            <div className={`${styles.container} animate-on-scroll`}>
                <div className={`${styles.header} animate-on-scroll`}>
                    <span className={styles.eyebrow}>&lt; artificial intelligence /&gt;</span>
                    <h2 className={styles.title}>Ask Dev Saini AI</h2>
                    <p className={styles.subtitle}>Instant intelligent insights into Dev's projects, technical skills, and background.</p>
                </div>

                <div className={`${styles.chatWindow} animate-on-scroll`} style={{ transitionDelay: '100ms' }}>
                    {/* Bot profile header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.dsIcon}>
                            <img 
                                src="/images/dev-profile.jpg" 
                                alt="Dev Saini" 
                                className={styles.avatarImg}
                            />
                        </div>
                        <div className={styles.chatHeaderInfo}>
                            <div className={styles.nameRow}>
                                <span className={styles.chatHeaderName}>Dev Saini AI</span>
                                <span className={styles.groqBadge}>⚡ AI Assistant</span>
                            </div>
                            <span className={styles.chatHeaderStatus}>● Online &amp; Ready</span>
                        </div>

                        <button 
                            onClick={handleResetChat} 
                            className={styles.resetChatBtn}
                            title="Reset Conversation"
                            aria-label="Reset Chat"
                        >
                            <FaRedo size={12} />
                        </button>
                    </div>

                    {/* Messages Window */}
                    <div className={styles.messages} ref={scrollRef}>
                        {messages.map(m => (
                            <motion.div 
                                key={m.id} 
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`${styles.message} ${m.sender === 'user' ? styles.userMsg : styles.aiMsg}`}
                            >
                                <div className={m.sender === 'user' ? styles.icon : styles.dsIconSmall}>
                                    {m.sender === 'user' ? (
                                        <FaUser size={11} />
                                    ) : (
                                        <img src="/images/dev-profile.jpg" alt="Dev" className={styles.avatarImgSmall} />
                                    )}
                                </div>
                                
                                <div className={styles.bubbleWrapper}>
                                    <div className={styles.bubble}>
                                        {renderFormattedText(m.text)}
                                    </div>
                                    {m.timestamp && (
                                        <span className={styles.messageTime}>{m.timestamp}</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {loading && (
                            <div className={`${styles.message} ${styles.aiMsg}`}>
                                <div className={styles.dsIconSmall}>
                                    <img src="/images/dev-profile.jpg" alt="Dev" className={styles.avatarImgSmall} />
                                </div>
                                <div className={styles.bubble}>
                                    <span className={styles.thinkingText}>Thinking</span>
                                    <span className={styles.dot}>.</span>
                                    <span className={styles.dot}>.</span>
                                    <span className={styles.dot}>.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input & Suggestions Area */}
                    <div className={styles.inputArea}>
                        <div className={styles.suggestions}>
                            {SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => handleSend(s)} className={styles.suggestionBtn}>
                                    <FaMagic size={10} color="var(--accent)" /> {s}
                                </button>
                            ))}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                                placeholder="Ask about Suroor, Swasthya, Machine Learning, Python, skills..."
                                className={styles.input}
                            />
                            <button 
                                onClick={() => handleSend(input)} 
                                disabled={loading || !input.trim()} 
                                className={styles.sendBtn}
                                aria-label="Send"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
