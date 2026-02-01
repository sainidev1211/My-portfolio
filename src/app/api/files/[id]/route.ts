import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import File from '@/models/File';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const file = await File.findById(id);

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Create response with appropriate headers
        const response = new NextResponse(file.data);
        response.headers.set('Content-Type', file.contentType);
        response.headers.set('Content-Length', file.size.toString());

        // Optional: Add cache control for performance
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return response;
    } catch (error) {
        console.error('Error fetching file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
