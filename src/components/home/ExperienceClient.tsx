"use client";

import React, { useEffect, useState } from 'react';
import styles from './Experience.module.css';
import { motion } from 'framer-motion';

interface ExperienceProps {
    initialExperience?: any[];
}

export default function ExperienceClient({ initialExperience = [] }: ExperienceProps) {
    const [experiences, setExperiences] = useState<any[]>(initialExperience);
    const [isLoading, setIsLoading] = useState(!initialExperience.length);

    useEffect(() => {
        if (!initialExperience.length) {
            fetch('/api/content')
                .then(res => res.json())
                .then(data => {
                    if (data.experience && data.experience.length) {
                        setExperiences(data.experience);
                    }
                })
                .catch(err => console.error("Failed to load experience", err))
                .finally(() => setIsLoading(false));
        }
    }, [initialExperience]);

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

        const anims = document.querySelectorAll('#experience .animate-on-scroll');
        anims.forEach(el => observer.observe(el));

        return () => {
            anims.forEach(el => observer.unobserve(el));
        };
    }, [experiences]);

    return (
        <section id="experience" className={styles.section}>
            <div className={`${styles.header} animate-on-scroll`}>
                <span className={styles.eyebrow}>&lt; journey /&gt;</span>
                <h2 className={styles.title}>Experience &amp; Education</h2>
                <p className={styles.subtitle}>
                    My academic journey at Chandigarh University and engineering track record.
                </p>
            </div>

            <div className={styles.timeline}>
                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.id || index}
                        className={`${styles.timelineItem} animate-on-scroll`}
                        style={{ transitionDelay: `${index * 120}ms` }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className={styles.timelineNode} />
                        
                        <div className={styles.timelineCard}>
                            <div className={styles.cardMeta}>
                                <span className={styles.periodBadge}>{exp.period}</span>
                                {exp.type && <span className={styles.typeBadge}>{exp.type}</span>}
                            </div>

                            <h3 className={styles.roleTitle}>{exp.role}</h3>
                            <div className={styles.companyName}>{exp.company}</div>
                            {exp.location && <div className={styles.location}>{exp.location}</div>}
                            
                            {exp.description && (
                                <p className={styles.description}>{exp.description}</p>
                            )}

                            {exp.highlights && exp.highlights.length > 0 && (
                                <ul className={styles.highlightsList}>
                                    {exp.highlights.map((h: string, idx: number) => (
                                        <li key={idx} className={styles.highlightItem}>{h}</li>
                                    ))}
                                </ul>
                            )}

                            {exp.technologies && exp.technologies.length > 0 && (
                                <div className={styles.techGrid}>
                                    {exp.technologies.map((t: string) => (
                                        <span key={t} className={styles.techPill}>{t}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
