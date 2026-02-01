"use client";

import React, { useState } from 'react';
import styles from '../editor.module.css';

export default function UploadManager() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError("");
        setUploadedUrl("");

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log("Starting upload...");
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            console.log("Upload status:", res.status);
            const data = await res.json();
            console.log("Upload response:", data);

            if (data.success) {
                setUploadedUrl(data.url);
                setFile(null);
            } else {
                setError(data.error || `Upload failed with status: ${res.status}`);
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(`Network/Client Error: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>File Uploads</h1>

            <div className={styles.form}>
                <form onSubmit={handleUpload} className={styles.group}>
                    <label className={styles.label}>Select Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.input}
                    />
                    <button type="submit" disabled={!file || uploading} className={styles.button} style={{ marginTop: '1rem' }}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>

                {error && <div style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</div>}

                {uploadedUrl && (
                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '0.5rem', color: '#60a5fa' }}>Upload Successful!</h3>
                        <p style={{ wordBreak: 'break-all', marginBottom: '1rem' }}>URL: <strong>{uploadedUrl}</strong></p>
                        <div style={{ maxWidth: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                            <img src={uploadedUrl} alt="Uploaded" style={{ width: '100%', display: 'block' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>Copy the URL above to use in your projects or content.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
