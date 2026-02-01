"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AiAssistant.module.css'; // We'll create this CSS module next
import { FaPaperPlane, FaRobot, FaUser, FaMagic } from 'react-icons/fa';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const SUGGESTED_QUESTIONS = [
    "Tell me about yourself",
    "What are your top skills?",
    "Show me your best projects",
    "How can I contact you?",
    "What is your experience with AI?"
];

const AiAssistantClient = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! I'm Dev's AI Assistant. I can tell you everything about his work, skills, and projects. What would you like to know?",
            sender: 'ai'
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg: Message = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    previousMessages: messages.slice(-5) // Send context
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const aiMsg: Message = { id: Date.now() + 1, text: data.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            const errorMsg: Message = { id: Date.now() + 1, text: "I'm having trouble connecting right now. Please try again.", sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <section className={styles.container}>
            <div className={styles.bgGlow} />

            <div className={styles.contentWrapper}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.header}
                >
                    <div className={styles.iconWrapper}>
                        <FaMagic className={styles.sparkleIcon} />
                    </div>
                    <h2 className={styles.title}>AI Assistant</h2>
                    <p className={styles.subtitle}>Interact with my digital twin to learn more about my journey.</p>
                </motion.div>

                <motion.div
                    className={styles.chatInterface}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className={styles.messagesArea} ref={messagesAreaRef}>
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, x: msg.sender === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.aiRow}`}
                                >
                                    {msg.sender === 'ai' && <div className={styles.avatar}><FaRobot /></div>}
                                    <div className={`${styles.bubble} ${msg.sender === 'user' ? styles.userBubble : styles.aiBubble}`}>
                                        {msg.text}
                                    </div>
                                    {msg.sender === 'user' && <div className={styles.avatar}><FaUser /></div>}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={styles.typingIndicator}
                                >
                                    <span>●</span><span>●</span><span>●</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={styles.suggestions}>
                        {SUGGESTED_QUESTIONS.map((q, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.chip}
                                onClick={() => handleSend(q)}
                            >
                                {q}
                            </motion.button>
                        ))}
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            className={styles.input}
                            disabled={isTyping}
                        />
                        <button
                            onClick={() => handleSend()}
                            className={styles.sendButton}
                            disabled={!inputValue.trim() || isTyping}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AiAssistantClient;
