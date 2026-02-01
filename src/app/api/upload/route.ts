import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        console.log('[UPLOAD] Starting file upload process...');
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('[UPLOAD] No file found in request');
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        console.log(`[UPLOAD] Received file: ${file.name}, size: ${file.size} bytes`);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure unique and sanitized filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeName}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        console.log(`[UPLOAD] Upload directory: ${uploadDir}`);

        // Ensure directory exists with proper permissions
        try {
            await mkdir(uploadDir, { recursive: true });
            console.log('[UPLOAD] Directory verified/created');
        } catch (dirError) {
            console.error('[UPLOAD] Error creating directory:', dirError);
            throw new Error('Failed to create upload directory');
        }

        const filepath = path.join(uploadDir, filename);
        console.log(`[UPLOAD] Direct file path: ${filepath}`);

        await writeFile(filepath, buffer);
        console.log('[UPLOAD] File written successfully');

        // Return the relative URL for the frontend
        const fileUrl = `/uploads/${filename}`;
        console.log(`[UPLOAD] Returning success. URL: ${fileUrl}`);

        return NextResponse.json({
            success: true,
            url: fileUrl,
            filename: filename,
            size: file.size
        });
    } catch (error: any) {
        console.error('[UPLOAD] Fatal error during upload:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error during upload'
        }, { status: 500 });
    }
}
