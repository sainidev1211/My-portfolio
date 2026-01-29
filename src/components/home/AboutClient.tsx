"use client";

import React from 'react';
import styles from './About.module.css';
import { ScrollReveal } from '../ui/ScrollReveal';

interface AboutProps {
    data: any;
}

const AboutClient: React.FC<AboutProps> = ({ data }) => {
    const { title, text1, text2, skills, image } = data;

    return (
        <section id="about" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <ScrollReveal>
                        <h2 className={styles.title}>{title}</h2>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <p className={styles.text}>{text1}</p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <p className={styles.text}>{text2}</p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.3}>
                        <div className={styles.techStack}>
                            {skills.map((skill: string) => (
                                <span key={skill} className={styles.techItem}>{skill}</span>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>

                <div className={styles.imageContainer}>
                    <ScrollReveal delay={0.2}>
                        {image ? (
                            <img src={image} alt="Profile" className={styles.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className={styles.placeholderImage} />
                        )}
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default AboutClient;
