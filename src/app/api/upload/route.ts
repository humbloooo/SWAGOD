import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const path = join(process.cwd(), 'public', 'uploads', filename);

        await writeFile(path, buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
