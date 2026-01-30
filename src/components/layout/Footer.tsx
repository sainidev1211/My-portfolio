"use client";

import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import SocialLinks from '../ui/SocialLinks';

const Footer = () => {
    const [socials, setSocials] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => setSocials(res.socials || []));
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3>Let's Connect</h3>
                    <p>Follow me on social media for updates and tech content.</p>
                </div>

                <div className={styles.socials}>
                    <SocialLinks socials={socials} iconSize={28} />
                </div>
            </div>
            <div className={styles.copy}>
                &copy; {new Date().getFullYear()} Dev Saini. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
