"use client";

import { useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global captured error:", error);
    }, [error]);

    return (
        <ErrorBoundary>
            {/* The error boundary itself will catch and display the fallback UI */}
            <div className="hidden">{error.message}</div>
        </ErrorBoundary>
    );
}
