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
                transition={{ duration: 0.8 }}
                className={styles.header}
            >
                <h2 className={styles.title}>Certifications & Achievements</h2>
                <p className={styles.subtitle}>Recognitions that validate my expertise and dedication to learning.</p>
            </motion.div>



            {/* Infinite Slider */}
            <div className={styles.sliderContainer} style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
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
                    {/* 
                        We duplicate the content 4 times to ensure we have enough length 
                        to scroll -50% smoothly even on wide screens.
                        Set 1 & 2 will scroll out, replcaed by Set 3 & 4.
                    */}
                    {[...certs, ...certs, ...certs, ...certs].map((cert, index) => (
                        <div
                            key={`${cert.id}-${index}`}
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
                                    <p style={{ color: '#aaa', marginBottom: '1rem' }}>Issued: {selectedCert.date}</p>

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
        </section >
    );
};

export default CertificationsClient;
