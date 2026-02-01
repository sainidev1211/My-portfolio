"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false); // Close on click
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { label: 'About', id: 'about' },
        { label: 'Projects', id: 'projects' },
        { label: 'Certificates', id: 'certifications' },
        { label: 'AI Assistant', id: 'ai-assistant' },
        { label: 'Contact', id: 'contact' }
    ];

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={styles.header}
            >
                {/* Logo */}
                <div
                    className={styles.logo}
                    onClick={() => scrollToSection('hero')}
                >
                    DevSaini
                </div>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => scrollToSection(item.id)}
                            className={styles.navLink}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => scrollToSection('resume-slide')}
                        className={styles.resumeButton}
                    >
                        Resume
                    </button>
                </nav>

                {/* Mobile Hamburger */}
                <button
                    className={styles.hamburger}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpenTop : ''}`} />
                    <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpenBottom : ''}`} />
                </button>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={styles.mobileMenu}
                    >
                        <nav className={styles.mobileNav}>
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => scrollToSection(item.id)}
                                    className={styles.mobileNavLink}
                                >
                                    {item.label}
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
};

export default Header;
