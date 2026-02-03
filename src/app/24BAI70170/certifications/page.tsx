"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import adminStyles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';

export default function CertificationsManager() {
    const [certs, setCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit mode state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({
        title: '', issuer: '', date: '', link: '', image: '', category: 'General'
    });

    // Filter state
    const [filterCategory, setFilterCategory] = useState<string>('All');

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
        setEditForm({ title: '', issuer: '', date: '', link: '', image: '', category: 'General' });
    };

    const handleEdit = (cert: any) => {
        setEditingId(cert.id);
        setEditForm({ ...cert, category: cert.category || 'General' }); // Handle legacy data
        // Scroll to form
        const formElement = document.getElementById('cert-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
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

    const PREDEFINED_CATEGORIES = ['Data Analysis', 'Machine Learning', 'Productivity Tools'];

    // Derive available categories for filter
    const availableCategories = Array.from(new Set(certs.map(c => c.category || 'General')));

    // Filter logic
    const filteredCerts = filterCategory === 'All'
        ? certs
        : certs.filter(c => (c.category || 'General') === filterCategory);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Certificates</h1>

            {/* Filter */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={styles.label} style={{ marginBottom: 0 }}>Filter by Category:</span>
                <select
                    className={styles.input}
                    style={{ width: 'auto', padding: '0.5rem' }}
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories ({certs.length})</option>
                    {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {filteredCerts.length === 0 && <p style={{ opacity: 0.5 }}>No certificates found.</p>}
                {filteredCerts.map(c => {
                    const category = c.category || 'General';
                    const isGeneral = category === 'General';

                    return (
                        <div key={c.id} className={adminStyles.cardItem} style={{ borderLeft: isGeneral ? '4px solid #666' : '4px solid #0070f3' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden', flex: 1 }}>
                                {c.image && <img src={c.image} alt={c.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                                <div className={adminStyles.cardContent} style={{ flex: 1 }}>
                                    <h3>{c.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{c.issuer}</span>
                                        <span style={{ opacity: 0.4 }}>•</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: isGeneral ? '#333' : '#0070f3',
                                            color: 'white',
                                            fontWeight: 500
                                        }}>
                                            {category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={adminStyles.cardActions}>
                                {isGeneral && (
                                    <button
                                        onClick={() => handleEdit(c)}
                                        className={adminStyles.actionButton}
                                        style={{ background: '#f5a623', color: 'black', marginRight: '0.5rem' }}
                                    >
                                        Categorize
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(c)}
                                    className={`${adminStyles.actionButton} ${adminStyles.btnEdit}`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className={`${adminStyles.actionButton} ${adminStyles.btnDelete}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form */}
            <div id="cert-form" className={styles.form}>
                <h2>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.group}>
                        <label className={styles.label}>Certificate Title</label>
                        <input className={styles.input} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                    </div>

                    {/* Category Selection */}
                    <div className={styles.group}>
                        <label className={styles.label}>
                            Skill Category
                            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginTop: '4px', fontWeight: 'normal' }}>
                                Used to group certificates by skills on the frontend.
                            </span>
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                className={styles.input}
                                value={PREDEFINED_CATEGORIES.includes(editForm.category) ? editForm.category : 'Custom'}
                                onChange={(e) => {
                                    if (e.target.value === 'Custom') {
                                        // When switching to custom, keep current if it's already custom, else set to General
                                        const isAlreadyCustom = !PREDEFINED_CATEGORIES.includes(editForm.category);
                                        setEditForm({ ...editForm, category: isAlreadyCustom ? editForm.category : 'General' });
                                    } else {
                                        setEditForm({ ...editForm, category: e.target.value });
                                    }
                                }}
                            >
                                {PREDEFINED_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="Custom">Custom</option>
                            </select>

                            {/* Custom Category Input */}
                            {(!PREDEFINED_CATEGORIES.includes(editForm.category)) && (
                                <input
                                    className={styles.input}
                                    placeholder="Type category..."
                                    value={editForm.category}
                                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                    required
                                />
                            )}
                        </div>
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

                    <ImageUpload
                        label="Certificate Image"
                        value={editForm.image}
                        onChange={(url) => setEditForm({ ...editForm, image: url })}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className={styles.button} disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
                        {editingId && <button type="button" onClick={resetForm} style={{ padding: '1rem', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}
