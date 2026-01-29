import React from 'react';
import Link from 'next/link';
import styles from './project.module.css';
import { getContent } from '@/lib/data';

import { getRandomQuote } from '@/lib/quotes';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const resolvedParams = await params;
    const content = await getContent();
    const project = content?.projects.find((p: any) => p.id == resolvedParams.id);
    const quote = getRandomQuote();

    if (!project) {
        return <div style={{ padding: '8rem', textAlign: 'center' }}>Project not found</div>;
    }

    return (
        <div className={styles.container}>
            <Link href="/#projects" className={styles.backLink}>
                &larr; Back to Projects
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>{project.title}</h1>
                <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.6, fontSize: '1rem' }}>“{quote}”</p>
                <div className={styles.meta}>
                    <div className={styles.tags}>
                        {project.tags.map((tag: string) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    {project.image ? (
                        <img src={project.image} alt={project.title} className={styles.image} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #111, #222)' }} />
                    )}
                </div>

                <div className={styles.details}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Overview</h3>
                        <p className={styles.description}>{project.longDescription || project.description}</p>
                    </div>

                    {project.features && (
                        <div className={styles.features}>
                            <h3 style={{ fontSize: '1.5rem' }}>Key Features</h3>
                            <ul className={styles.featureList}>
                                {project.features.map((feature: string, idx: number) => (
                                    <li key={idx} className={styles.featureItem}>
                                        <span className={styles.check}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.technologies && (
                        <div className={styles.features}>
                            <h3 style={{ fontSize: '1.5rem' }}>Technologies</h3>
                            <div className={styles.tags} style={{ justifyContent: 'flex-start' }}>
                                {project.technologies.map((tech: string, idx: number) => (
                                    <span key={idx} className={styles.tag} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Visit Live Project
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
