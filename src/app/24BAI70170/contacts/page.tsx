"use client";

import React, { useState, useEffect } from 'react';

export default function ContactsViewer() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/contact')
            .then(res => res.json())
            .then(res => {
                setContacts(res.reverse()); // Show newest first
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '1000px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Contact Submissions</h1>

            <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Phone</th>
                            <th style={{ padding: '1rem', width: '40%' }}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>{new Date(c.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.name}</td>
                                <td style={{ padding: '1rem' }}>{c.email}</td>
                                <td style={{ padding: '1rem' }}>{c.phone}</td>
                                <td style={{ padding: '1rem', opacity: 0.9 }}>{c.message}</td>
                            </tr>
                        ))}
                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No submissions yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
