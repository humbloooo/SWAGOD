"use client";

import { useState, useEffect } from "react";
import { Activity, ShieldCheck, Zap, Server, Globe, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function NetworkMonitoring() {
    const [stats, setStats] = useState({
        latency: "24ms",
        uptime: "99.98%",
        requests: 0,
        bandwidth: "1.2 TB",
        cpu: "12%",
        ram: "45%"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                latency: Math.floor(Math.random() * 10 + 20) + "ms",
                requests: prev.requests + Math.floor(Math.random() * 5),
                cpu: Math.floor(Math.random() * 5 + 10) + "%"
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const metrics = [
        { label: "Internal Latency", value: stats.latency, icon: Zap, color: "text-green-500" },
        { label: "System Uptime", value: stats.uptime, icon: ShieldCheck, color: "text-blue-500" },
        { label: "Total Requests", value: stats.requests.toLocaleString(), icon: Activity, color: "text-primary" },
        { label: "Network Bandwidth", value: stats.bandwidth, icon: Globe, color: "text-purple-500" },
        { label: "CPU Load", value: stats.cpu, icon: Cpu, color: "text-orange-500" },
        { label: "Memory Usage", value: stats.ram, icon: Server, color: "text-cyan-500" },
    ];

    return (
        <main className="pb-[100px] pt-32 px-6 bg-background">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
                        NETWORK // <span className="text-primary">MONITORING</span>
                    </h1>
                    <p className="text-foreground/40 font-mono text-xs uppercase tracking-widest">REAL-TIME SYSTEM STACK ANALYTICS</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metrics.map((m, i) => (
                        <motion.div
                            key={m.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-foreground/5 border border-foreground/10 p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <m.icon size={64} />
                            </div>
                            <h3 className="text-foreground/40 font-mono text-[10px] uppercase tracking-[0.2em] mb-4">{m.label}</h3>
                            <p className={`text-4xl font-black ${m.color} tracking-tighter`}>{m.value}</p>

                            <div className="mt-6 h-1 w-full bg-foreground/10 overflow-hidden">
                                <motion.div
                                    className={`h-full bg-current ${m.color}`}
                                    animate={{ x: ["-100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 bg-foreground/5 border border-foreground/10 p-8 font-mono">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Live Server Logs</h3>
                        <span className="text-[10px] text-foreground/20 animate-pulse">RECORDING ACTIVE...</span>
                    </div>
                    <div className="space-y-2 h-[300px] overflow-y-auto text-[10px] text-foreground/40 leading-relaxed scrollbar-hide">
                        <p>[{new Date().toISOString()}] AUTH_SERVICE: Session validated for user_id: 827...</p>
                        <p>[{new Date().toISOString()}] DB_ADAPTER: Query executed in 4.2ms (Product.find)</p>
                        <p>[{new Date().toISOString()}] CACHE_LAYER: Hit detected for canonical_route: /shop</p>
                        <p className="text-primary text-opacity-60">[{new Date().toISOString()}] SYSTEM: Recalibrating background tasks...</p>
                        <p>[{new Date().toISOString()}] SECURITY: Potential brute force suppressed at /api/auth/register (IP: 192.168.1.1)</p>
                        <p>[{new Date().toISOString()}] API_GATEWAY: Response 200 delivered for /api/analytics</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
