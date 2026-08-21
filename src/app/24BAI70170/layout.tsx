"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const isLoginPage = pathname === '/24BAI70170/login';

    useEffect(() => {
        if (isLoginPage) {
            setAuthChecked(true);
            return;
        }

        // Verify authentication on every route change in admin
        fetch('/api/auth/check', { cache: 'no-store' })
            .then(res => {
                if (!res.ok) {
                    router.replace('/24BAI70170/login');
                } else {
                    setAuthChecked(true);
                }
            })
            .catch(() => {
                router.replace('/24BAI70170/login');
            });
    }, [pathname, isLoginPage, router]);

    // If on login page, render children directly without admin layout
    if (isLoginPage) return <>{children}</>;

    // While checking authentication, show clean secure loader
    if (!authChecked) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Verifying admin credentials...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/24BAI70170/login');
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className={styles.container}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <div className={styles.brandMobile}>Dev Saini Admin</div>
                <button onClick={toggleSidebar} className={styles.mobileToggle}>
                    <span style={{ fontSize: '1.5rem' }}>☰</span>
                </button>
            </header>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.brand}>Dev Saini Admin</div>
                    <button onClick={closeSidebar} className={styles.closeBtnMobile}>✕</button>
                </div>
                <nav>
                    <Link href="/24BAI70170" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170' ? styles.active : ''}`}>
                        Dashboard
                    </Link>
                    <Link href="/24BAI70170/hero" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/hero' ? styles.active : ''}`}>
                        Edit Hero
                    </Link>
                    <Link href="/24BAI70170/about" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/about' ? styles.active : ''}`}>
                        Edit About &amp; Pics
                    </Link>
                    <Link href="/24BAI70170/experience" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/experience' ? styles.active : ''}`}>
                        Experience / Edu
                    </Link>
                    <Link href="/24BAI70170/projects" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/projects' ? styles.active : ''}`}>
                        Manage Projects
                    </Link>
                    <Link href="/24BAI70170/certifications" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/certifications' ? styles.active : ''}`}>
                        Certificates
                    </Link>
                    <Link href="/24BAI70170/campus-involvement" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/campus-involvement' ? styles.active : ''}`}>
                        Campus Involvement
                    </Link>
                    <Link href="/24BAI70170/academic-journey" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/academic-journey' ? styles.active : ''}`}>
                        Academic Journey
                    </Link>
                    <Link href="/24BAI70170/resume" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/resume' ? styles.active : ''}`}>
                        Resume PDF
                    </Link>
                    <Link href="/24BAI70170/ai-knowledge" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/ai-knowledge' ? styles.active : ''}`}>
                        AI Knowledge &amp; Q&amp;A
                    </Link>
                    <Link href="/24BAI70170/socials" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/socials' ? styles.active : ''}`}>
                        Social Links
                    </Link>
                    <Link href="/24BAI70170/contacts" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/contacts' ? styles.active : ''}`}>
                        Messages
                    </Link>
                    <Link href="/24BAI70170/uploads" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/uploads' ? styles.active : ''}`}>
                        File Uploads
                    </Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <a href="/" target="_blank" className={styles.navLink} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                        ↗ View Live Site
                    </a>
                    <button onClick={handleLogout} className={styles.logout}>Logout</button>
                </div>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
