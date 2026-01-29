"use client";

import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css';
import { ScrollReveal } from '../ui/ScrollReveal';
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

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'' | 'submitting' | 'success' | 'error'>('');
    const [responseMsg, setResponseMsg] = useState('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setResponseMsg(data.message);
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
                setResponseMsg(data.error || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setResponseMsg('Failed to send message');
        }
    };

    return (
        <section id="contact" className={styles.section} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', position: 'relative' }}>
            {/* Decorative Elements */}
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary-glow)', filter: 'blur(150px)', borderRadius: '50%', zIndex: 0 }} />

            {/* Left Side Socials Column */}
            <div style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                zIndex: 10
            }}>
                <div style={{ height: '50px', width: '1px', background: 'rgba(255,255,255,0.3)', margin: '0 auto' }} />
                {socials.map((s: any) => {
                    const Icon = getIcon(s.platform);
                    return (
                        <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            aria-label={s.platform}
                            style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '1.5rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.transform = 'scale(1.2) translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                e.currentTarget.style.transform = 'scale(1) translateX(0)';
                            }}
                        >
                            <Icon />
                        </a>
                    );
                })}
                <div style={{ height: '50px', width: '1px', background: 'rgba(255,255,255,0.3)', margin: '0 auto' }} />
            </div>

            <div className={styles.container} style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
                <ScrollReveal>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 className={styles.title}>Let's Connect</h2>
                        <p className={styles.subtitle} style={{ fontSize: '1.2rem' }}>
                            & build something meaningful.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2} width="100%">
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Form Content */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.group}>
                                <input required type="text" className={styles.input} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
                            </div>
                            <div className={styles.group}>
                                <input required type="email" className={styles.input} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
                            </div>
                            <div className={styles.group} style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', opacity: 0.8 }}>
                                    Phone Number <span style={{ color: 'var(--primary)' }}>*</span>
                                </label>
                                <input required type="tel" className={styles.input} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" />
                            </div>
                        </div>

                        <div className={styles.group} style={{ marginTop: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', opacity: 0.8 }}>
                                Message <span style={{ color: 'var(--primary)' }}>*</span>
                            </label>
                            <textarea required className={styles.textarea} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Your Message..." style={{ minHeight: '120px' }} />
                        </div>

                        <button type="submit" className={styles.button} disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && <div className={styles.success}>{responseMsg}</div>}
                    </form>
                </ScrollReveal>
            </div>

            <div style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                &copy; {new Date().getFullYear()} Dev Saini. All rights reserved.
            </div>
        </section>
    );
};

export default Contact;
