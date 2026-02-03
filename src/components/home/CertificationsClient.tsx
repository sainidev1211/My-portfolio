"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Certifications.module.css';
import { FaAward, FaExternalLinkAlt, FaTimes, FaArrowLeft, FaLayerGroup, FaRobot, FaChartLine, FaTools } from 'react-icons/fa';

// Helper to get description and icon based on category
const getCategoryInfo = (category: string) => {
    const map: Record<string, { desc: string, icon: any }> = {
        'Data Analysis': {
            desc: "Unlocking insights from raw data through statistical modeling and visualization.",
            icon: FaChartLine
        },
        'Machine Learning': {
            desc: "Designing intelligent systems with advanced predictive algorithms and deep learning.",
            icon: FaRobot
        },
        'Productivity Tools': {
            desc: "Mastering modern workflows and collaboration platforms for peak efficiency.",
            icon: FaTools
        },
        'General': {
            desc: "Broadening professional horizons with foundational skills and continuous learning.",
            icon: FaLayerGroup
        }
    };
    return map[category] || {
        desc: "Specialized expertise verified by industry leaders.",
        icon: FaAward
    };
};

const CertificationsClient = () => {
    const [certs, setCerts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedCert, setSelectedCert] = useState<any>(null);

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

        // Ensure defined order
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const prio = ['Data Analysis', 'Machine Learning', 'Productivity Tools', 'General'];
            const idxA = prio.indexOf(a);
            const idxB = prio.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });

        const sortedGroups: Record<string, any[]> = {};
        sortedKeys.forEach(k => sortedGroups[k] = groups[k]);
        return sortedGroups;
    }, [certs]);

    // Derived state for active view
    const activeCertificates = activeCategory ? groupedCerts[activeCategory] : [];
    const activeInfo = activeCategory ? getCategoryInfo(activeCategory) : null;

    return (
        <section className={styles.section} id="certifications">
            <div className={styles.header}>
                <h2 className={styles.title}>Skills Backed by Credentials</h2>
                <p className={styles.subtitle}>Navigate through my expertise to see verified proofs of knowledge.</p>
            </div>

            <div className={styles.viewContainer}>
                <AnimatePresence mode="wait">
                    {!activeCategory ? (
                        // CATEGORY VIEW
                        <motion.div
                            key="categories"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className={styles.categoryGrid}
                        >
                            {Object.entries(groupedCerts).map(([category, items], index) => {
                                const info = getCategoryInfo(category);
                                const Icon = info.icon;
                                return (
                                    <motion.div
                                        key={category}
                                        className={styles.categoryCard}
                                        onClick={() => setActiveCategory(category)}
                                        whileHover={{ y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className={styles.catIcon}><Icon /></div>
                                        <h3 className={styles.catName}>{category}</h3>
                                        <p className={styles.catDesc}>{info.desc}</p>
                                        <div className={styles.catFooter}>
                                            <span className={styles.catCount}>{items.length} Credentials</span>
                                            <span className={styles.exploreText}>Explore <FaArrowLeft style={{ transform: 'rotate(180deg)' }} /></span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        // CERTIFICATES VIEW
                        <motion.div
                            key="certificates"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className={styles.certViewHeader}>
                                <button className={styles.backButton} onClick={() => setActiveCategory(null)}>
                                    <FaArrowLeft /> Back to Categories
                                </button>
                                <div>
                                    <h3 className={styles.activeCatTitle}>{activeCategory}</h3>
                                    <p className={styles.activeCatDesc}>{activeInfo?.desc}</p>
                                </div>
                            </div>

                            <div className={styles.certGrid}>
                                {activeCertificates.map((cert) => (
                                    <motion.div
                                        key={cert.id}
                                        className={styles.certCard}
                                        onClick={() => setSelectedCert(cert)}
                                        whileHover={{ scale: 1.02 }}
                                        layoutId={`cert-${cert.id}`}
                                    >
                                        <div className={styles.certThumb}>
                                            {cert.image ? <img src={cert.image} alt={cert.title} /> : <FaAward size={40} color="#555" />}
                                        </div>
                                        <div className={styles.certDetails}>
                                            <div className={styles.certTitle}>{cert.title}</div>
                                            <div className={styles.certIssuer}>{cert.issuer}</div>
                                            <button className={styles.viewBtn}>View Details</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.detailModalOverlay}
                        onClick={() => setSelectedCert(null)}
                    >
                        <motion.div
                            className={styles.detailCard}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.detailClose} onClick={() => setSelectedCert(null)}><FaTimes /></button>

                            <div style={{ background: '#000', display: 'flex', justifyContent: 'center' }}>
                                {selectedCert.image ? (
                                    <img src={selectedCert.image} alt={selectedCert.title} className={styles.detailImage} />
                                ) : (
                                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaAward size={80} color="#555" /></div>
                                )}
                            </div>

                            <div className={styles.detailContent}>
                                <h3 className={styles.detailTitle}>{selectedCert.title}</h3>
                                <div className={styles.detailMeta}>{selectedCert.issuer} • {selectedCert.date}</div>

                                {selectedCert.link && (
                                    <a href={selectedCert.link} target="_blank" rel="noopener noreferrer" className={styles.verifyButton}>
                                        Verify Certificate <FaExternalLinkAlt />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CertificationsClient;
