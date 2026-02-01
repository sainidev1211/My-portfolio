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

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>Secure Panel</div>
                <nav>
                    <Link href="/24BAI70170" className={`${styles.navLink} ${pathname === '/24BAI70170' ? styles.active : ''}`}>
                        Dashboard
                    </Link>
                    <Link href="/24BAI70170/hero" className={`${styles.navLink} ${pathname === '/24BAI70170/hero' ? styles.active : ''}`}>
                        Edit Hero
                    </Link>
                    <Link href="/24BAI70170/about" className={`${styles.navLink} ${pathname === '/24BAI70170/about' ? styles.active : ''}`}>
                        Edit About
                    </Link>
                    <Link href="/24BAI70170/projects" className={`${styles.navLink} ${pathname === '/24BAI70170/projects' ? styles.active : ''}`}>
                        Manage Projects
                    </Link>
                    <Link href="/24BAI70170/uploads" className={`${styles.navLink} ${pathname === '/24BAI70170/uploads' ? styles.active : ''}`}>
                        File Uploads
                    </Link>
                    <Link href="/24BAI70170/certifications" className={`${styles.navLink} ${pathname === '/24BAI70170/certifications' ? styles.active : ''}`}>
                        Certificates
                    </Link>
                    <Link href="/24BAI70170/resume" className={`${styles.navLink} ${pathname === '/24BAI70170/resume' ? styles.active : ''}`}>
                        Resume
                    </Link>
                    <Link href="/24BAI70170/socials" className={`${styles.navLink} ${pathname === '/24BAI70170/socials' ? styles.active : ''}`}>
                        Socials
                    </Link>
                    <Link href="/24BAI70170/contacts" className={`${styles.navLink} ${pathname === '/24BAI70170/contacts' ? styles.active : ''}`}>
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
