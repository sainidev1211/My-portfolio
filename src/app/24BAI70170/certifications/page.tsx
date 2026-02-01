"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';

export default function CertificationsManager() {
    const [certs, setCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit mode state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({
        title: '', issuer: '', date: '', link: '', image: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setCerts(res.certifications || []);
                setLoading(false);
            });
    };

    const resetForm = () => {
        setEditingId(null);
        setEditForm({ title: '', issuer: '', date: '', category: 'All', link: '', image: '' });
    };

    const handleEdit = (cert: any) => {
        setEditingId(cert.id);
        setEditForm({ ...cert });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.certifications = (fullContent.certifications || []).filter((c: any) => c.id !== id);

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

        const newCert = {
            ...editForm,
            id: editingId || Date.now(),
        };

        if (!fullContent.certifications) fullContent.certifications = [];

        if (editingId) {
            // Update
            fullContent.certifications = fullContent.certifications.map((c: any) => c.id === editingId ? newCert : c);
        } else {
            // Create
            fullContent.certifications.push(newCert);
        }

        await fetch('/api/content', {
            method: 'POST',
            body: JSON.stringify(fullContent)
        });

        setSaving(false);
        resetForm();
        fetchData();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Certificates</h1>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {certs.length === 0 && <p style={{ opacity: 0.5 }}>No certificates found.</p>}
                {certs.map(c => (
                    <div key={c.id} style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {c.image && <img src={c.image} alt={c.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                            <div>
                                <h3 style={{ fontWeight: 'bold' }}>{c.title}</h3>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{c.issuer} • {c.date} • {c.category}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handleEdit(c)}
                                style={{ padding: '0.5rem 1rem', background: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(c.id)}
                                style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className={styles.form}>
                <h2>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.group}>
                        <label className={styles.label}>Certificate Title</label>
                        <input className={styles.input} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.group}>
                            <label className={styles.label}>Issuer (e.g., Coursera, Google)</label>
                            <input className={styles.input} value={editForm.issuer} onChange={e => setEditForm({ ...editForm, issuer: e.target.value })} required />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Year / Date</label>
                            <input className={styles.input} value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} required placeholder="2025" />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Certificate Link (Verify URL)</label>
                        <input className={styles.input} value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Image URL (Use File Uploads page to get path)</label>
                        <input className={styles.input} value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className={styles.button} disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
                        {editingId && <button type="button" onClick={resetForm} style={{ padding: '1rem', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}
