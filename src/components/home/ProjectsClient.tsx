"use client";

import React from 'react';
import styles from './Projects.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectsProps {
    projects: any[];
}

const ProjectsClient: React.FC<ProjectsProps> = ({ projects }) => {
    // Logic: Always show slider if more than 3, else grid
    const showSlider = projects.length > 3;

    const renderGrid = (items: any[]) => (
        <div className={styles.grid}>
            {items.map((project, idx) => (
                <motion.div
                    key={`${project.id}-grid-${idx}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className={styles.card}
                    style={{ width: 'auto' }} // Grid card width
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
    );

    return (
        <section id="projects" className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className={`${styles.title} text-gradient`}
                >
                    Selected Works
                </motion.h2>

                {showSlider ? (
                    <>
                        {/* Desktop Slider View */}
                        <div className={`${styles.sliderContainer} ${styles.desktopSlider}`}>
                            <div
                                className={styles.track}
                                onMouseEnter={() => { /* Handled by CSS */ }}
                                onMouseLeave={() => { /* Handled by CSS */ }}
                            >
                                {/* Duplicate 4x for smooth infinite loop */}
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

                        {/* Mobile Grid View Fallback */}
                        <div className={styles.mobileGrid}>
                            {renderGrid(projects)}
                        </div>
                    </>
                ) : (
                    renderGrid(projects)
                )}
            </div>
        </section>
    );
};

export default ProjectsClient;
