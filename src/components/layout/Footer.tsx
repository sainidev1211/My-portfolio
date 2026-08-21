"use client";

import React from 'react';
import styles from './Footer.module.css';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Left Side */}
                <div className={styles.left}>
                    &copy; {new Date().getFullYear()} <span style={{ color: 'var(--text)', fontWeight: 600 }}>Dev Saini</span>. All rights reserved.
                </div>

                {/* Center Side */}
                <div className={styles.center}>
                    AI &amp; ML Engineer • Software Engineer • Python Dev • Full Stack Dev
                </div>

                {/* Right Side */}
                <div className={styles.right}>
                    <a
                        href="https://github.com/sainidev1211"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className={styles.socialLink}
                    >
                        <FaGithub size={18} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/dev-sainii/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className={styles.socialLink}
                    >
                        <FaLinkedin size={18} />
                    </a>
                    <a
                        href="https://x.com/saini_dev1"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter / X"
                        className={styles.socialLink}
                    >
                        <FaTwitter size={18} />
                    </a>
                    <a
                        href="https://www.instagram.com/dev__sainii/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className={styles.socialLink}
                    >
                        <FaInstagram size={18} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
