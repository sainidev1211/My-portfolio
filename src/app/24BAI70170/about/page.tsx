"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AboutEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                const aboutData = res.about || {};
                setData({
                    title: aboutData.title || "About Me",
                    eyebrow: aboutData.eyebrow || "< about />",
                    text1: aboutData.text1 || "",
                    text2: aboutData.text2 || "",
                    image: aboutData.image || "/images/dev-profile.jpg",
                    secondaryImage: aboutData.secondaryImage || "/images/dev-hero.jpg",
                    skills: aboutData.skills || [],
                    currently: aboutData.currently || [],
                    education: aboutData.education || {
                        degree: "B.E. Computer Science & Engineering (AI & ML)",
                        institution: "Chandigarh University",
                        duration: "2024 — 2028",
                        location: "Mohali, Punjab, India"
                    }
                });
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.about = data;

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });

        setSaving(false);
        setMessage("About section updated successfully!");
        setTimeout(() => setMessage(""), 3000);
    };

    const handleValidation = (tags: string) => {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Edit About &amp; Pictures</h1>

            {/* Images Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.form}>
                    <h3>Primary Profile Image</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Used in About card, AI Assistant, and Let's Connect profile box.
                    </p>
                    <ImageUpload
                        value={data.image}
                        onChange={(url) => setData({ ...data, image: url })}
                    />
                </div>

                <div className={styles.form}>
                    <h3>Secondary Showcase Image</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Used in About photo switcher carousel.
                    </p>
                    <ImageUpload
                        value={data.secondaryImage}
                        onChange={(url) => setData({ ...data, secondaryImage: url })}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label className={styles.label}>Section Title</label>
                    <input
                        className={styles.input}
                        value={data.title}
                        onChange={e => setData({ ...data, title: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Paragraph 1</label>
                    <textarea
                        className={styles.textarea}
                        value={data.text1}
                        onChange={e => setData({ ...data, text1: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Paragraph 2</label>
                    <textarea
                        className={styles.textarea}
                        value={data.text2}
                        onChange={e => setData({ ...data, text2: e.target.value })}
                    />
                </div>

                {/* Education Box */}
                <h3 style={{ marginTop: '1rem', color: 'var(--accent)' }}>Education Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.group}>
                        <label className={styles.label}>Degree</label>
                        <input
                            className={styles.input}
                            value={data.education?.degree || ''}
                            onChange={e => setData({
                                ...data,
                                education: { ...data.education, degree: e.target.value }
                            })}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>University / Institution</label>
                        <input
                            className={styles.input}
                            value={data.education?.institution || ''}
                            onChange={e => setData({
                                ...data,
                                education: { ...data.education, institution: e.target.value }
                            })}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Duration</label>
                        <input
                            className={styles.input}
                            value={data.education?.duration || ''}
                            onChange={e => setData({
                                ...data,
                                education: { ...data.education, duration: e.target.value }
                            })}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Location</label>
                        <input
                            className={styles.input}
                            value={data.education?.location || ''}
                            onChange={e => setData({
                                ...data,
                                education: { ...data.education, location: e.target.value }
                            })}
                        />
                    </div>
                </div>

                <div className={styles.group} style={{ marginTop: '1rem' }}>
                    <label className={styles.label}>Currently Pursuing (One per line)</label>
                    <textarea
                        className={styles.textarea}
                        value={Array.isArray(data.currently) ? data.currently.join('\n') : (data.currently || '')}
                        onChange={e => setData({
                            ...data,
                            currently: e.target.value.split('\n').filter(Boolean)
                        })}
                        placeholder="🎓 Pursuing B.E. CSE (AIML) at Chandigarh University&#10;⚡ Building next-generation AI web apps"
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Skills (Comma separated)</label>
                    <textarea
                        className={styles.textarea}
                        value={Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '')}
                        onChange={e => setData({ ...data, skills: handleValidation(e.target.value) })}
                    />
                </div>

                <button type="submit" disabled={saving} className={styles.button}>
                    {saving ? 'Saving Changes...' : 'Save All Changes'}
                </button>
            </form>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
}
