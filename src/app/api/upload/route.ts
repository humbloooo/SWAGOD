import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpscc5zqw',
    api_key: process.env.CLOUDINARY_API_KEY || '916733632129564',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to base64 for Cloudinary upload
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: 'swagod/products',
            resource_type: 'auto'
        });

        // Optimize delivery by applying auto-format and auto-quality
        // Videos don't always behave perfectly with default image transformation URLs, 
        // so we use the raw secure_url for videos, and optimized url for imagery.
        const optimizeUrl = uploadResult.resource_type === 'video'
            ? uploadResult.secure_url
            : cloudinary.url(uploadResult.public_id, {
                fetch_format: 'auto',
                quality: 'auto'
            });

        return NextResponse.json({ url: optimizeUrl, public_id: uploadResult.public_id });
    } catch (e) {
        console.error("Cloudinary upload error:", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
