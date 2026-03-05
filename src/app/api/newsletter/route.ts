import { NextResponse } from 'next/server';
import { addNewsletterEmail } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, message: "INVALID EMAIL" }, { status: 400 });
        }

        const result = await addNewsletterEmail(email);
        revalidatePath("/", "layout");
        return NextResponse.json(result);
    } catch (error) {
        console.error("Newsletter API error:", error);
        return NextResponse.json({ success: false, message: "SYSTEM ERROR" }, { status: 500 });
    }
}
