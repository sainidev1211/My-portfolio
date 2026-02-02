"use client";

import React from 'react';
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

    // If we are on login page, don't show custom admin layout
    if (pathname?.includes('/login')) return <>{children}</>;

    // note: Middleware handles auth protection now. 
    // We removed client-side cookie check because HttpOnly cookies are not accessible to JS.

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/24BAI70170/login');
    };

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className={styles.container}>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <div className={styles.brandMobile}>Secure Panel</div>
                <button onClick={toggleSidebar} className={styles.mobileToggle}>
                    <span style={{ fontSize: '1.5rem' }}>☰</span>
                </button>
            </header>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.brand}>Secure Panel</div>
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
                        Edit About
                    </Link>
                    <Link href="/24BAI70170/projects" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/projects' ? styles.active : ''}`}>
                        Manage Projects
                    </Link>
                    <Link href="/24BAI70170/uploads" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/uploads' ? styles.active : ''}`}>
                        File Uploads
                    </Link>
                    <Link href="/24BAI70170/ai-knowledge" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/ai-knowledge' ? styles.active : ''}`}>
                        AI Knowledge
                    </Link>
                    <Link href="/24BAI70170/certifications" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/certifications' ? styles.active : ''}`}>
                        Certificates
                    </Link>
                    <Link href="/24BAI70170/resume" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/resume' ? styles.active : ''}`}>
                        Resume
                    </Link>
                    <Link href="/24BAI70170/socials" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/socials' ? styles.active : ''}`}>
                        Socials
                    </Link>
                    <Link href="/24BAI70170/contacts" onClick={closeSidebar} className={`${styles.navLink} ${pathname === '/24BAI70170/contacts' ? styles.active : ''}`}>
                        Contacts
                    </Link>
                </nav>
                <button onClick={handleLogout} className={styles.logout}>Logout</button>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
