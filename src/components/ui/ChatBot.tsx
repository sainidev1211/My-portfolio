"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const FAQ_QUESTIONS = [
    "What is your tech stack?",
    "Can I hire you?",
    "Where are you based?",
    "Do you have a resume?"
];

const FAQ_ANSWERS: Record<string, string> = {
    "What is your tech stack?": "I specialize in Next.js, React, Node.js, and Python for AI integration.",
    "Can I hire you?": "Yes! I am open to freelance projects and full-time opportunities. Please use the Contact form.",
    "Where are you based?": "I work remotely and open to opportunities worldwide.",
    "Do you have a resume?": "Yes, you can check the Resume section on this page to download it!"
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm the AI Assistant. Ask me anything about Dev's portfolio or skills.", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const addMessage = (text: string, sender: 'user' | 'ai') => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    };

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;

        addMessage(text, 'user');
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            let response = "That's a great question! Check out the projects or contact section for more.";

            // Simple exact match for FAQ
            if (FAQ_ANSWERS[text]) {
                response = FAQ_ANSWERS[text];
            } else if (text.toLowerCase().includes('project')) {
                response = "Dev has built amazing AI-powered applications. Click on any project card to see details!";
            } else if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('email')) {
                response = "You can reach out via the contact form at the bottom of the page.";
            }

            addMessage(response, 'ai');
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className={styles.container}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.header}>
                        <span className={styles.title}>AI Assistant</span>
                        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className={styles.messages}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && <div className={`${styles.message} ${styles.ai}`}>Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {FAQ_QUESTIONS.map(q => (
                            <button
                                key={q}
                                className={styles.faqButton}
                                onClick={() => handleSend(q)}
                                style={{
                                    fontSize: '0.8rem',
                                    padding: '0.4rem 0.8rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '15px',
                                    color: 'rgba(255,255,255,0.8)',
                                    cursor: 'pointer'
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            className={styles.sendButton}
                            onClick={() => handleSend()}
                            disabled={isTyping || !inputValue.trim()}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
};

export default ChatBot;
