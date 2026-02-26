import { NextResponse } from "next/server";

export function apiError(message: string, status: number = 500) {
    if (status === 500) {
        console.error(`[CRITICAL API ERROR] ${message}`);
    } else {
        console.warn(`[API ERROR ${status}] ${message}`);
    }

    return NextResponse.json(
        { error: message, success: false },
        { status }
    );
}
