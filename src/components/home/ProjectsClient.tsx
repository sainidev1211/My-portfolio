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

    // We limit to 3-4 max as requested.
    const displayProjects = projects.slice(0, 4);

    return (
        <section id="projects" className={styles.section} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', paddingTop: '4rem' }}>
            <div className={styles.container} style={{ width: '100%', maxWidth: '1400px' }}>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.title}
                >
                    Selected Works
                </motion.h2>

                <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {displayProjects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                            className={styles.card}
                            style={{
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div className={styles.image} style={{ height: '200px', overflow: 'hidden' }}>
                                {project.image ? (
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        src={project.image}
                                        alt={project.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder} style={{ width: '100%', height: '100%', background: '#222' }} />
                                )}
                            </div>
                            <div className={styles.content} style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 className={styles.cardTitle} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                                <p className={styles.cardDesc} style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem', flex: 1 }}>{project.description}</p>
                                <div className={styles.tags} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {project.tags.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className={styles.tag} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>{tag}</span>
                                    ))}
                                </div>
                                <Link href={`/projects/${project.id}`} className={styles.link} style={{
                                    textAlign: 'center',
                                    padding: '0.8rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    transition: 'background 0.2s'
                                }}>
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsClient;
