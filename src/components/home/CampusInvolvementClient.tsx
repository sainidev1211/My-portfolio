"use client";

import React, { useState, useEffect } from "react";
import styles from "./CampusInvolvement.module.css";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUniversity,
    FaTimes,
    FaExpandAlt,
    FaUsers,
    FaLaptopCode,
    FaTrophy,
    FaLightbulb,
    FaImage
} from "react-icons/fa";

interface CampusInvolvementProps {
    initialEvents?: any[];
}

export default function CampusInvolvementClient({ initialEvents = [] }: CampusInvolvementProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
    const [events, setEvents] = useState<any[]>(initialEvents);

    useEffect(() => {
        fetch('/api/content', { cache: 'no-store' })
            .then(res => res.json())
            .then(res => {
                if (res.campusInvolvement && res.campusInvolvement.length > 0) {
                    setEvents(res.campusInvolvement);
                }
            })
            .catch(err => console.error("Failed to load campus involvement:", err));
    }, []);

    // Close lightbox on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedPhoto(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'FaLaptopCode': return FaLaptopCode;
            case 'FaLightbulb': return FaLightbulb;
            case 'FaTrophy': return FaTrophy;
            case 'FaUsers': return FaUsers;
            default: return FaUsers;
        }
    };

    return (
        <section id="campus-activities" className={styles.section}>
            {/* ── Ambient Glows ── */}
            <div className={styles.glowLeft} />
            <div className={styles.glowRight} />

            <div className={styles.container}>
                {/* ── Section Header ── */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.eyebrow}>
                        <FaUniversity size={12} />
                        <span>Campus Life &amp; Innovation</span>
                    </div>
                    <h2 className={styles.title}>
                        Campus Involvement &amp;{" "}
                        <span className={styles.titleGradient}>Extra-Curricular Activities</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Hackathons, startup pitching, innovation challenges, workshops, and campus leadership initiatives.
                    </p>
                </motion.div>

                {/* ── Event Photo & Activities Showcase Grid ── */}
                <div className={styles.activitiesGrid}>
                    {events.map((photo, i) => {
                        const IconComponent = getIconComponent(photo.icon);
                        // Use the stored src (which is /api/files/<id> from DB upload)
                        // Only fall back to placeholder on actual load error
                        const imgSrc = photo.src || null;

                        return (
                            <motion.div
                                key={i}
                                className={styles.activityCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <div className={styles.imageWrapper}>
                                    {imgSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <ImgWithFallback
                                            src={imgSrc}
                                            alt={photo.alt || photo.title}
                                            className={styles.cardImg}
                                        />
                                    ) : (
                                        <div className={`${styles.cardImg} ${styles.imgFallback}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'rgba(57,211,83,0.06)',
                                                color: 'rgba(57,211,83,0.4)'
                                            }}>
                                            <FaImage size={36} />
                                        </div>
                                    )}
                                    <div className={styles.cardBadge}>
                                        <IconComponent size={11} />
                                        <span>{photo.category}</span>
                                    </div>
                                    <div className={styles.cardOverlay}>
                                        <span className={styles.overlayText}>
                                            <FaExpandAlt size={11} /> Expand Preview
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{photo.title}</h3>
                                    <p className={styles.cardDesc}>{photo.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ── Photo Lightbox Modal ── */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        className={styles.modalBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            className={styles.modalCard}
                            initial={{ scale: 0.93, y: 18 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.93, y: 18 }}
                            transition={{ duration: 0.22 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className={styles.modalClose}
                                onClick={() => setSelectedPhoto(null)}
                                aria-label="Close"
                            >
                                <FaTimes size={14} />
                            </button>

                            {selectedPhoto.src ? (
                                <ImgWithFallback
                                    src={selectedPhoto.src}
                                    alt={selectedPhoto.alt || selectedPhoto.title}
                                    className={styles.modalImage}
                                />
                            ) : (
                                <div className={styles.modalImage}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(57,211,83,0.06)',
                                        color: 'rgba(57,211,83,0.4)',
                                        minHeight: '220px'
                                    }}>
                                    <FaImage size={48} />
                                </div>
                            )}

                            <div className={styles.modalBody}>
                                <span className={styles.modalBadge}>{selectedPhoto.category}</span>
                                <h3 className={styles.modalTitle}>{selectedPhoto.title}</h3>
                                <p className={styles.modalDescText}>{selectedPhoto.desc}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ── Reliable image component with error boundary ──
function ImgWithFallback({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [errored, setErrored] = useState(false);

    if (errored) {
        return (
            <div
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(57,211,83,0.06)',
                    color: 'rgba(57,211,83,0.4)',
                    minHeight: '180px',
                }}
            >
                <FaImage size={36} />
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setErrored(true)}
        />
    );
}
