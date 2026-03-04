"use client";

import { useEffect, useRef } from "react";

export default function SiteTracker() {
    const tracked = useRef(false);

    useEffect(() => {
        if (!tracked.current) {
            tracked.current = true;
            // Fire and forget
            fetch('/api/analytics', { method: 'POST' }).catch(() => { });
        }
    }, []);

    return null;
}
