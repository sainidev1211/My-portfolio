"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
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
                    {[
                        { label: 'About', id: 'about' },
                        { label: 'Projects', id: 'projects' },
                        { label: 'Certificates', id: 'certifications' },
                        { label: 'AI Assistant', id: 'ai-assistant' },
                        { label: 'Contact', id: 'contact' }
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => scrollToSection(item.id)}
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
                            {item.label}
                        </button>
                    ))}

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
        </>
    );
};

export default Header;
