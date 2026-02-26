"use client";

import React from "react";
import { toast } from "sonner";

export default function NotifyButton({ city }: { city: string }) {
    return (
        <button
            onClick={() => toast.success(`NOTIFICATION REGISTERED FOR: ${city}`)}
            className="mt-4 md:mt-0 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-black font-bold uppercase text-sm transition-colors cursor-pointer"
        >
            NOTIFY ME
        </button>
    );
}
