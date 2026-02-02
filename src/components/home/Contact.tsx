"use client";

import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css';
import { ScrollReveal } from '../ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import SocialLinks from '../ui/SocialLinks';
import { FaCheckCircle } from 'react-icons/fa';

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
                setResponseMsg(data.message || 'Message Sent!');
                setFormData({ name: '', email: '', phone: '', message: '' });
                // Reset after 5 seconds to allow sending another message
                setTimeout(() => setStatus(''), 5000);
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
        <section id="contact" className={styles.section} style={{ display: 'flex', flexDirection: 'column', minHeight: 'auto', position: 'relative', paddingBottom: 0 }}>
            {/* Decorative Elements */}
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary-glow)', filter: 'blur(150px)', borderRadius: '50%', zIndex: 0 }} />

            {/* Left Side Socials Column */}
            <div className={styles.socialsSidebar} style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                zIndex: 10,
                alignItems: 'center'
            }}>
                <div style={{ height: '50px', width: '1px', background: 'rgba(255,255,255,0.3)' }} />
                <SocialLinks socials={socials} direction="column" iconSize={24} />
                <div style={{ height: '50px', width: '1px', background: 'rgba(255,255,255,0.3)' }} />
            </div>

            <div className={styles.container} style={{ width: '100%', maxWidth: '700px', margin: '0 auto', zIndex: 2 }}>
                <ScrollReveal>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 className={styles.title}>Let's Connect</h2>
                        <p className={styles.subtitle} style={{ fontSize: '1.2rem' }}>
                            & build something meaningful.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2} width="100%">
                    <AnimatePresence mode='wait'>
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={styles.form}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '400px',
                                    textAlign: 'center',
                                    gap: '1.5rem'
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                                    style={{ color: '#4ade80', fontSize: '4rem' }}
                                >
                                    <FaCheckCircle />
                                </motion.div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Message Received!</h3>
                                <p style={{ opacity: 0.8, maxWidth: '80%' }}>
                                    Thanks for reaching out. I'll get back to you as soon as possible.
                                </p>
                                <button
                                    onClick={() => setStatus('')}
                                    className={styles.button}
                                    style={{ marginTop: '1rem', width: 'auto', padding: '0.8rem 2rem' }}
                                >
                                    Send Another
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className={styles.form}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.group}>
                                        <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', opacity: 0.8 }}>
                                            Name <span style={{ color: 'var(--primary)' }}>*</span>
                                        </label>
                                        <input required type="text" className={styles.input} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                                    </div>
                                    <div className={styles.group}>
                                        <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', opacity: 0.8 }}>
                                            Email <span style={{ color: 'var(--primary)' }}>*</span>
                                        </label>
                                        <input required type="email" className={styles.input} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
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
                                    {status === 'submitting' ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                            <span className={styles.spinner} /> Sending...
                                        </span>
                                    ) : 'Send Message'}
                                </button>
                                {status === 'error' && <div className={styles.error} style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>{responseMsg}</div>}
                            </motion.form>
                        )}
                    </AnimatePresence>
                </ScrollReveal>
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem 0',
                width: '100%',
                textAlign: 'center',
                opacity: 0.6,
                fontSize: '0.85rem',
                borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
                &copy; {new Date().getFullYear()} Dev Saini. All rights reserved.
            </div>
        </section>
    );
};

export default Contact;
