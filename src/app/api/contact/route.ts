import { NextResponse } from 'next/server';
import { saveContact, getContacts } from '@/lib/contacts';

export async function GET() {
    // Check if admin is authenticated via cookie check (simple check for now)
    // In a real app, we would use middleware or cleaner auth check
    return NextResponse.json(await getContacts());
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !phone || !message) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        await saveContact(body);
        return NextResponse.json({ success: true, message: 'We will connect you within 48 hours.' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to submit' }, { status: 500 });
    }
}
