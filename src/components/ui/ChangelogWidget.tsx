"use client";

const LOGS = [
    { version: "v0.8.0", date: "2026-02-26", title: "THE FINAL UPDATE", details: "SYSTEM HARDENING, SEO PROTOCOLS, OPS DASHBOARD." },
    { version: "v0.7.5", date: "2026-02-21", title: "STREETWEAR EVOLUTION", details: "LUXURY UI REFINEMENT, FOMO COUNTERS, SMART FILTERS." },
    { version: "v0.7.0", date: "2026-02-15", title: "STABLE CORE", details: "FIREBASE INTEGRATION, ADMIN PORTAL, PERSISTENT CART." },
];

export default function ChangelogWidget() {
    return (
        <section className="border-t border-foreground/5 pt-32 mb-32">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 italic">SYSTEM // <span className="text-primary">CHANGELOG</span></h2>
            <div className="space-y-8">
                {LOGS.map((log, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-12 border-l border-foreground/10 pl-8 relative">
                        <div className="absolute left-[-1px] top-0 w-[1px] h-4 bg-primary" />
                        <div className="min-w-[120px]">
                            <p className="text-primary font-black text-xs font-mono">{log.version}</p>
                            <p className="text-foreground/20 text-[10px] font-mono mt-1">{log.date}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2">{log.title}</h3>
                            <p className="text-foreground/40 text-[10px] font-mono uppercase leading-relaxed max-w-xl">{log.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
