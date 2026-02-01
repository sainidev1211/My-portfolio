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
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeInOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section id="hero" className={styles.hero}>
            <div className={styles.bgGlow} />
            <div className={styles.bgGlow2} />

            {/* Engineer Quote */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={{
                    position: 'absolute',
                    top: '15vh',
                    maxWidth: '500px',
                    padding: '0 1rem',
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                    color: 'var(--foreground)',
                    textAlign: 'center'
                }}
            >
                "{quote.text}" — <span style={{ color: 'var(--primary)' }}>{quote.author}</span>
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <motion.h1
                    variants={fadeInUp}
                    style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        maxWidth: '900px',
                    }}
                    className="text-gradient"
                >
                    Building Smart Solutions with <span className="text-gradient-primary">AI & Code</span>
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                        marginBottom: '3rem',
                        maxWidth: '600px',
                        opacity: 0.8,
                        lineHeight: 1.6
                    }}
                >
                    Full Stack Developer • AI Engineer • Problem Solver
                </motion.p>

                <motion.div variants={fadeInUp} className={styles.ctaGroup}>
                    <a href="#projects" className={styles.primaryButton}>View Projects</a>
                    <a href="#contact" className={styles.secondaryButton}>Contact Me</a>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    bottom: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0.4,
                    cursor: 'pointer'
                }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <span style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>SCROLL</span>
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
