"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeProps {
    data: {
        summary: string;
        fileUrl: string;
    }
}

const ResumeClient: React.FC<ResumeProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { summary, fileUrl } = data;

    if (!summary && !fileUrl) return null;

    return (
        <section
            id="resume-slide" // This ID matches what Header scrolls to
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                paddingTop: '6rem' // Space for header
            }}
        >
            <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--secondary-glow)', filter: 'blur(120px)', zIndex: 0 }} />

            <div style={{ width: '100%', maxWidth: '1200px', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '80%' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '2rem' }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Resume</h2>
                    <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>{summary}</p>
                </motion.div>

                {!isOpen ? (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            padding: '1.2rem 3rem',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 10px 40px var(--primary-glow)',
                            marginTop: '2rem'
                        }}
                    >
                        View Resume
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            width: '100%',
                            flex: 1,
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: '#111',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '2rem',
                                zIndex: 10,
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}
                        >
                            ✕
                        </button>

                        {fileUrl ? (
                            <>
                                <iframe src={`${fileUrl}#view=FitH`} style={{ flex: 1, width: '100%', border: 'none' }} title="Resume Preview" />
                                <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                    <a
                                        href={fileUrl}
                                        download
                                        target="_blank"
                                        style={{
                                            padding: '0.8rem 2rem',
                                            background: 'white',
                                            color: 'black',
                                            borderRadius: '50px',
                                            fontWeight: 'bold',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Download PDF
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                No resume uploaded.
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default ResumeClient;
