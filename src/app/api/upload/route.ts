import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import File from '@/models/File';

export async function POST(request: Request) {
    try {
        console.log('[UPLOAD] Starting file upload process...');

        // 1. Parse FormData
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('[UPLOAD] No file found in request');
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        console.log(`[UPLOAD] Received file: ${file.name}, size: ${file.size} bytes`);

        // 2. Connect to DB
        await connectDB();

        // 3. Convert to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Create File Document
        const newFile = await File.create({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            data: buffer
        });

        console.log(`[UPLOAD] File saved to MongoDB. ID: ${newFile._id}`);

        // 5. Return URL
        // The URL points to our new GET endpoint
        const fileUrl = `/api/files/${newFile._id}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            filename: newFile.filename,
            size: newFile.size,
            id: newFile._id
        });

    } catch (error: any) {
        console.error('[UPLOAD] Fatal error during upload:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error during upload'
        }, { status: 500 });
    }
}
