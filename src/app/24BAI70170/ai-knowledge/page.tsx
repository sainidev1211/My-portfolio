"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';

export default function AiKnowledgeManager() {
    const [knowledge, setKnowledge] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // For text notes
    const [fileUrl, setFileUrl] = useState(''); // For file uploads
    const [type, setType] = useState<'text' | 'file'>('text');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setKnowledge(res.knowledgeFiles || []);
                setLoading(false);
            });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.knowledgeFiles = (fullContent.knowledgeFiles || []).filter((k: any) => k.id !== id);

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });
        fetchData();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const fullContent = await fetch('/api/content').then(res => res.json());

        const newItem = {
            id: Date.now(),
            title,
            type,
            content: type === 'text' ? content : null,
            url: type === 'file' ? fileUrl : null,
            timestamp: new Date().toISOString()
        };

        if (!fullContent.knowledgeFiles) fullContent.knowledgeFiles = [];
        fullContent.knowledgeFiles.push(newItem);

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });

        setSaving(false);
        setTitle('');
        setContent('');
        setFileUrl('');
        fetchData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '1rem' }}>AI Knowledge Manager</h1>
            <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Upload resumes, notes, or documents. The AI will prioritize this information when answering.</p>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {knowledge.length === 0 && <p style={{ opacity: 0.5 }}>No knowledge files found.</p>}
                {knowledge.map(k => (
                    <div key={k.id} style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ fontWeight: 'bold' }}>{k.title} <span style={{ fontSize: '0.7rem', background: '#333', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>{k.type.toUpperCase()}</span></h3>
                            {k.type === 'text' && <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '0.5rem' }}>{k.content.substring(0, 100)}...</p>}
                            {k.type === 'file' && <a href={k.url} target="_blank" style={{ color: '#3b82f6', fontSize: '0.9rem', display: 'block', marginTop: '0.5rem' }}>View File</a>}
                        </div>
                        <button
                            onClick={() => handleDelete(k.id)}
                            style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className={styles.form}>
                <h2>Add Knowledge</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => setType('text')}
                        style={{ padding: '0.5rem 1rem', background: type === 'text' ? '#3b82f6' : '#222', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                    >
                        Text Note
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('file')}
                        style={{ padding: '0.5rem 1rem', background: type === 'file' ? '#3b82f6' : '#222', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                    >
                        File Upload
                    </button>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.group}>
                        <label className={styles.label}>Title (e.g., "Resume Text", "Project X Details")</label>
                        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>

                    {type === 'text' ? (
                        <div className={styles.group}>
                            <label className={styles.label}>Content / Notes</label>
                            <textarea
                                className={styles.textarea}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                                rows={10}
                                placeholder="Paste resume text or specific details here..."
                            />
                        </div>
                    ) : (
                        <div className={styles.group}>
                            <label className={styles.label}>File URL (Use File Uploads page to get path)</label>
                            <input className={styles.input} value={fileUrl} onChange={e => setFileUrl(e.target.value)} required placeholder="/uploads/filename.pdf" />
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                                Tip: Upload the file first in the "File Uploads" tab, then copy the path here.
                                The AI reads the filename and metadata, but works best with Text Notes for raw content.
                            </p>
                        </div>
                    )}

                    <button type="submit" className={styles.button} disabled={saving}>{saving ? 'Saving...' : 'Add Knowledge'}</button>
                </form>
            </div>
        </div>
    );
}
