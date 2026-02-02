"use client";

import React, { useState, useEffect } from 'react';
import styles from '../editor.module.css';
import adminStyles from '../admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';

export default function ProjectsManager() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit mode state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({
        title: '', description: '', tags: '', link: '', image: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/content')
            .then(res => res.json())
            .then(res => {
                setProjects(res.projects);
                setLoading(false);
            });
    };

    const resetForm = () => {
        setEditingId(null);
        setEditForm({ title: '', description: '', tags: '', link: '', image: '' });
    };

    const handleEdit = (project: any) => {
        setEditingId(project.id);
        setEditForm({
            ...project,
            tags: project.tags.join(', ')
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        const fullContent = await fetch('/api/content').then(res => res.json());
        fullContent.projects = fullContent.projects.filter((p: any) => p.id !== id);

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
        const tagsArray = editForm.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);

        const newProject = {
            ...editForm,
            id: editingId || Date.now(), // simple ID generation
            tags: tagsArray
        };

        if (editingId) {
            // Update
            fullContent.projects = fullContent.projects.map((p: any) => p.id === editingId ? newProject : p);
        } else {
            // Create
            fullContent.projects.push(newProject);
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
            <h1 style={{ marginBottom: '2rem' }}>Manage Projects</h1>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                {projects.map(p => (
                    <div key={p.id} className={adminStyles.cardItem}>
                        <div className={adminStyles.cardContent}>
                            <h3>{p.title}</h3>
                            <p>{p.description.substring(0, 50)}...</p>
                        </div>
                        <div className={adminStyles.cardActions}>
                            <button
                                onClick={() => handleEdit(p)}
                                className={`${adminStyles.actionButton} ${adminStyles.btnEdit}`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className={`${adminStyles.actionButton} ${adminStyles.btnDelete}`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className={styles.form}>
                <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.group}>
                        <label className={styles.label}>Title</label>
                        <input className={styles.input} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Description</label>
                        <textarea className={styles.textarea} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} required />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Tags (Comma separated)</label>
                        <input className={styles.input} value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Link</label>
                        <input className={styles.input} value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} />
                    </div>

                    <ImageUpload
                        label="Project Image"
                        value={editForm.image}
                        onChange={(url) => setEditForm({ ...editForm, image: url })}
                    />

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className={styles.button} disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
                        {editingId && <button type="button" onClick={resetForm} style={{ padding: '1rem', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}
