"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Resume.module.css';
import {
    FaFileAlt,
    FaDownload,
    FaExternalLinkAlt,
    FaTimes,
    FaEye,
    FaCheckCircle,
    FaGraduationCap
} from 'react-icons/fa';

interface ResumeProps {
    data: {
        summary: string;
        fileUrl: string;
    };
}

const HIGHLIGHT_SKILLS = [
    "AI & ML Engineering",
    "Software Engineering",
    "Machine Learning Concepts",
    "Python Development",
    "Full-Stack Development",
    "Next.js & React"
];

export default function ResumeClient({ data }: ResumeProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { summary, fileUrl } = data;

    // Close side drawer on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsDrawerOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Prevent body scrolling when side drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isDrawerOpen]);

    const resumeSummary = summary || "Computer Science undergraduate specializing in Artificial Intelligence and Machine Learning at Chandigarh University. Passionate about AI & ML engineering, software development, Python architectures, and scalable full-stack applications.";

    return (
        <section id="resume-slide" className={styles.section}>
            <div className={styles.ambientGlow} />

            <div className={styles.container}>
                <motion.div
                    className={styles.resumeCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.cardGlowTop} />

                    <div className={styles.eyebrow}>
                        <FaGraduationCap size={14} />
                        <span>Curriculum Vitae</span>
                    </div>

                    <h2 className={styles.title}>Professional Resume</h2>

                    <p className={styles.summary}>{resumeSummary}</p>

                    <div className={styles.skillsPills}>
                        {HIGHLIGHT_SKILLS.map((skill, idx) => (
                            <span key={idx} className={styles.pill}>
                                <FaCheckCircle size={10} color="var(--accent)" style={{ marginRight: '6px' }} />
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className={styles.buttonGroup}>
                        <motion.button
                            className={styles.primaryBtn}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <FaEye size={16} /> Open Resume Preview
                        </motion.button>

                        {fileUrl && (
                            <motion.a
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.secondaryBtn}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FaDownload size={14} /> Download PDF
                            </motion.a>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── Slide-Over Right Side Drawer ── */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <div className={styles.drawerBackdrop} onClick={() => setIsDrawerOpen(false)}>
                        <motion.div
                            className={styles.drawerPanel}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drawer Header */}
                            <div className={styles.drawerHeader}>
                                <div className={styles.drawerHeaderLeft}>
                                    <div className={styles.drawerIcon}>
                                        <FaFileAlt size={18} />
                                    </div>
                                    <div>
                                        <h3 className={styles.drawerTitle}>Dev Saini — Resume</h3>
                                        <span className={styles.drawerSubtitle}>Computer Science (Artificial Intelligence and Machine Learning)</span>
                                    </div>
                                </div>

                                <div className={styles.drawerActions}>
                                    {fileUrl && (
                                        <>
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.drawerActionBtn}
                                                title="Open in new tab"
                                            >
                                                <FaExternalLinkAlt size={11} /> Tab
                                            </a>
                                            <a
                                                href={fileUrl}
                                                download
                                                className={styles.drawerActionBtn}
                                                title="Download PDF"
                                            >
                                                <FaDownload size={11} /> PDF
                                            </a>
                                        </>
                                    )}

                                    <button
                                        className={styles.closeDrawerBtn}
                                        onClick={() => setIsDrawerOpen(false)}
                                        aria-label="Close"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Body — Interactive PDF Viewer */}
                            <div className={styles.drawerBody}>
                                {fileUrl ? (
                                    <iframe
                                        src={`${fileUrl}#view=FitH`}
                                        className={styles.pdfFrame}
                                        title="Dev Saini Resume Preview"
                                    />
                                ) : (
                                    <div className={styles.emptyState}>
                                        <FaFileAlt size={44} style={{ opacity: 0.3 }} />
                                        <p>No resume PDF currently uploaded.</p>
                                        <p style={{ fontSize: '12px', opacity: 0.6 }}>
                                            Upload your resume PDF from the Admin Panel.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Drawer Footer */}
                            <div className={styles.drawerFooter}>
                                <span>Chandigarh University • 2024–2028</span>
                                <span>Press Esc to close</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
