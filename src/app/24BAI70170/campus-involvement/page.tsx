"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import adminStyles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';

const ICON_OPTIONS = ['FaLaptopCode', 'FaLightbulb', 'FaTrophy', 'FaUsers', 'FaUniversity', 'FaCode', 'FaStar'];
const CATEGORY_OPTIONS = ['National Hackathon', 'Startup Pitching', 'Innovation Challenge', 'Campus Initiative', 'Workshop', 'Conference', 'Other'];

export default function CampusInvolvementManager() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({
        title: '', category: 'National Hackathon', desc: '', src: '', alt: '', icon: 'FaLaptopCode'
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = () => {
        fetch('/api/content', { cache: 'no-store' })
            .then(res => res.json())
            .then(res => {
                setEvents(res.campusInvolvement || []);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    };

    const resetForm = () => {
        setEditingId(null);
        setEditForm({ title: '', category: 'National Hackathon', desc: '', src: '', alt: '', icon: 'FaLaptopCode' });
    };

    const handleEdit = (ev: any) => {
        setEditingId(ev.id);
        setEditForm({ ...ev });
        document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this event?')) return;
        const fullContent = await fetch('/api/content', { cache: 'no-store' }).then(r => r.json());
        fullContent.campusInvolvement = (fullContent.campusInvolvement || []).filter((e: any) => e.id !== id);
        const res = await fetch('/api/content', { method: 'POST', body: JSON.stringify(fullContent) });
        if (res.ok) fetchData();
        else alert('Failed to delete.');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fullContent = await fetch('/api/content', { cache: 'no-store' }).then(r => r.json());
            const newEvent = { ...editForm, id: editingId || Date.now() };
            if (!fullContent.campusInvolvement) fullContent.campusInvolvement = [];
            if (editingId) {
                fullContent.campusInvolvement = fullContent.campusInvolvement.map((ev: any) => ev.id === editingId ? newEvent : ev);
            } else {
                fullContent.campusInvolvement.push(newEvent);
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
            <h1 style={{ marginBottom: '2rem' }}>Campus Involvement &amp; Activities</h1>
            <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '0.9rem' }}>
                Manage events shown in the Campus Involvement section on the portfolio. All changes are saved to MongoDB.
            </p>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {events.length === 0 && <p style={{ opacity: 0.5 }}>No events found. Add one below.</p>}
                {events.map(ev => (
                    <div key={ev.id} className={adminStyles.cardItem} style={{ borderLeft: '4px solid var(--accent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden', flex: 1 }}>
                            {ev.src && (
                                <img src={ev.src} alt={ev.alt || ev.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                            )}
                            <div className={adminStyles.cardContent} style={{ flex: 1 }}>
                                <h3>{ev.title}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--accent)', color: '#000', fontWeight: 500 }}>
                                        {ev.category}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{ev.icon}</span>
                                </div>
                                {ev.desc && <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.desc}</p>}
                            </div>
                        </div>
                        <div className={adminStyles.cardActions}>
                            <button onClick={() => handleEdit(ev)} className={`${adminStyles.actionButton} ${adminStyles.btnEdit}`}>Edit</button>
                            <button onClick={() => handleDelete(ev.id)} className={`${adminStyles.actionButton} ${adminStyles.btnDelete}`}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div id="event-form" className={styles.form}>
                <h2>{editingId ? 'Edit Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.group}>
                        <label className={styles.label}>Event Title *</label>
                        <input className={styles.input} required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="e.g. Build for Bharat 2026" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.group}>
                            <label className={styles.label}>Category *</label>
                            <select className={styles.input} required value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Icon</label>
                            <select className={styles.input} value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })}>
                                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Description</label>
                        <textarea className={styles.input} rows={3} value={editForm.desc} onChange={e => setEditForm({ ...editForm, desc: e.target.value })} placeholder="Brief description of the event..." />
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Alt Text (for image)</label>
                        <input className={styles.input} value={editForm.alt} onChange={e => setEditForm({ ...editForm, alt: e.target.value })} placeholder="e.g. Team at MindForge Hackathon" />
                    </div>

                    <ImageUpload
                        label="Event Photo"
                        value={editForm.src}
                        onChange={(url) => setEditForm({ ...editForm, src: url })}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className={styles.button} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}</button>
                        {editingId && <button type="button" onClick={resetForm} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}
