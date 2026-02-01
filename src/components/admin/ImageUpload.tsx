import React, { useState } from 'react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            console.log("Starting upload...");
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                onChange(data.url);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000); // Hide success after 3s
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>{label}</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative'
                }}>
                    {value ? (
                        <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>No Image</span>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleUpload}
                        disabled={uploading}
                        style={{
                            padding: '0.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            width: '100%',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    />
                    {uploading && <p style={{ fontSize: '0.9rem', color: '#60a5fa', marginTop: '0.5rem' }}>Uploading...</p>}
                    {success && <p style={{ fontSize: '0.9rem', color: '#4ade80', marginTop: '0.5rem', fontWeight: 'bold' }}>✓ Upload Successful!</p>}
                    {error && <p style={{ fontSize: '0.9rem', color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}
