"use client";

import { useState, useEffect, useCallback } from "react";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________";

export function useTextScramble(text: string, duration: number = 2000) {
    const [scrambled, setScrambled] = useState(text);

    const scramble = useCallback(() => {
        let frame = 0;
        const totalFrames = 60; // 60fps approx
        const iterationTime = duration / totalFrames;

        const interval = setInterval(() => {
            setScrambled(
                text
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return " ";
                        if (index < (frame / totalFrames) * text.length) return text[index];
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join("")
            );

            frame++;
            if (frame > totalFrames) {
                clearInterval(interval);
                setScrambled(text);
            }
        }, iterationTime);

        return () => clearInterval(interval);
    }, [text, duration]);

    useEffect(() => {
        scramble();
    }, [scramble]);

    return scrambled;
}
