"use client";

import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaCode, FaBrain, FaServer, FaTools, FaFileDownload, FaTimes, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface AboutResumeProps {
    aboutData?: any;
    resumeData?: any;
}

const SKILL_CATEGORIES = [
    { name: "All", filter: null },
    { name: "AI & ML", keywords: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "llm", "ai", "data analysis"] },
    { name: "Software & Web", keywords: ["react", "next.js", "node.js", "typescript", "full stack", "tailwind", "restful", "c++", "software"] },
    { name: "Database & Cloud", keywords: ["mongodb", "postgresql", "mysql", "docker", "git", "aws"] }
];

export default function AboutResumeClient({ aboutData = {}, resumeData = {} }: AboutResumeProps) {
    const text1 = aboutData.text1 || "I am a Computer Science Engineering student specializing in Artificial Intelligence and Machine Learning at Chandigarh University with a deep passion for building intelligent AI systems, software engineering, Python architectures, and scalable full-stack applications.";
    const text2 = aboutData.text2 || "My journey involves continuously mastering core machine learning concepts, developing modern web platforms with React and Next.js, building robust backend architectures, and engineering automated data-driven pipelines.";
    const skills: string[] = aboutData.skills || ["Python", "Machine Learning Concepts", "TensorFlow", "PyTorch", "Software Engineering", "Full Stack Development", "Next.js", "React.js", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS", "Git"];
    const image = aboutData.image || "/images/dev-profile.jpg";
    const secondaryImage = aboutData.secondaryImage || "/images/dev-hero.jpg";

    const [activeSkillCat, setActiveSkillCat] = useState("All");
    const [resumeOpen, setResumeOpen] = useState(false);
    const [activePhoto, setActivePhoto] = useState<0 | 1>(0);

    // IntersectionObserver scroll trigger
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

        const anims = document.querySelectorAll('#about .animate-on-scroll');
        anims.forEach(el => observer.observe(el));

        return () => {
            anims.forEach(el => observer.unobserve(el));
        };
    }, []);

    // Filter skills based on selected category
    const filteredSkills = skills.filter(skill => {
        if (activeSkillCat === "All") return true;
        const currentCat = SKILL_CATEGORIES.find(c => c.name === activeSkillCat);
        if (!currentCat || !currentCat.keywords) return true;
        const sLower = skill.toLowerCase();
        return currentCat.keywords.some(k => sLower.includes(k));
    });

    const displayPhotos = [image, secondaryImage].filter(Boolean);

    return (
        <section className={styles.section} id="about">
            <div className={styles.backgroundGlow} />

            <div className={styles.container}>
                {/* Left Column (58%): Bio, Education, Currently, Tech Stack */}
                <div className={styles.leftColumn}>
                    <span className={`${styles.eyebrow} animate-on-scroll`}>&lt; about /&gt;</span>
                    <h2 className={`${styles.title} animate-on-scroll`}>Engineering &amp; Intelligence.</h2>

                    {/* Bio text */}
                    <div className={`${styles.bioContainer} animate-on-scroll`}>
                        <p className={styles.bioText}>{text1}</p>
                        {text2 && <p className={styles.bioText}>{text2}</p>}
                    </div>

                    {/* Education Card */}
                    <div className={`${styles.educationCard} animate-on-scroll`} style={{ transitionDelay: '80ms' }}>
                        <div className={styles.eduHeader}>
                            <div className={styles.eduIconWrapper}>
                                <FaGraduationCap size={20} />
                            </div>
                            <div>
                                <h4 className={styles.eduDegree}>B.E. in Computer Science &amp; Engineering (Artificial Intelligence and Machine Learning)</h4>
                                <div className={styles.eduInstitution}>Chandigarh University</div>
                            </div>
                        </div>
                        <div className={styles.eduMeta}>
                            <span><FaCalendarAlt size={12} /> 2024 — 2028</span>
                            <span><FaMapMarkerAlt size={12} /> Mohali, Punjab, India</span>
                        </div>
                    </div>

                    {/* Currently Block */}
                    <div className={`${styles.currentlyCard} animate-on-scroll`} style={{ transitionDelay: '120ms' }}>
                        <h4 className={styles.currentlyTitle}>Currently Pursuing</h4>
                        <ul className={styles.currentlyList}>
                            {aboutData.currently && aboutData.currently.length > 0 ? (
                                aboutData.currently.map((c: string, idx: number) => (
                                    <li key={idx}>{c}</li>
                                ))
                            ) : (
                                <>
                                    <li>🎓 B.E. Computer Science (Artificial Intelligence and Machine Learning) @ Chandigarh University</li>
                                    <li>⚡ Software engineering, Python development &amp; AI architectures</li>
                                    <li>🚀 Open to software engineering &amp; AI/ML engineering internships</li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Tech Stack Container with Category Tabs */}
                    <div className={`${styles.techStackContainer} animate-on-scroll`} style={{ transitionDelay: '160ms' }}>
                        <div className={styles.techHeader}>
                            <h4 className={styles.techStackLabel}>Core Technologies &amp; Domains</h4>
                            <div className={styles.categoryPills}>
                                {SKILL_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setActiveSkillCat(cat.name)}
                                        className={`${styles.catBtn} ${activeSkillCat === cat.name ? styles.catBtnActive : ''}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.div layout className={styles.skillsGrid}>
                            <AnimatePresence mode="popLayout">
                                {filteredSkills.map((skill: string) => (
                                    <motion.div
                                        key={skill}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className={styles.skillItem}
                                    >
                                        {skill}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column (42%): Profile Cards & Resume Toggle */}
                <div className={styles.rightColumn}>
                    <div className={`${styles.profileCard} animate-on-scroll`} style={{ transitionDelay: '100ms' }}>
                        <div className={styles.photoContainer}>
                            <img 
                                src={displayPhotos[activePhoto] || image} 
                                alt="Dev Saini" 
                                className={styles.profileImage} 
                            />
                            {displayPhotos.length > 1 && (
                                <div className={styles.photoNav}>
                                    {displayPhotos.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActivePhoto(idx as 0 | 1)}
                                            className={`${styles.photoDot} ${activePhoto === idx ? styles.photoDotActive : ''}`}
                                            aria-label={`Photo ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.profileBadge}>
                            <span className={styles.profileName}>Dev Saini</span>
                            <span className={styles.profileRole}>AI &amp; ML Engineer • Software Engineer</span>
                        </div>

                        <div className={styles.statsRow}>
                            <span>Software Engineer</span>
                            <span className={styles.statsDivider}>•</span>
                            <span>Python Dev</span>
                            <span className={styles.statsDivider}>•</span>
                            <span>Full Stack Dev</span>
                        </div>

                        <div className={styles.actionButtons}>
                            <button
                                onClick={() => setResumeOpen(true)}
                                className={styles.viewResumeBtn}
                            >
                                View Resume Preview
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen / Modal Resume Preview */}
            <AnimatePresence>
                {resumeOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setResumeOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div>
                                    <h3 className={styles.modalTitle}>Dev Saini — Curriculum Vitae</h3>
                                    <span className={styles.modalSubtitle}>Chandigarh University (Artificial Intelligence &amp; Machine Learning)</span>
                                </div>
                                <div className={styles.modalActions}>
                                    {resumeData.fileUrl && (
                                        <a
                                            href={resumeData.fileUrl}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.downloadBtn}
                                        >
                                            <FaFileDownload /> Download PDF
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => setResumeOpen(false)}
                                        className={styles.closeBtn}
                                    >
                                        <FaTimes size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.modalBody}>
                                {resumeData.fileUrl ? (
                                    <iframe 
                                        src={`${resumeData.fileUrl}#view=FitH`} 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 'none' }} 
                                        title="Resume Preview"
                                    />
                                ) : (
                                    <div className={styles.placeholderResume}>
                                        No PDF resume uploaded yet. You can upload one in the admin panel!
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
