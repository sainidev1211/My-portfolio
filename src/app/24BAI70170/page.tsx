"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';
import { 
    FaProjectDiagram, 
    FaCertificate, 
    FaBriefcase, 
    FaRobot, 
    FaEnvelope, 
    FaUser, 
    FaFileAlt, 
    FaShareAlt,
    FaExternalLinkAlt
} from 'react-icons/fa';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projectsCount: 0,
        certsCount: 0,
        expCount: 0,
        socialsCount: 0,
        messagesCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/content', { cache: 'no-store' }).then(r => r.json()),
            fetch('/api/contact').then(r => r.json()).catch(() => ({ messages: [] }))
        ]).then(([content, contactRes]) => {
            setStats({
                projectsCount: content.projects?.length || 0,
                certsCount: content.certifications?.length || 0,
                expCount: content.experience?.length || 0,
                socialsCount: content.socials?.length || 0,
                messagesCount: contactRes.messages?.length || contactRes.length || 0
            });
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const cards = [
        { title: 'Projects', count: stats.projectsCount, link: '/24BAI70170/projects', icon: <FaProjectDiagram /> },
        { title: 'Experience & Edu', count: stats.expCount, link: '/24BAI70170/experience', icon: <FaBriefcase /> },
        { title: 'Certifications', count: stats.certsCount, link: '/24BAI70170/certifications', icon: <FaCertificate /> },
        { title: 'Messages Received', count: stats.messagesCount, link: '/24BAI70170/contacts', icon: <FaEnvelope /> },
        { title: 'About & Pictures', count: 'Active', link: '/24BAI70170/about', icon: <FaUser /> },
        { title: 'AI Assistant Knowledge', count: 'Groq Ready', link: '/24BAI70170/ai-knowledge', icon: <FaRobot /> },
        { title: 'Resume & Summary', count: 'PDF Ready', link: '/24BAI70170/resume', icon: <FaFileAlt /> },
        { title: 'Social Handles', count: stats.socialsCount, link: '/24BAI70170/socials', icon: <FaShareAlt /> }
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)' }}>Dev Saini Control Center</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                        Manage all portfolio content, pictures, AI knowledge, and messages in real-time.
                    </p>
                </div>
                <a 
                    href="/" 
                    target="_blank"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        background: 'var(--accent)',
                        color: '#000',
                        fontWeight: 600,
                        borderRadius: '8px',
                        textDecoration: 'none'
                    }}
                >
                    <FaExternalLinkAlt size={12} /> View Live Portfolio
                </a>
            </div>

            {/* Stats / Quick Navigation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
                {cards.map(c => (
                    <Link 
                        key={c.title} 
                        href={c.link}
                        style={{
                            background: 'rgba(22, 22, 22, 0.8)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{c.icon}</span>
                            <span style={{ 
                                fontFamily: 'var(--font-mono)', 
                                fontSize: '1.2rem', 
                                fontWeight: 700, 
                                color: 'var(--text)' 
                            }}>
                                {loading ? '...' : c.count}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>{c.title}</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                            Manage &amp; Edit →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
