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
        <section className={styles.section} id="about">
            {/* Background */}
            <div className={styles.backgroundGlow} />

            <div className={styles.container}>
                {/* Left: About Text */}
                <div className={styles.content}>
                    <ScrollReveal>
                        <h2 className={styles.title}>
                            About <span style={{ color: 'var(--primary)' }}>Me</span>.
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <p className={styles.text}>
                            {text1}
                        </p>
                        <p className={styles.text} style={{ marginTop: '1rem' }}>
                            {text2}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Tech Stack</h3>
                        <div className={styles.techStack}>
                            {skills.slice(0, 8).map((skill: string) => (
                                <span key={skill} className={styles.techItem}>{skill}</span>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right: Profile Image & Resume Action */}
                <div className={styles.imageWrapper}>

                    <AnimatePresence mode="wait">
                        {!resumeOpen ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className={styles.profileCard}
                            >
                                <div className={styles.imageContainer}>
                                    <div className={styles.innerImage}>
                                        {image ? (
                                            <img src={image} alt="Profile" className={styles.profileImage} />
                                        ) : (
                                            <div className={styles.placeholderImage}>No Image</div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setResumeOpen(true)}
                                    className={styles.viewResumeBtn}
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
                                className={styles.resumeContainer}
                            >
                                <div className={styles.resumeFrame}>
                                    {resumeData.fileUrl && <iframe src={`${resumeData.fileUrl}#view=FitH`} width="100%" height="100%" style={{ border: 'none' }} />}
                                </div>
                                <div className={styles.resumeActions}>
                                    <button
                                        onClick={() => setResumeOpen(false)}
                                        className={styles.closeResumeBtn}
                                    >
                                        Close
                                    </button>
                                    <a
                                        href={resumeData.fileUrl}
                                        download
                                        target="_blank"
                                        className={styles.downloadResumeBtn}
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
