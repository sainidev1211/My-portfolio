"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';

export default function AboutEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setData(res.about);
                setLoading(false);
            });
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadData = await res.json();

            if (uploadData.success) {
                setData((prev: any) => ({ ...prev, image: uploadData.url }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

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
        // split by comma and trim
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Edit About Section</h1>

            <div className={styles.form} style={{ marginBottom: '2rem' }}>
                <h3>Profile Image</h3>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                        {data.image && <img src={data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <input type="file" onChange={handleImageUpload} disabled={uploading} />
                </div>
            </div>

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

                <div className={styles.group}>
                    <label className={styles.label}>Skills (Comma separated)</label>
                    <textarea
                        className={styles.textarea}
                        value={data.skills.join(', ')}
                        onChange={e => setData({ ...data, skills: handleValidation(e.target.value) })}
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
