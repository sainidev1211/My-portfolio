"use client";

import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaCode, FaRocket, FaArrowRight, FaCommentDots } from 'react-icons/fa';

interface HeroProps {
    data?: any;
}

const DEFAULT_ROLES = [
    "AI & ML Engineer_",
    "Software Engineer_",
    "Machine Learning Specialist_",
    "Python Developer_",
    "Full Stack Developer_"
];

const TERMINAL_TABS = [
    {
        id: 'whoami',
        name: 'whoami.sh',
        lines: [
            "$ whoami --full-profile",
            "Name: Dev Saini",
            "Domain: AI & ML Engineer • Software Engineer",
            "Degree: B.E. Computer Science & Engineering (Artificial Intelligence & Machine Learning)",
            "University: Chandigarh University (2024–2028)",
            "Status: Open to high-impact roles & engineering internships",
            "",
            "$ echo $MISSION",
            "\"Building intelligent AI systems, robust software architectures, and high-velocity applications.\""
        ]
    },
    {
        id: 'skills',
        name: 'stack.json',
        lines: [
            "$ cat ~/skills/core.json",
            "{",
            "  \"core\": [\"AI & ML Engineering\", \"Software Engineering\", \"Machine Learning Concepts\"],",
            "  \"languages\": [\"Python\", \"TypeScript\", \"JavaScript\", \"C++\", \"SQL\"],",
            "  \"frameworks\": [\"TensorFlow\", \"PyTorch\", \"Next.js\", \"React.js\", \"Node.js\"],",
            "  \"databases\": [\"MongoDB\", \"PostgreSQL\", \"MySQL\", \"Docker\", \"Git\"]",
            "}"
        ]
    },
    {
        id: 'projects',
        name: 'projects.log',
        lines: [
            "$ ls -la ~/projects/featured",
            "drwx-r-x Suroor         [Full-Stack Music Streaming Platform]",
            "drwx-r-x Swasthya       [Smart Healthcare & Wellness Ecosystem]",
            "drwx-r-x Truthify-AI    [Intelligent AI Fact-Checking System]",
            "",
            "$ git log -1 --pretty=format:\"%h - %s (%cr)\"",
            "c9f4d1a - Ship upgraded AI portfolio v2.0 (just now)"
        ]
    }
];

export default function HeroClient({ data = {} }: HeroProps) {
    const roles = (data.roles && data.roles.length) ? data.roles : DEFAULT_ROLES;

    // Typewriter state
    const [roleIndex, setRoleIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Terminal active tab state
    const [activeTab, setActiveTab] = useState(0);
    const [visibleLineCount, setVisibleLineCount] = useState(0);

    // Typewriter effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fullText = roles[roleIndex % roles.length];

        if (!isDeleting) {
            if (currentText !== fullText) {
                timer = setTimeout(() => {
                    setCurrentText(fullText.slice(0, currentText.length + 1));
                }, 70);
            } else {
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, 2200);
            }
        } else {
            if (currentText !== "") {
                timer = setTimeout(() => {
                    setCurrentText(fullText.slice(0, currentText.length - 1));
                }, 35);
            } else {
                setIsDeleting(false);
                setRoleIndex((prev) => (prev + 1) % roles.length);
            }
        }

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, roleIndex, roles]);

    // Terminal tab animation
    useEffect(() => {
        setVisibleLineCount(0);
        const total = TERMINAL_TABS[activeTab].lines.length;
        let current = 0;

        const interval = setInterval(() => {
            current += 1;
            setVisibleLineCount(current);
            if (current >= total) {
                clearInterval(interval);
            }
        }, 120);

        return () => clearInterval(interval);
    }, [activeTab]);

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

        const anims = document.querySelectorAll('#hero .animate-on-scroll');
        anims.forEach(el => observer.observe(el));

        return () => {
            anims.forEach(el => observer.unobserve(el));
        };
    }, []);

    // Scroll helper
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className={styles.hero}>
            {/* Background Glows */}
            <div className={styles.bgGlow} />
            <div className={styles.bgGlow2} />

            {/* Top Left Status Badge */}
            <div className={styles.statusBadge}>
                <span className={styles.pulseDot} />
                <span>{data.status || "Available for Engineering & AI Roles"}</span>
            </div>

            <div className={styles.layoutContainer}>
                {/* Left Side: Main content */}
                <div className={`${styles.mainContent} animate-on-scroll`}>
                    <div className={styles.badgeWrapper}>
                        <span className={styles.eyebrow}>Hi, I'm</span>
                    </div>
                    
                    <h1 className={styles.name}>Dev Saini</h1>
                    
                    {/* Role / Typewriter */}
                    <div className={styles.roleContainer}>
                        <span className={styles.roleText}>{currentText}</span>
                        <span className={styles.cursor}>|</span>
                    </div>

                    <p className={styles.bio}>
                        {data.subtitle || "Computer Science student specializing in Artificial Intelligence and Machine Learning at Chandigarh University. Passionate about AI & ML engineering, software development, Python architectures, and scalable full-stack applications."}
                    </p>

                    <div className={styles.ctaGroup}>
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => scrollToSection('projects')} 
                            className={styles.primaryButton}
                        >
                            <FaRocket /> {data.primaryCta || "View Selected Work"}
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => scrollToSection('ai-assistant')} 
                            className={styles.secondaryButton}
                        >
                            <FaCommentDots /> {data.secondaryCta || "Ask Dev AI"}
                        </motion.button>

                        <motion.button 
                            whileHover={{ x: 4 }}
                            onClick={() => scrollToSection('contact')} 
                            className={styles.ghostButton}
                        >
                            <span>{data.tertiaryCta || "Let's Connect"}</span>
                            <FaArrowRight className={styles.arrow} />
                        </motion.button>
                    </div>
                </div>

                {/* Right Side: Interactive Terminal with Tabs */}
                <div className={`${styles.terminalSide} animate-on-scroll`} style={{ transitionDelay: '150ms' }}>
                    <div className={styles.terminalWindow}>
                        <div className={styles.terminalTitleBar}>
                            <div className={styles.dots}>
                                <span className={styles.redDot} />
                                <span className={styles.yellowDot} />
                                <span className={styles.greenDot} />
                            </div>
                            <div className={styles.tabContainer}>
                                {TERMINAL_TABS.map((tab, idx) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(idx)}
                                        className={`${styles.tabButton} ${activeTab === idx ? styles.tabButtonActive : ''}`}
                                    >
                                        <FaTerminal size={10} style={{ opacity: activeTab === idx ? 1 : 0.6 }} />
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.terminalBody}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {TERMINAL_TABS[activeTab].lines.slice(0, visibleLineCount).map((line, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`${styles.terminalLine} ${line.startsWith('$') ? styles.cmdLine : line.startsWith('{') || line.startsWith('}') ? styles.jsonLine : ''}`}
                                        >
                                            {line || "\u00A0"}
                                        </div>
                                    ))}
                                    {visibleLineCount >= TERMINAL_TABS[activeTab].lines.length && (
                                        <div className={styles.terminalLine}>
                                            <span style={{ color: 'var(--accent)' }}>$</span> <span className={styles.blockCursor}>█</span>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div 
                className={styles.scrollIndicator}
                onClick={() => scrollToSection('about')}
            >
                <span className={styles.scrollText}>scroll down</span>
                <motion.div 
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className={styles.scrollArrow}
                >
                    ↓
                </motion.div>
            </div>
        </section>
    );
}
