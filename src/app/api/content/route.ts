import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/data';

export async function GET() {
    const data = await getContent();
    return NextResponse.json(data || {});
}

export async function POST(request: Request) {
    const body = await request.json();
    const success = await saveContent(body);

    if (success) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
