"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface LogEntry {
    version: string;
    title: string;
    content: string;
    timestamp: string;
    type: string;
    isAdminOnly: boolean;
}

export default function ChangelogWidget() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/logs")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLogs(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load logs", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <section className="border-t border-foreground/5 pt-32 mb-32 animate-pulse">
                <div className="h-10 w-64 bg-foreground/10 mb-16" />
                <div className="space-y-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-12 border-l border-foreground/10 pl-8">
                            <div className="w-24 h-4 bg-foreground/10" />
                            <div className="w-full max-w-xl h-20 bg-foreground/10" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (logs.length === 0) return null;

    return (
        <section className="border-t border-foreground/5 pt-32 mb-32">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 italic">SYSTEM // <span className="text-primary">CHANGELOG</span></h2>
            <div className="space-y-8">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-12 border-l border-foreground/10 pl-8 relative">
                        <div className="absolute left-[-1px] top-0 w-[1px] h-4 bg-primary" />
                        <div className="min-w-[120px]">
                            <p className="text-primary font-black text-xs font-mono">{log.version}</p>
                            <p className="text-foreground/20 text-[10px] font-mono mt-1">
                                {format(new Date(log.timestamp), "yyyy-MM-dd")}
                            </p>
                            {log.isAdminOnly && (
                                <span className="text-red-500 text-[8px] font-bold uppercase tracking-widest block mt-2">ADMIN_SENSITIVE</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-3">
                                {log.title}
                                <span className={`text-[8px] px-2 py-0.5 border ${log.type === 'FIX' ? 'border-amber-500/50 text-amber-500' :
                                        log.type === 'FEATURE' ? 'border-primary/50 text-primary' :
                                            'border-foreground/20 text-foreground/40'
                                    } font-mono`}>{log.type}</span>
                            </h3>
                            <p className="text-foreground/40 text-[10px] font-mono uppercase leading-relaxed max-w-xl">{log.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
