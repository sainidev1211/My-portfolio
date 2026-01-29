"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaRedo } from 'react-icons/fa';

// ChatBot Constants
const FAQ_QUESTIONS = [
    "Are you open to work?",
    "Can we collaborate?",
    "What is your tech stack?",
    "How can I contact you?",
    "Do you have a resume?",
    "Tell me an engineering joke"
];

const FAQ_ANSWERS: Record<string, string> = {
    "Are you open to work?": "Yes! I am actively looking for full-time opportunities and freelance projects. I'd love to hear about your team.",
    "Can we collaborate?": "Absolutely! I'm always open to interesting collaborations. Please reach out via the Contact form.",
    "What is your tech stack?": "I specialize in Next.js, React, Node.js, and integrating AI models like OpenAI and Gemini.",
    "How can I contact you?": "You can fill out the contact form below or ask me for my email!",
    "Do you have a resume?": "Yes, you can view and download my resume from the 'Resume' slide in this portfolio!",
    "Tell me an engineering joke": "Why do programmers prefer dark mode? Because light attracts bugs! 🐛"
};

const Header = () => {
    // ChatBot State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ id: number, text: string, sender: 'user' | 'ai' }[]>([
        { id: 1, text: "Hi! I'm Dev's AI Assistant. I can answer questions about his resume, availability, and contact info. How can I help?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            let response = "That's a great question! Reach out to Dev directly for more details.";
            const lowerText = text.toLowerCase();

            if (FAQ_ANSWERS[text]) {
                response = FAQ_ANSWERS[text];
            } else if (lowerText.includes('email') || lowerText.includes('gmail')) {
                response = "You can reach Dev at: devs08107@gmail.com";
            } else if (lowerText.includes('job') || lowerText.includes('hire')) {
                response = "Dev is open to work! You can contact him via the form below.";
            } else if (lowerText.includes('resume')) {
                response = "Check out the Resume slide!";
            } else if (lowerText.includes('joke')) {
                response = "Why did the developer go broke? Because he used up all his cache! 💸";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
            setIsTyping(false);
        }, 1000);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem 5%',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(0,0,0,0.2)'
                }}
            >
                {/* Left: Logo */}
                <div
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        cursor: 'pointer'
                    }}
                    onClick={() => scrollToSection('hero')}
                >
                    DevSaini
                </div>

                {/* Right: Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {['About', 'Projects', 'Contact'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '1rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                        >
                            {item}
                        </button>
                    ))}

                    {/* AI Assistant Button */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: isChatOpen ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                            fontSize: '1rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => !isChatOpen && (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                    >
                        AI Assistant <FaRobot />
                    </button>

                    {/* Resume Button */}
                    <button
                        onClick={() => scrollToSection('resume-slide')}
                        style={{
                            padding: '0.6rem 1.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
                            borderColor: 'var(--primary)'
                        }}
                    >
                        Resume
                    </button>
                </nav>
            </motion.header>

            {/* Global Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            position: 'fixed',
                            top: '6rem',
                            right: '8rem',
                            width: '320px',
                            height: '450px',
                            background: 'rgba(20, 20, 20, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            zIndex: 99,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ padding: '1rem', background: '#111', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>AI Assistant</span>
                            <button onClick={() => setMessages([{ id: 1, text: "Hi! How can I help?", sender: 'ai' }])} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }} title="Reset Chat">
                                <FaRedo size={12} />
                            </button>
                        </div>

                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '12px',
                                    maxWidth: '85%',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.4',
                                    wordBreak: 'break-word'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>AI is thinking...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '1rem', background: '#111', borderTop: '1px solid #333' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
                                {FAQ_QUESTIONS.slice(0, 3).map(q => (
                                    <button key={q} onClick={() => handleSend(q)} style={{
                                        fontSize: '0.7rem',
                                        padding: '0.3rem 0.6rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '20px',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}>{q}</button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        color: 'white',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
