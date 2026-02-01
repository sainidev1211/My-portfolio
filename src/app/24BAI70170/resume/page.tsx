"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import ImageUpload from '@/components/admin/ImageUpload';

export default function ResumeManager() {
    const [data, setData] = useState<any>({ summary: '', fileUrl: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setData(res.resume || { summary: '', fileUrl: '' });
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.resume = data;

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });

        setSaving(false);
        setMessage("Resume section updated successfully!");
        setTimeout(() => setMessage(""), 3000);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Resume</h1>

            <div className={styles.form} style={{ marginBottom: '2rem' }}>
                <ImageUpload
                    label="Resume PDF"
                    value={data.fileUrl}
                    onChange={(url) => setData({ ...data, fileUrl: url })}
                />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label className={styles.label}>Summary Text</label>
                    <textarea
                        className={styles.textarea}
                        value={data.summary}
                        onChange={e => setData({ ...data, summary: e.target.value })}
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
