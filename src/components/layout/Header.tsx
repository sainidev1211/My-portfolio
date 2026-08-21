"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
        const initial = saved || 'dark';
        setTheme(initial);
        document.documentElement.setAttribute('data-theme', initial);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    };

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = ['hero', 'about', 'projects', 'certifications', 'campus-activities', 'ai-assistant', 'resume-slide', 'contact'];
        const observers = sections.map(id => {
            const el = document.getElementById(id);
            if (!el) return null;
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) setActiveSection(id);
            }, { threshold: 0.15, rootMargin: "-80px 0px -40% 0px" });
            observer.observe(el);
            return { observer, el, id };
        });
        return () => {
            observers.forEach(o => {
                if (o) o.observer.unobserve(o.el);
            });
        };
    }, []);

    const navItems = [
        { label: 'About', id: 'about' },
        { label: 'Projects', id: 'projects' },
        { label: 'Certificates', id: 'certifications' },
        { label: 'Campus & Activities', id: 'campus-activities' },
        { label: 'AI Assistant', id: 'ai-assistant' },
        { label: 'Contact', id: 'contact' }
    ];

    const isLight = theme === 'light';

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''} ${isLight ? styles.headerLight : ''}`}
            >
                {/* Logo Section */}
                <div
                    className={styles.logoContainer}
                    onClick={() => scrollToSection('hero')}
                >
                    <span className={styles.logoDS}>DS</span>
                    <span className={styles.logoSeparator}>/</span>
                    <span className={styles.logoName}>dev.saini</span>
                </div>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => scrollToSection(item.id)}
                            className={`${styles.navLink} ${activeSection === item.id ? styles.activeLink : ''}`}
                        >
                            {item.id === 'ai-assistant' && (
                                <span className={styles.pulsingDot}>●</span>
                            )}
                            {item.id === 'ai-assistant' ? 'Ask Dev AI' : item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => scrollToSection('resume-slide')}
                        className={`${styles.resumeButton} ${activeSection === 'resume-slide' ? styles.activeLink : ''}`}
                    >
                        Resume
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={styles.themeToggle}
                        aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        <motion.span
                            key={theme}
                            initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {isLight ? '🌙' : '☀️'}
                        </motion.span>
                    </button>
                </nav>

                {/* Mobile Hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Theme Toggle mobile */}
                    <button
                        onClick={toggleTheme}
                        className={`${styles.themeToggle} ${styles.themeToggleMobile}`}
                        aria-label="Toggle theme"
                    >
                        {isLight ? '🌙' : '☀️'}
                    </button>
                    <button
                        className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.bar} />
                        <span className={styles.bar} />
                        <span className={styles.bar} />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-10px' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-10px' }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={`${styles.mobileMenu} ${isLight ? styles.mobileMenuLight : ''}`}
                    >
                        <nav className={styles.mobileNav}>
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.mobileActiveLink : ''}`}
                                >
                                    {item.id === 'ai-assistant' && (
                                        <span className={styles.pulsingDot}>● </span>
                                    )}
                                    {item.id === 'ai-assistant' ? 'Ask Dev AI' : item.label}
                                </button>
                            ))}
                            <button
                                onClick={() => scrollToSection('resume-slide')}
                                className={styles.mobileResumeButton}
                            >
                                Resume
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
