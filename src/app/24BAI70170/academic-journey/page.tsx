"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import adminStyles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AcademicJourneyManager() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({ src: '', alt: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = () => {
        fetch('/api/content', { cache: 'no-store' })
            .then(res => res.json())
            .then(res => {
                setPhotos(res.academicJourney || []);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    };

    const resetForm = () => {
        setEditingId(null);
        setEditForm({ src: '', alt: '' });
    };

    const handleEdit = (photo: any) => {
        setEditingId(photo.id);
        setEditForm({ ...photo });
        document.getElementById('photo-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this photo?')) return;
        const fullContent = await fetch('/api/content', { cache: 'no-store' }).then(r => r.json());
        fullContent.academicJourney = (fullContent.academicJourney || []).filter((p: any) => p.id !== id);
        const res = await fetch('/api/content', { method: 'POST', body: JSON.stringify(fullContent) });
        if (res.ok) fetchData();
        else alert('Failed to delete.');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.src) { alert('Please upload a photo first.'); return; }
        setSaving(true);
        try {
            const fullContent = await fetch('/api/content', { cache: 'no-store' }).then(r => r.json());
            const newPhoto = { ...editForm, id: editingId || Date.now() };
            if (!fullContent.academicJourney) fullContent.academicJourney = [];
            if (editingId) {
                fullContent.academicJourney = fullContent.academicJourney.map((p: any) => p.id === editingId ? newPhoto : p);
            } else {
                fullContent.academicJourney.push(newPhoto);
            }
            const res = await fetch('/api/content', { method: 'POST', body: JSON.stringify(fullContent) });
            if (res.ok) { alert('Saved!'); resetForm(); fetchData(); }
            else throw new Error('API error');
        } catch (err) {
            console.error(err);
            alert('Failed to save. Try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Academic Journey Photos</h1>
            <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '0.9rem' }}>
                Manage the photos shown in the "My Academic Journey" sliding gallery. Just upload photos — no description needed. All data is stored in MongoDB.
            </p>

            {/* Grid of current photos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {photos.length === 0 && <p style={{ opacity: 0.5, gridColumn: '1 / -1' }}>No photos yet. Add one below.</p>}
                {photos.map((photo, i) => (
                    <div key={photo.id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                        <img
                            src={photo.src}
                            alt={photo.alt || `Photo ${i + 1}`}
                            style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        {photo.alt && (
                            <p style={{ fontSize: '0.8rem', padding: '0.5rem', margin: 0, opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.alt}</p>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', paddingTop: 0 }}>
                            <button
                                onClick={() => handleEdit(photo)}
                                className={`${adminStyles.actionButton} ${adminStyles.btnEdit}`}
                                style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(photo.id)}
                                className={`${adminStyles.actionButton} ${adminStyles.btnDelete}`}
                                style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div id="photo-form" className={styles.form}>
                <h2>{editingId ? 'Edit Photo' : 'Add New Photo'}</h2>
                <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Upload a photo from your academic journey — classroom moments, campus events, lab sessions, team pics, etc.
                </p>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <ImageUpload
                        label="Journey Photo *"
                        value={editForm.src}
                        onChange={(url) => setEditForm({ ...editForm, src: url })}
                    />

                    <div className={styles.group}>
                        <label className={styles.label}>Caption / Alt Text <span style={{ opacity: 0.5, fontWeight: 'normal' }}>(Optional)</span></label>
                        <input
                            className={styles.input}
                            value={editForm.alt}
                            onChange={e => setEditForm({ ...editForm, alt: e.target.value })}
                            placeholder="e.g. Lab session at Chandigarh University"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className={styles.button} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Photo' : 'Add Photo'}</button>
                        {editingId && (
                            <button type="button" onClick={resetForm} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
