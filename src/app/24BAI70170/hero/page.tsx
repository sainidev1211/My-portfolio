"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';

export default function HeroEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setData(res.hero);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Get full content first to not overwrite other sections
        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.hero = data;

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });

        setSaving(false);
        setMessage("Hero section updated successfully!");
        setTimeout(() => setMessage(""), 3000);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Edit Hero Section</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label className={styles.label}>Title</label>
                    <input
                        className={styles.input}
                        value={data.title}
                        onChange={e => setData({ ...data, title: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Subtitle</label>
                    <textarea
                        className={styles.textarea}
                        value={data.subtitle}
                        onChange={e => setData({ ...data, subtitle: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Primary Button Text</label>
                    <input
                        className={styles.input}
                        value={data.primaryCta}
                        onChange={e => setData({ ...data, primaryCta: e.target.value })}
                    />
                </div>

                <div className={styles.group}>
                    <label className={styles.label}>Secondary Button Text</label>
                    <input
                        className={styles.input}
                        value={data.secondaryCta}
                        onChange={e => setData({ ...data, secondaryCta: e.target.value })}
                    />
                </div>

                <button type="submit" disabled={saving} className={styles.button}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
}
