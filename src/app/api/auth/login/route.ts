import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Environment variables are best, but hardcoded here as requested for specific credentials
const ADMIN_USER = '24BAI70170';
const ADMIN_PASS = 'Saini@dev12';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Strict Check
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            // Set HTTP-only Secure Cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
                sameSite: 'strict'
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
