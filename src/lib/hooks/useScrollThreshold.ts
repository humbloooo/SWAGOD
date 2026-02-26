import { useState, useEffect } from "react";

export function useScrollThreshold(threshold = 150) {
    const [isPastThreshold, setIsPastThreshold] = useState(false);

    useEffect(() => {
        let lastFired = 0;
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastFired < 100) return; // throttle to 100ms

            setIsPastThreshold(window.scrollY > threshold);
            lastFired = now;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return isPastThreshold;
}
