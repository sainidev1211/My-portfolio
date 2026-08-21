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
    data?: {
        summary?: string;
        fileUrl?: string;
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
    const [resumeInfo, setResumeInfo] = useState({
        summary: data?.summary || "Computer Science undergraduate specializing in Artificial Intelligence and Machine Learning at Chandigarh University. Passionate about AI & ML engineering, software development, Python architectures, and scalable full-stack applications.",
        fileUrl: data?.fileUrl || ''
    });

    // Fetch live updated resume from DB / API
    useEffect(() => {
        fetch('/api/content', { cache: 'no-store' })
            .then(res => res.json())
            .then(res => {
                if (res.resume) {
                    setResumeInfo({
                        summary: res.resume.summary || resumeInfo.summary,
                        fileUrl: res.resume.fileUrl || ''
                    });
                }
            })
            .catch(err => console.error("Failed to fetch live resume:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const activeFileUrl = resumeInfo.fileUrl;
    const activeSummary = resumeInfo.summary;

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
                        <span>📄</span>
                        <span>Interactive Resume</span>
                    </div>

                    <h2 className={styles.title}>Curriculum Vitae</h2>

                    <p className={styles.summary}>{activeSummary}</p>

                    {/* Highlighted core skills pills */}
                    <div className={styles.skillsPills}>
                        {HIGHLIGHT_SKILLS.map((skill, index) => (
                            <span key={index} className={styles.pill}>
                                <FaCheckCircle size={11} style={{ marginRight: '6px', flexShrink: 0 }} />
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className={styles.primaryBtn}
                            aria-label="Open resume side panel"
                        >
                            <FaEye size={14} />
                            <span>Preview Full Resume</span>
                        </button>

                        {activeFileUrl && (
                            <a
                                href={activeFileUrl}
                                download
                                className={styles.secondaryBtn}
                                aria-label="Download resume PDF"
                            >
                                <FaDownload size={13} />
                                <span>Download PDF</span>
                            </a>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── Side Drawer (slides from right) ── */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Dimmed backdrop — clicking it closes the drawer */}
                        <motion.div
                            key="backdrop"
                            className={styles.drawerBackdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setIsDrawerOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Drawer Panel — sibling of backdrop, NOT nested inside it */}
                        <motion.div
                            key="panel"
                            className={styles.drawerPanel}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Resume Document Preview"
                        >
                            {/* Header */}
                            <div className={styles.drawerHeader}>
                                <div className={styles.drawerHeaderLeft}>
                                    <div className={styles.drawerIcon}>
                                        <FaFileAlt size={16} />
                                    </div>
                                    <div>
                                        <h3 className={styles.drawerTitle}>Dev Saini — Resume</h3>
                                        <p className={styles.drawerSubtitle}>
                                            <FaGraduationCap size={11} /> AI &amp; Machine Learning
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.drawerActions}>
                                    {activeFileUrl && (
                                        <>
                                            <a
                                                href={activeFileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.drawerActionBtn}
                                                title="Open in new tab"
                                            >
                                                <FaExternalLinkAlt size={11} /> Tab
                                            </a>
                                            <a
                                                href={activeFileUrl}
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
                                        aria-label="Close resume drawer"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Body — PDF iframe */}
                            <div className={styles.drawerBody}>
                                {activeFileUrl ? (
                                    <iframe
                                        src={`${activeFileUrl}#view=FitH`}
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

                            {/* Footer */}
                            <div className={styles.drawerFooter}>
                                <span>Chandigarh University • 2024–2028</span>
                                <span>Press Esc to close</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
