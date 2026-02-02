"use client";

import React from 'react';
import styles from './About.module.css';
import { motion } from 'framer-motion';

interface AboutProps {
    data: any;
}

const AboutClient: React.FC<AboutProps> = ({ data }) => {
    const { title, text1, text2, skills, image } = data;

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeInOut" as const } }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.9, rotate: -2 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { duration: 1.2, ease: "easeInOut" as const }
        }
    };

    return (
        <section id="about" className={styles.section}>
            <div className={styles.container}>
                {/* Text Content */}
                <motion.div
                    className={styles.content}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2 className={`${styles.title} text-gradient`} variants={itemVariants}>
                        {title}
                    </motion.h2>

                    <motion.p className={styles.text} variants={itemVariants}>
                        {text1}
                    </motion.p>

                    <motion.p className={styles.text} variants={itemVariants}>
                        {text2}
                    </motion.p>

                    <motion.div className={styles.techStack} variants={itemVariants}>
                        {skills.map((skill: string, index: number) => (
                            <motion.span
                                key={skill}
                                className={styles.techItem}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (index * 0.05) }}
                                viewport={{ once: true }}
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Profile Image */}
                <div className={styles.imageWrapper}>
                    <motion.div
                        className={styles.imageContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={imageVariants}
                    >
                        <div className={styles.innerImage}>
                            {image ? (
                                <img
                                    src={image}
                                    alt="Profile"
                                    className={styles.profileImage}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>No Image</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutClient;
