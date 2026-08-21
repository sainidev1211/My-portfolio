"use client";

import React, { useState, useEffect } from "react";
import styles from "./AcademicJourney.module.css";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

interface AcademicJourneyProps {
    initialPhotos?: any[];
}

export default function AcademicJourneyClient({ initialPhotos = [] }: AcademicJourneyProps) {
    const [photos, setPhotos] = useState<any[]>(initialPhotos);


    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                if (res.academicJourney) {
                    setPhotos(res.academicJourney);
                }
            })
            .catch(err => console.error("Failed to load academic journey:", err));
    }, []);

    if (photos.length === 0) return null;

    // Duplicate array for infinite marquee effect
    const duplicatedPhotos = [...photos, ...photos];

    return (
        <section id="academic-journey" className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.eyebrow}>
                        <FaGraduationCap size={12} />
                        <span>Milestones &amp; Memories</span>
                    </div>
                    <h2 className={styles.title}>
                        My Academic <span className={styles.titleGradient}>Journey</span>
                    </h2>
                </motion.div>

                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {duplicatedPhotos.map((photo, i) => (
                            <div key={i} className={styles.photoCard}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={photo.src || `/uploads/event${(i % 4) + 1}.jpg`} 
                                    alt={photo.alt || 'Academic Journey Photo'} 
                                    className={styles.photoImage} 
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        if (!target.src.includes('/uploads/event')) {
                                            target.src = `/uploads/event${(i % 4) + 1}.jpg`;
                                        } else {
                                            target.style.display = "none";
                                        }
                                    }}
                                />
                                {photo.alt && (
                                    <div className={styles.photoAlt}>{photo.alt}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
