import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Protect Admin Routes (Anything starting with /24BAI70170)
    // EXCEPTION: The login page itself (/24BAI70170/login)
    if (path.startsWith('/24BAI70170') && !path.startsWith('/24BAI70170/login')) {
        const authCookie = request.cookies.get('admin_auth');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/24BAI70170/login', request.url));
        }
    }

    // 2. Protect API Routes (POST/PUT/DELETE)
    // Allow public POST to /api/contact (for users to send messages)
    // Block POST to /api/content unless authenticated
    if (path.startsWith('/api/content') && request.method !== 'GET') {
        const authCookie = request.cookies.get('admin_auth');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // 3. Protect GET /api/contact (viewing messages)
    if (path.startsWith('/api/contact') && request.method === 'GET') {
        const authCookie = request.cookies.get('admin_auth');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/24BAI70170/:path*',
        '/api/content/:path*',
        '/api/contact/:path*'
    ],
};
