"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Certifications.module.css';
import { FaAward, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

const categories = ["All", "AI", "Web", "Cloud", "Other"];

const CertificationsClient = () => {
    const [certs, setCerts] = useState<any[]>([]);
    const [filteredCerts, setFilteredCerts] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedCert, setSelectedCert] = useState<any>(null);

    useEffect(() => {
        // Fetch public content
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                const certificates = data.certifications || [];
                setCerts(certificates);
                setFilteredCerts(certificates);
            })
            .catch(err => console.error("Failed to load certifications", err));
    }, []);

    const handleFilter = (category: string) => {
        setActiveFilter(category);
        if (category === "All") {
            setFilteredCerts(certs);
        } else {
            setFilteredCerts(certs.filter(c => c.category === category));
        }
    };

    return (
        <section className={styles.section} id="certifications">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={styles.header}
            >
                <h2 className={styles.title}>Certifications & Achievements</h2>
                <p className={styles.subtitle}>Recognitions that validate my expertise and dedication to learning.</p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={styles.filterContainer}
            >
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.filterButton} ${activeFilter === cat ? styles.activeFilter : ''}`}
                        onClick={() => handleFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Grid */}
            <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filteredCerts.map((cert) => (
                        <motion.div
                            key={cert.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className={styles.card}
                            onClick={() => setSelectedCert(cert)}
                        >
                            <div className={styles.imageWrapper}>
                                {cert.image ? (
                                    <img src={cert.image} alt={cert.title} className={styles.certImage} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaAward size={40} color="#555" />
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{cert.title}</h3>
                                <div className={styles.cardIssuer}>{cert.issuer}</div>
                                <div className={styles.cardMeta}>
                                    <span>{cert.date}</span>
                                    <button className={styles.viewButton}>View Details</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setSelectedCert(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeButton} onClick={() => setSelectedCert(null)}><FaTimes /></button>
                            <div className={styles.modalBody}>
                                <div>
                                    {selectedCert.image ? (
                                        <img src={selectedCert.image} alt={selectedCert.title} className={styles.modalImage} />
                                    ) : (
                                        <div style={{ width: '100%', aspectRatio: '16/9', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaAward size={60} color="#555" />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.modalDetails}>
                                    <h2>{selectedCert.title}</h2>
                                    <h3>{selectedCert.issuer}</h3>
                                    <p style={{ color: '#aaa', marginBottom: '1rem' }}>Issued: {selectedCert.date} • {selectedCert.category}</p>

                                    {selectedCert.link && (
                                        <a href={selectedCert.link} target="_blank" rel="noopener noreferrer" className={styles.verifyLink}>
                                            Verify Certificate <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CertificationsClient;
