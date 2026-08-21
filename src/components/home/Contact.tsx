"use client";

import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEnvelope, 
    FaPhoneAlt, 
    FaMapMarkerAlt, 
    FaGraduationCap, 
    FaCheckCircle, 
    FaCopy, 
    FaCheck, 
    FaGithub, 
    FaLinkedin, 
    FaTwitter, 
    FaInstagram,
    FaPaperPlane
} from 'react-icons/fa';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'' | 'submitting' | 'success' | 'error'>('');
    const [responseMsg, setResponseMsg] = useState('');
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [socials, setSocials] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => setSocials(res.socials || []))
            .catch(err => console.error("Failed to load socials:", err));
    }, []);

    // IntersectionObserver scroll triggers
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

        const anims = document.querySelectorAll('#contact .animate-on-scroll');
        anims.forEach(el => observer.observe(el));

        return () => {
            anims.forEach(el => observer.unobserve(el));
        };
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('devs08107@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
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
                setResponseMsg(data.message || 'Message Received!');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus(''), 7000);
            } else {
                setStatus('error');
                setResponseMsg(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setResponseMsg('Failed to send message. Please email directly at devs08107@gmail.com.');
        }
    };

    const getSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('github')) return <FaGithub />;
        if (p.includes('linkedin')) return <FaLinkedin />;
        if (p.includes('twitter') || p.includes('x')) return <FaTwitter />;
        if (p.includes('instagram')) return <FaInstagram />;
        return <FaEnvelope />;
    };

    return (
        <section id="contact" className={styles.section}>
            {/* Glow Background Layer */}
            <div className={styles.bgGlow} />

            <div className={styles.container}>
                <div className={`${styles.header} animate-on-scroll`}>
                    <span className={styles.eyebrow}>&lt; connect /&gt;</span>
                    <h2 className={styles.title}>Let's Connect</h2>
                    <p className={styles.subtitle}>
                        Have an engineering role, machine learning challenge, or software project in mind? Reach out directly or drop a message below.
                    </p>
                </div>

                <div className={styles.gridContainer}>
                    {/* Left Column: Dev Saini Info Box */}
                    <div className={`${styles.infoCard} animate-on-scroll`} style={{ transitionDelay: '100ms' }}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatarWrapper}>
                                <img 
                                    src="/images/dev-profile.jpg" 
                                    alt="Dev Saini" 
                                    className={styles.avatarImg}
                                />
                                <span className={styles.onlineBadge} />
                            </div>
                            <div>
                                <h3 className={styles.devName}>Dev Saini</h3>
                                <div className={styles.devRole}>AI &amp; ML Engineer • Software Engineer</div>
                                <div className={styles.devLocation}>
                                    <FaMapMarkerAlt size={12} color="var(--accent)" /> Chandigarh / Mohali, India
                                </div>
                            </div>
                        </div>

                        <div className={styles.statusBox}>
                            <span className={styles.pulseDot} />
                            <span>Available for Software Engineering &amp; AI Roles</span>
                        </div>

                        {/* Details List with 1-Click Copy */}
                        <div className={styles.detailsList}>
                            <div className={styles.detailItem}>
                                <div className={styles.detailIconWrapper}>
                                    <FaEnvelope size={14} />
                                </div>
                                <div className={styles.detailTextWrapper}>
                                    <span className={styles.detailLabel}>Direct Email</span>
                                    <span className={styles.detailValue}>devs08107@gmail.com</span>
                                </div>
                                <button 
                                    onClick={handleCopyEmail}
                                    className={styles.copyBtn}
                                    title="Copy Email Address"
                                >
                                    {copiedEmail ? <FaCheck size={12} color="var(--accent)" /> : <FaCopy size={12} />}
                                    <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>

                            <div className={styles.detailItem}>
                                <div className={styles.detailIconWrapper}>
                                    <FaGraduationCap size={14} />
                                </div>
                                <div className={styles.detailTextWrapper}>
                                    <span className={styles.detailLabel}>Education</span>
                                    <span className={styles.detailValue}>Chandigarh University (Artificial Intelligence and Machine Learning)</span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <div className={styles.detailIconWrapper}>
                                    <FaPhoneAlt size={14} />
                                </div>
                                <div className={styles.detailTextWrapper}>
                                    <span className={styles.detailLabel}>Phone / WhatsApp</span>
                                    <span className={styles.detailValue}>+91 87644 51718</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className={styles.socialsContainer}>
                            <span className={styles.socialsTitle}>Social &amp; Developer Profiles</span>
                            <div className={styles.socialButtonsRow}>
                                {socials.map((s, idx) => (
                                    <a
                                        key={s.id || idx}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialBtn}
                                        title={s.platform}
                                    >
                                        {getSocialIcon(s.platform)}
                                        <span>{s.platform}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className={`${styles.formWrapper} animate-on-scroll`} style={{ transitionDelay: '150ms' }}>
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={styles.successCard}
                                >
                                    <div className={styles.successIcon}>
                                        <FaCheckCircle />
                                    </div>
                                    <h3 className={styles.successTitle}>Message Sent Successfully!</h3>
                                    <p className={styles.successDesc}>
                                        Thanks for reaching out, Dev will receive your message and get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => setStatus('')}
                                        className={styles.anotherBtn}
                                    >
                                        Send Another Message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formHeader}>
                                        <h3 className={styles.formTitle}>Send a Message</h3>
                                        <span className={styles.formSub}>Fill out the details below</span>
                                    </div>

                                    <div className={styles.rowTwo}>
                                        <div className={styles.group}>
                                            <label className={styles.label}>
                                                Your Name <span className={styles.required}>*</span>
                                            </label>
                                            <input 
                                                required 
                                                type="text" 
                                                className={styles.input} 
                                                value={formData.name} 
                                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                                placeholder="e.g. Dev Saini" 
                                            />
                                        </div>

                                        <div className={styles.group}>
                                            <label className={styles.label}>
                                                Your Email <span className={styles.required}>*</span>
                                            </label>
                                            <input 
                                                required 
                                                type="email" 
                                                className={styles.input} 
                                                value={formData.email} 
                                                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                                placeholder="e.g. devs08107@gmail.com" 
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.group}>
                                        <label className={styles.label}>
                                            Phone / Contact Number <span className={styles.optional}>(Optional)</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            className={styles.input} 
                                            value={formData.phone} 
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                                            placeholder="e.g. +91 87644 51718" 
                                        />
                                    </div>

                                    <div className={styles.group}>
                                        <label className={styles.label}>
                                            Your Message <span className={styles.required}>*</span>
                                        </label>
                                        <textarea 
                                            required 
                                            className={styles.textarea} 
                                            value={formData.message} 
                                            onChange={e => setFormData({ ...formData, message: e.target.value })} 
                                            placeholder="Hi Dev, I saw your portfolio and would love to collaborate on a software engineering / AI project..." 
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className={styles.submitButton} 
                                        disabled={status === 'submitting'}
                                    >
                                        {status === 'submitting' ? (
                                             <span className={styles.loadingSpinner}>
                                                 <span className={styles.spinner} /> Sending Message...
                                             </span>
                                        ) : (
                                            <span className={styles.btnContent}>
                                                <FaPaperPlane /> Send Message
                                            </span>
                                        )}
                                    </button>

                                    {status === 'error' && (
                                        <div className={styles.errorMessage}>{responseMsg}</div>
                                    )}
                                </form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
