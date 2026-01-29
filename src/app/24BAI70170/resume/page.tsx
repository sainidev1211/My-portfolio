"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';

export default function ResumeManager() {
    const [data, setData] = useState<any>({ summary: '', fileUrl: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setData(res.resume || { summary: '', fileUrl: '' });
                setLoading(false);
            });
    }, []);

    const handleFileUpload = async () => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const uploadData = await res.json();

            if (uploadData.success) {
                setData((prev: any) => ({ ...prev, fileUrl: uploadData.url }));
                setFile(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

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
                <h3>Resume PDF</h3>
                <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Current File: {data.fileUrl ? <a href={data.fileUrl} target="_blank" className="text-blue-400">View PDF</a> : 'None'}</p>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={!file || uploading}
                        className={styles.button}
                    >
                        {uploading ? 'Uploading...' : 'Upload New'}
                    </button>
                </div>
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
