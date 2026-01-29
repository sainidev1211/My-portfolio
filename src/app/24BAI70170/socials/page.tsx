"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';

export default function SocialsManager() {
    const [socials, setSocials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newLink, setNewLink] = useState({ platform: '', url: '', icon: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setSocials(res.socials || []);
                setLoading(false);
            });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.socials = fullContent.socials.filter((s: any) => s.id !== id);

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });
        fetchData();
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const fullContent = await fetch('/api/content').then(res => res.json());
        if (!fullContent.socials) fullContent.socials = [];

        fullContent.socials.push({
            ...newLink,
            id: Date.now()
        });

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });

        setSaving(false);
        setNewLink({ platform: '', url: '', icon: '' });
        fetchData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Social Links</h1>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {socials.map(s => (
                    <div key={s.id} style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <strong>{s.platform}</strong>: <a href={s.url} target="_blank" className="text-blue-400">{s.url}</a>
                        </div>
                        <button
                            onClick={() => handleDelete(s.id)}
                            style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.form}>
                <h2>Add New Link</h2>
                <form onSubmit={handleAdd} className={styles.group}>
                    <input
                        placeholder="Platform (e.g. GitHub)"
                        className={styles.input}
                        value={newLink.platform}
                        onChange={e => setNewLink({ ...newLink, platform: e.target.value })}
                        required
                    />
                    <input
                        placeholder="URL"
                        className={styles.input}
                        value={newLink.url}
                        onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Icon Code (github, linkedin, twitter)"
                        className={styles.input}
                        value={newLink.icon}
                        onChange={e => setNewLink({ ...newLink, icon: e.target.value })}
                    />
                    <button type="submit" disabled={saving} className={styles.button}>
                        {saving ? 'Adding...' : 'Add Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}
