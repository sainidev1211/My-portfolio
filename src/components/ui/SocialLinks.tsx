"use client";
import React from 'react';
import { motion } from 'framer-motion';
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

interface SocialLinksProps {
    socials: any[];
    direction?: 'row' | 'column';
    iconSize?: number;
    showLabel?: boolean;
}

export default function SocialLinks({ socials, direction = 'row', iconSize = 24 }: SocialLinksProps) {
    if (!socials || socials.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: direction, gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
            {socials.map((s) => {
                const Icon = getIcon(s.platform);
                return (
                    <motion.a
                        key={s.id || s._id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform}
                        whileHover={{ scale: 1.2, y: -4, color: '#ffffff' }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: `${iconSize}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Icon />
                    </motion.a>
                );
            })}
        </div>
    );
}
