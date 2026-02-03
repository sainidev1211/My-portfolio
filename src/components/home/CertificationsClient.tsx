"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Certifications.module.css';
import { FaAward, FaExternalLinkAlt, FaTimes, FaChevronDown, FaCheckCircle } from 'react-icons/fa';

// Helper to get description based on category
const getCategoryInfo = (category: string) => {
    const map: Record<string, { desc: string, keywords: string[] }> = {
        'Data Analysis': {
            desc: "Transforming raw data into actionable insights through statistical analysis and visualization.",
            keywords: ["Python", "Pandas", "SQL", "Tableau", "Excel"]
        },
        'Machine Learning': {
            desc: "Building predictive models and intelligent systems using advanced algorithms.",
            keywords: ["TensorFlow", "Scikit-Learn", "Deep Learning", "NLP"]
        },
        'Productivity Tools': {
            desc: "Mastering tools and methodologies to enhance workflow efficiency and collaboration.",
            keywords: ["Agile", "Jira", "Office 365", "Notion"]
        },
        'General': {
            desc: "Foundational certifications demonstrating a commitment to continuous learning.",
            keywords: ["Professional Development", "Soft Skills"]
        }
    };
    return map[category] || {
        desc: "Specialized certifications validating expertise in this domain.",
        keywords: [category]
    };
};

const CertificationsClient = () => {
    const [certs, setCerts] = useState<any[]>([]);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    useEffect(() => {
        // Fetch public content
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                const certificates = data.certifications || [];
                setCerts(certificates);
            })
            .catch(err => console.error("Failed to load certifications", err));
    }, []);

    // Group certs by category
    const groupedCerts = useMemo(() => {
        const groups: Record<string, any[]> = {};

        certs.forEach(cert => {
            const cat = cert.category || 'General';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(cert);
        });

        // Ensure we have some order, maybe priorities predefined
        return Object.entries(groups).sort((a, b) => {
            const prio = ['Data Analysis', 'Machine Learning', 'Productivity Tools', 'General'];
            const idxA = prio.indexOf(a[0]);
            const idxB = prio.indexOf(b[0]);
            // If both in list, sort by index. If one not in list, put it before General (last).
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a[0].localeCompare(b[0]);
        });
    }, [certs]);

    const toggleExpand = (category: string) => {
        setExpandedCard(expandedCard === category ? null : category);
    };

    return (
        <section className={styles.section} id="certifications">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={styles.header}
            >
                <h2 className={styles.title}>Skills Backed by Industry Certifications</h2>
                <p className={styles.subtitle}>Each skill is supported by verified learning and hands-on practice.</p>
            </motion.div>

            <div className={styles.grid}>
                {groupedCerts.map(([category, items], index) => {
                    const info = getCategoryInfo(category);
                    const isExpanded = expandedCard === category;

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={styles.skillCard}
                            data-expanded={isExpanded}
                            onClick={() => toggleExpand(category)}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.categoryTitle}>
                                    {category}
                                    <span className={styles.countBadge}>{items.length} certs</span>
                                </div>
                                <p className={styles.description}>{info.desc}</p>
                            </div>

                            <div className={styles.keywords}>
                                {info.keywords.map(k => (
                                    <span key={k} className={styles.keyword}>{k}</span>
                                ))}
                            </div>

                            <div className={styles.viewCredentials}>
                                View Credentials <FaChevronDown size={12} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </div>

                            <div className={styles.certList}>
                                {items.slice(0, 4).map(cert => (
                                    <a
                                        key={cert.id}
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.certItem}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FaCheckCircle className={styles.certIcon} />
                                        <div>
                                            <div className={styles.certTitle}>{cert.title}</div>
                                            <div className={styles.certIssuer}>{cert.issuer}</div>
                                        </div>
                                    </a>
                                ))}
                                {items.length > 4 && (
                                    <div className={styles.moreCerts}>+ {items.length - 4} more credentials</div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default CertificationsClient;
