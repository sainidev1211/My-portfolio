"use client";

import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaGlobe } from 'react-icons/fa';

const iconMap: Record<string, any> = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    instagram: FaInstagram,
    facebook: FaFacebook,
    youtube: FaYoutube,
    website: FaGlobe
};

const Footer = () => {
    const [socials, setSocials] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => setSocials(res.socials || []));
    }, []);

    const getIcon = (platform: string) => {
        const key = platform.toLowerCase();
        if (key.includes('git')) return FaGithub;
        if (key.includes('linked')) return FaLinkedin;
        if (key.includes('twitter') || key.includes('x')) return FaTwitter;
        if (key.includes('insta')) return FaInstagram;
        if (key.includes('face')) return FaFacebook;
        if (key.includes('tube')) return FaYoutube;
        return FaGlobe;
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3>Let's Connect</h3>
                    <p>Follow me on social media for updates and tech content.</p>
                </div>

                <div className={styles.socials} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    {socials.map((s: any) => {
                        const Icon = getIcon(s.platform);
                        return (
                            <a
                                key={s.id}
                                href={s.url}
                                target="_blank"
                                aria-label={s.platform}
                                className={styles.iconLink}
                                style={{
                                    transition: 'transform 0.2s',
                                    display: 'inline-block'
                                }}
                            >
                                <Icon size={32} />
                            </a>
                        );
                    })}
                </div>
            </div>
            <div className={styles.copy}>
                &copy; {new Date().getFullYear()} Dev Saini. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
