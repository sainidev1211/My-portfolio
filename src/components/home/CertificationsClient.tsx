"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Certifications.module.css';
import { FaAward, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

const CertificationsClient = () => {
    const [certs, setCerts] = useState<any[]>([]);
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

    return (
        <section className={styles.section} id="certifications">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className={styles.header}
            >
                <h2 className={styles.title}>Certifications & Achievements</h2>
                <p className={styles.subtitle}>Recognitions that validate my expertise and dedication to learning.</p>
            </motion.div>

            {/* Infinite Slider (Desktop) & Grid (Mobile) */}
            <div className={styles.sliderContainer}>
                {/* Desktop Slider View */}
                <div className={styles.desktopSlider}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100px', height: '100%',
                        background: 'linear-gradient(90deg, #000 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute', top: 0, right: 0, width: '100px', height: '100%',
                        background: 'linear-gradient(270deg, #000 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none'
                    }} />

                    <div
                        className={styles.track}
                        onMouseEnter={() => { /* Handled by CSS */ }}
                        onMouseLeave={() => { /* Handled by CSS */ }}
                    >
                        {/* Duplicate 4x for smooth infinite loop */}
                        {[...certs, ...certs, ...certs, ...certs].map((cert, index) => (
                            <div
                                key={`${cert.id}-slider-${index}`}
                                className={styles.card}
                                onClick={() => setSelectedCert(cert)}
                            >
                                <div className={styles.image}>
                                    {cert.image ? (
                                        <img src={cert.image} alt={cert.title} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaAward size={40} color="#555" />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.content}>
                                    <div>
                                        <h3 className={styles.cardTitle}>{cert.title}</h3>
                                        <div className={styles.issuer}>{cert.issuer}</div>
                                        <div className={styles.date}>{cert.date}</div>
                                    </div>
                                    <button className={styles.viewButton}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Grid View */}
                <div className={styles.mobileGrid}>
                    {certs.map((cert, index) => (
                        <div
                            key={`${cert.id}-mobile-${index}`}
                            className={styles.card}
                            onClick={() => setSelectedCert(cert)}
                            style={{ width: '100%', maxWidth: '400px' }} // Ensure full width
                        >
                            <div className={styles.image}>
                                {cert.image ? (
                                    <img src={cert.image} alt={cert.title} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaAward size={40} color="#555" />
                                    </div>
                                )}
                            </div>
                            <div className={styles.content}>
                                <div>
                                    <h3 className={styles.cardTitle}>{cert.title}</h3>
                                    <div className={styles.issuer}>{cert.issuer}</div>
                                    <div className={styles.date}>{cert.date}</div>
                                </div>
                                <button className={styles.viewButton}>View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
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
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.closeButton} onClick={() => setSelectedCert(null)}><FaTimes /></button>
                            <div className={styles.modalBody}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '12px', padding: '1rem' }}>
                                    {selectedCert.image ? (
                                        <img src={selectedCert.image} alt={selectedCert.title} className={styles.modalImage} />
                                    ) : (
                                        <FaAward size={80} color="#555" />
                                    )}
                                </div>
                                <div className={styles.modalDetails}>
                                    <h3>{selectedCert.title}</h3>
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{selectedCert.issuer}</h4>
                                    <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: '1.6' }}>
                                        This certification was issued on {selectedCert.date}. It validates core competencies in {selectedCert.title}.
                                    </p>

                                    {selectedCert.link && (
                                        <a href={selectedCert.link} target="_blank" rel="noopener noreferrer" className={styles.verifyLink} style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.8rem 1.5rem',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            fontWeight: '600'
                                        }}>
                                            Verify Certificate <FaExternalLinkAlt size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
};

export default CertificationsClient;
