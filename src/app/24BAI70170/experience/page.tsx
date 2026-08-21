"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import adminStyles from '../admin.module.css';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit mode state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({
        role: '',
        company: '',
        location: '',
        period: '',
        type: 'Project Work',
        description: '',
        highlights: '',
        technologies: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/content', { cache: 'no-store' })
            .then(res => res.json())
            .then(res => {
                setExperiences(res.experience || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load experiences:", err);
                setLoading(false);
            });
    };

    const resetForm = () => {
        setEditingId(null);
        setEditForm({
            role: '',
            company: '',
            location: '',
            period: '',
            type: 'Project Work',
            description: '',
            highlights: '',
            technologies: ''
        });
    };

    const handleEdit = (exp: any) => {
        setEditingId(exp.id);
        setEditForm({
            ...exp,
            highlights: Array.isArray(exp.highlights) ? exp.highlights.join('\n') : (exp.highlights || ''),
            technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : (exp.technologies || '')
        });
        const formElement = document.getElementById('exp-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this experience entry?")) return;

        try {
            const fullContent = await fetch('/api/content', { cache: 'no-store' }).then(res => res.json());
            fullContent.experience = (fullContent.experience || []).filter((e: any) => e.id !== id);

            const res = await fetch('/api/content', {
                method: 'POST',
                body: JSON.stringify(fullContent)
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting experience entry.");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const fullContent = await fetch('/api/content', { cache: 'no-store' }).then(res => res.json());

            const highlightsArr = editForm.highlights
                ? editForm.highlights.split('\n').map((h: string) => h.trim()).filter(Boolean)
                : [];
            
            const techArr = editForm.technologies
                ? editForm.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
                : [];

            const newExp = {
                ...editForm,
                id: editingId || Date.now(),
                highlights: highlightsArr,
                technologies: techArr
            };

            if (!fullContent.experience) fullContent.experience = [];

            if (editingId) {
                fullContent.experience = fullContent.experience.map((e: any) => e.id === editingId ? newExp : e);
            } else {
                fullContent.experience.push(newExp);
            }

            const res = await fetch('/api/content', {
                method: 'POST',
                body: JSON.stringify(fullContent)
            });

            if (res.ok) {
                alert("Experience entry saved successfully!");
                resetForm();
                fetchData();
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Experience &amp; Education</h1>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {experiences.length === 0 && <p style={{ opacity: 0.5 }}>No experience entries found.</p>}
                {experiences.map(e => (
                    <div key={e.id} className={adminStyles.cardItem}>
                        <div className={adminStyles.cardContent}>
                            <h3>{e.role} — <span style={{ color: 'var(--accent)' }}>{e.company}</span></h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0' }}>
                                {e.period} • {e.location || 'N/A'} • {e.type}
                            </p>
                            <p>{e.description}</p>
                        </div>
                        <div className={adminStyles.cardActions}>
                            <button
                                onClick={() => handleEdit(e)}
                                className={`${adminStyles.actionButton} ${adminStyles.btnEdit}`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(e.id)}
                                className={`${adminStyles.actionButton} ${adminStyles.btnDelete}`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div id="exp-form" className={styles.form}>
                <h2>{editingId ? 'Edit Experience / Education' : 'Add New Experience / Education'}</h2>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.group}>
                            <label className={styles.label}>Role / Degree Title</label>
                            <input 
                                className={styles.input} 
                                value={editForm.role} 
                                onChange={e => setEditForm({ ...editForm, role: e.target.value })} 
                                placeholder="e.g. Full-Stack & AI Engineer" 
                                required 
                            />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>Company / Institution</label>
                            <input 
                                className={styles.input} 
                                value={editForm.company} 
                                onChange={e => setEditForm({ ...editForm, company: e.target.value })} 
                                placeholder="e.g. Chandigarh University" 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className={styles.group}>
                            <label className={styles.label}>Period / Duration</label>
                            <input 
                                className={styles.input} 
                                value={editForm.period} 
                                onChange={e => setEditForm({ ...editForm, period: e.target.value })} 
                                placeholder="e.g. 2024 — 2028" 
                                required 
                            />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>Location</label>
                            <input 
                                className={styles.input} 
                                value={editForm.location} 
                                onChange={e => setEditForm({ ...editForm, location: e.target.value })} 
                                placeholder="e.g. Chandigarh, India" 
                            />
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>Type</label>
                            <select 
                                className={styles.input} 
                                value={editForm.type} 
                                onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                            >
                                <option value="Education">Education</option>
                                <option value="Work / Internship">Work / Internship</option>
                                <option value="Project Work">Project Work</option>
                                <option value="Leadership">Leadership</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Short Summary Description</label>
                        <textarea 
                            className={styles.textarea} 
                            value={editForm.description} 
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })} 
                            placeholder="Overview of your responsibilities, focus areas, or coursework..."
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Bullet Point Highlights (One per line)</label>
                        <textarea 
                            className={styles.textarea} 
                            value={editForm.highlights} 
                            onChange={e => setEditForm({ ...editForm, highlights: e.target.value })} 
                            placeholder="Architected high performance music platform with real-time streaming&#10;Engineered appointment system managing 500+ patient records"
                            style={{ minHeight: '110px' }}
                        />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Technologies / Skills (Comma separated)</label>
                        <input 
                            className={styles.input} 
                            value={editForm.technologies} 
                            onChange={e => setEditForm({ ...editForm, technologies: e.target.value })} 
                            placeholder="Next.js, Python, TensorFlow, MongoDB" 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className={styles.button} disabled={saving}>
                            {saving ? 'Saving...' : (editingId ? 'Update Entry' : 'Create Entry')}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
