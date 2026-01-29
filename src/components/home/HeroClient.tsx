"use client";

import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { motion } from 'framer-motion';

interface HeroProps {
    data: any;
}

const QUOTES = [
    { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" }
];

const HeroClient: React.FC<HeroProps> = ({ data }) => {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        // Random quote on mount
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    return (
        <section id="hero" className={styles.hero} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100vh', position: 'relative' }}>
            <div className={styles.bgGlow} />

            {/* Engineering Quote - Top Center/Right or Integrated */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                style={{
                    position: 'absolute',
                    top: '8rem',
                    maxWidth: '600px',
                    padding: '0 1rem',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.6)'
                }}
            >
                "{quote.text}" — <span style={{ color: 'var(--primary)' }}>{quote.author}</span>
            </motion.div>

            {/* Main Hero Content */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    fontSize: '4rem',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                    maxWidth: '900px',
                    background: 'linear-gradient(to right, #fff, #bbb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Building Smart Solutions with AI & Code
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                    fontSize: '1.2rem',
                    marginBottom: '3rem',
                    maxWidth: '600px'
                }}
            >
                Full Stack Developer • AI Engineer • Problem Solver
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={styles.ctaGroup}
            >
                <a href="#projects" className={styles.primaryButton}>View Projects</a>
                <a href="#contact" className={styles.secondaryButton}>Contact Me</a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0.5
                }}
            >
                <div style={{
                    width: '30px',
                    height: '50px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '15px',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '10px'
                }}>
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            width: '4px',
                            height: '4px',
                            background: 'white',
                            borderRadius: '50%'
                        }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroClient;
