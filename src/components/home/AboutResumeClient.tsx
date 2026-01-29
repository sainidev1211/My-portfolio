"use client";

import React from 'react';
import styles from './About.module.css'; // Re-use basic styles
import { ScrollReveal } from '../ui/ScrollReveal';
import ResumeClient from './ResumeClient'; // We can reuse the internal logic or inline it if needed.
// Actually, let's inline a simplified collapsible resume or use the existing one but styled to fit split screen.
// To keep it simple and robust, I'll essentially rebuild a "Slide 2" component here.

import { motion, AnimatePresence } from 'framer-motion';

interface AboutResumeProps {
    aboutData: any;
    resumeData: any;
}

const AboutResumeClient: React.FC<AboutResumeProps> = ({ aboutData, resumeData }) => {
    const { title, text1, text2, skills, image } = aboutData;
    const [resumeOpen, setResumeOpen] = React.useState(false);

    return (
        <section style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background */}
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'var(--primary-glow)', filter: 'blur(150px)', opacity: 0.5 }} />

            <div style={{
                maxWidth: '1200px',
                width: '90%',
                height: '80%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                alignItems: 'center',
                zIndex: 2
            }}>
                {/* Left: About Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <ScrollReveal>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1 }}>
                            About <span style={{ color: 'var(--primary)' }}>Me</span>.
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8 }}>
                            {text1}
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8, marginTop: '1rem' }}>
                            {text2}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Tech Stack</h3>
                        <div className={styles.techStack} style={{ justifyContent: 'flex-start' }}>
                            {skills.slice(0, 8).map((skill: string) => (
                                <span key={skill} className={styles.techItem}>{skill}</span>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right: Profile Image & Resume Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>

                    <AnimatePresence mode="wait">
                        {!resumeOpen ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{
                                    width: '350px',
                                    height: '350px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    marginBottom: '2rem',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                                }}>
                                    {image ? (
                                        <img src={image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#222' }} />
                                    )}
                                </div>

                                <button
                                    onClick={() => setResumeOpen(true)}
                                    style={{
                                        padding: '1rem 3rem',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        border: 'none',
                                        borderRadius: '50px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 30px var(--primary-glow)'
                                    }}
                                >
                                    View Resume
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="resume"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ flex: 1, border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', background: '#111' }}>
                                    {resumeData.fileUrl && <iframe src={`${resumeData.fileUrl}#view=FitH`} width="100%" height="100%" style={{ border: 'none' }} />}
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setResumeOpen(false)}
                                        style={{ padding: '0.8rem 2rem', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '50px', cursor: 'pointer' }}
                                    >
                                        Close
                                    </button>
                                    <a
                                        href={resumeData.fileUrl}
                                        download
                                        target="_blank"
                                        style={{ padding: '0.8rem 2rem', background: 'white', border: 'none', color: 'black', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}
                                    >
                                        Download
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default AboutResumeClient;
