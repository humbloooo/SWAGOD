"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
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

    const cycleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    return (
        <button
            onClick={cycleTheme}
            className="w-10 h-10 flex items-center justify-center bg-background text-foreground border-2 border-foreground hover:bg-primary hover:border-primary hover:text-black transition-all group shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 relative"
            aria-label={`Toggle Theme (Current: ${theme})`}
            suppressHydrationWarning
        >
            {theme === "dark" && <Sun size={20} className="icon-industrial" suppressHydrationWarning />}
            {theme === "light" && <Moon size={20} className="icon-industrial" suppressHydrationWarning />}
            {theme === "system" && <Monitor size={20} className="icon-industrial" suppressHydrationWarning />}

            <span className="absolute -top-1 -right-1 bg-primary text-black text-[6px] font-black px-1 uppercase scale-75">
                {theme}
            </span>
        </button>
    );
}
