"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    if (!mounted) {
        return (
            <button className="w-10 h-10 flex items-center justify-center opacity-0" suppressHydrationWarning>
                <Sun size={20} suppressHydrationWarning />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center bg-background text-foreground border-2 border-foreground hover:bg-primary hover:border-primary hover:text-black transition-all group shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            aria-label="Toggle Theme"
            suppressHydrationWarning
        >
            {theme === "dark" ? (
                <Sun size={20} className="icon-industrial" suppressHydrationWarning />
            ) : (
                <Moon size={20} className="icon-industrial" suppressHydrationWarning />
            )}
        </button>
    );
}
