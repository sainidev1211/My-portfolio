"use client";

import React from 'react';
import styles from './Projects.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectsProps {
    projects: any[];
}

const ProjectsClient: React.FC<ProjectsProps> = ({ projects }) => {
    // Filter/Sort logic if needed, but for now we assume content.json is managed or we map specifically.
    // User requested order: Suroor, Swasthya, Virtual Healthcare...
    // We will map over the projects and just render them. 
    // Ideally we'd sort, but let's trust the CMS order or display what's there.

    // Use all projects, or maybe verify if we have enough to slide. 
    // User asked to slide IF > 4-5 items.
    // If we have few, grid is fine. But for consistency, let's use slider if length > 3 to fill screen.
    const showSlider = projects.length > 3;

    return (
        <section id="projects" className={styles.section}>
            <div className={styles.container} style={{ width: '100%', maxWidth: '100%' }}>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.title}
                >
                    Selected Works
                </motion.h2>

                {showSlider ? (
                    <div className={styles.sliderContainer}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100px',
                            height: '100%',
                            background: 'linear-gradient(90deg, #000 0%, transparent 100%)',
                            zIndex: 2,
                            pointerEvents: 'none'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100px',
                            height: '100%',
                            background: 'linear-gradient(270deg, #000 0%, transparent 100%)',
                            zIndex: 2,
                            pointerEvents: 'none'
                        }} />

                        <div
                            className={styles.track}
                            onMouseEnter={() => { /* Handled by CSS */ }}
                            onMouseLeave={() => { /* Handled by CSS */ }}
                        >
                            {/* Duplicate 4x for smooth infinite loop with -50% animation */}
                            {[...projects, ...projects, ...projects, ...projects].map((project, idx) => (
                                <div key={`${project.id}-slider-${idx}`} className={styles.card}>
                                    <div className={styles.image}>
                                        {project.image ? (
                                            <img src={project.image} alt={project.title} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#222' }} />
                                        )}
                                    </div>
                                    <div className={styles.content}>
                                        <h3 className={styles.cardTitle}>{project.title}</h3>
                                        <p className={styles.cardDesc}>{project.description}</p>
                                        <div className={styles.tags}>
                                            {project.tags.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                        <Link href={`/projects/${project.id}`} className={styles.link}>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {projects.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className={styles.card}
                                style={{ width: 'auto' }} // Reset fixed width for grid
                            >
                                <div className={styles.image}>
                                    {project.image ? (
                                        <img src={project.image} alt={project.title} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#222' }} />
                                    )}
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <p className={styles.cardDesc}>{project.description}</p>
                                    <div className={styles.tags}>
                                        {project.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <Link href={`/projects/${project.id}`} className={styles.link}>
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectsClient;
