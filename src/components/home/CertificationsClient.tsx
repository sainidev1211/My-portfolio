"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Certifications.module.css';
import {
    FaExternalLinkAlt,
    FaTimes,
    FaCertificate,
    FaCheckCircle,
    FaAward,
    FaChevronLeft,
    FaChevronRight,
    FaSearch
} from 'react-icons/fa';

interface Cert {
    id?: string | number;
    title: string;
    issuer: string;
    date: string;
    category?: string;
    image?: string;
    link?: string;
}

export default function CertificationsClient() {
    const [certs, setCerts] = useState<Cert[]>([]);
    const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch certificates from content.certifications (from DB)
    useEffect(() => {
        setIsLoading(true);
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                setCerts(data.certifications || []);
            })
            .catch(err => console.error("[CertificationsClient] fetch error:", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Close modal on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedCert(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Manual horizontal scroll arrows
    const scroll = useCallback((dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    }, []);

    // Derived category list
    const categories = ["All", ...Array.from(new Set(certs.map(c => c.category).filter(Boolean))) as string[]];

    // Filter logic
    const filteredCerts = certs.filter(cert => {
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const titleMatch = (cert.title || '').toLowerCase().includes(q);
            const issuerMatch = (cert.issuer || '').toLowerCase().includes(q);
            const catMatch = (cert.category || '').toLowerCase().includes(q);
            if (!titleMatch && !issuerMatch && !catMatch) return false;
        }
        if (activeCategory === "All") return true;
        return cert.category === activeCategory;
    });

    const isFiltered = searchQuery.trim() || activeCategory !== "All";

    // Duplicate for seamless infinite marquee loop when not filtered
    const displayCerts = filteredCerts.length > 0
        ? (filteredCerts.length < 5
            ? [...filteredCerts, ...filteredCerts, ...filteredCerts]
            : [...filteredCerts, ...filteredCerts])
        : [];

    return (
        <section className={styles.section} id="certifications">
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.eyebrow}>&lt; credentials /&gt;</span>
                    <h2 className={styles.title}>
                        Certifications &amp; Badges
                        {certs.length > 0 && (
                            <span className={styles.countBadge}>{certs.length} Verified</span>
                        )}
                    </h2>
                    <p className={styles.subtitle}>
                        Verified specializations across Machine Learning, Full-Stack Architecture, and AI Systems.
                    </p>
                </div>

                {/* Controls Bar (Search + Categories + Left/Right Arrows) */}
                <div className={styles.controlsRow}>
                    <div className={styles.searchWrapper}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search certificates..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className={styles.clearSearchBtn}>
                                <FaTimes size={11} />
                            </button>
                        )}
                    </div>

                    {categories.length > 2 && (
                        <div className={styles.filterContainer}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={styles.sliderNavButtons}>
                        <button className={styles.navArrowBtn} onClick={() => scroll('left')} aria-label="Previous">
                            <FaChevronLeft size={11} />
                        </button>
                        <button className={styles.navArrowBtn} onClick={() => scroll('right')} aria-label="Next">
                            <FaChevronRight size={11} />
                        </button>
                    </div>
                </div>

                {/* Auto-Slide Marquee Outer Wrapper */}
                <div className={styles.sliderOuterWrapper}>
                    <div className={styles.fadeLeft} />
                    <div className={styles.fadeRight} />

                    {isLoading ? (
                        <div className={styles.sliderScrollContainer} ref={scrollRef}>
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonDetails}>
                                        <div className={styles.skeletonTitle} />
                                        <div className={styles.skeletonMeta} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredCerts.length === 0 ? (
                        <div className={styles.noResults}>
                            <p>No certificates found matching "{searchQuery || activeCategory}".</p>
                            <button
                                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                                className={styles.resetBtn}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        isFiltered ? (
                            <div className={styles.sliderScrollContainer} ref={scrollRef}>
                                {filteredCerts.map((cert, idx) => (
                                    <CertCard
                                        key={`${cert.id || idx}-${idx}`}
                                        cert={cert}
                                        onSelect={setSelectedCert}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.sliderScrollContainer} ref={scrollRef}>
                                <div className={styles.marqueeTrack}>
                                    {displayCerts.map((cert, idx) => (
                                        <CertCard
                                            key={`${cert.id || idx}-${idx}`}
                                            cert={cert}
                                            onSelect={setSelectedCert}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Detail Modal */}
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
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className={styles.detailCard}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className={styles.detailClose}
                                onClick={() => setSelectedCert(null)}
                                aria-label="Close"
                            >
                                <FaTimes size={14} />
                            </button>

                            <div className={styles.modalImageContainer}>
                                {selectedCert.image ? (
                                    <img src={selectedCert.image} alt={selectedCert.title} className={styles.detailImage} />
                                ) : (
                                    <div className={styles.placeholderImgModal}>
                                        <FaCertificate size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                        <span>Verified Credential</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.detailContent}>
                                <div className={styles.modalMetaRow}>
                                    <span className={styles.modalIssuerBadge}>{selectedCert.issuer}</span>
                                    {selectedCert.date && (
                                        <span className={styles.modalDate}>{selectedCert.date}</span>
                                    )}
                                </div>

                                <h3 className={styles.detailTitle}>{selectedCert.title}</h3>

                                {selectedCert.link && (
                                    <a
                                        href={selectedCert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.verifyButton}
                                    >
                                        Verify Certificate Online <FaExternalLinkAlt size={12} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ── Compact Certificate Card for Auto-Slide Track ────────────────────────────
function CertCard({ cert, onSelect }: { cert: Cert; onSelect: (c: Cert) => void }) {
    return (
        <div className={styles.card} onClick={() => onSelect(cert)}>
            <div className={styles.imageArea}>
                {cert.image ? (
                    <img src={cert.image} alt={cert.title} className={styles.image} />
                ) : (
                    <div className={styles.placeholderImg}>
                        <FaAward size={30} style={{ opacity: 0.4, marginBottom: '6px' }} />
                        <span>Certificate Preview</span>
                    </div>
                )}

                {cert.category && (
                    <div className={styles.certCategoryBadge}>{cert.category}</div>
                )}
                <div className={styles.cardHoverOverlay}>
                    <span className={styles.viewLabel}>View Certificate ↗</span>
                </div>
            </div>

            <div className={styles.contentArea}>
                <div className={styles.issuerRow}>
                    <span className={styles.cardIssuer}>
                        <FaCheckCircle size={10} color="var(--accent)" /> {cert.issuer}
                    </span>
                    <span className={styles.cardDate}>{cert.date}</span>
                </div>
                <h3 className={styles.cardTitle}>{cert.title}</h3>
                <div className={styles.cardFooter}>
                    <span className={styles.linkText}>View Credential →</span>
                </div>
            </div>
        </div>
    );
}
