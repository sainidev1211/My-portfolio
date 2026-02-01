import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export async function GET() {
    try {
        await connectDB();
        const contacts = await Contact.find({}).sort({ date: -1 });
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
        }

        await connectDB();
        const newContact = await Contact.create({
            name, email, phone: phone || 'N/A', message, date: new Date()
        });

        return NextResponse.json({ success: true, id: newContact._id });
    } catch (error) {
        console.error('Contact Save Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit' }, { status: 500 });
    }
}
