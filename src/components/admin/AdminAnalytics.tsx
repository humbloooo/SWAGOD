"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

export default function AdminAnalytics() {
    // Mock data for visualization
    const stats = [
        { label: "TOTAL REVENUE", value: "R 124,500", icon: DollarSign, trend: "+12.5%", color: "text-green-500" },
        { label: "ACTIVE SESSIONS", value: "1,240", icon: Users, trend: "+5.2%", color: "text-blue-500" },
        { label: "ORDERS", value: "842", icon: ShoppingCart, trend: "+18.3%", color: "text-primary" },
        { label: "CONVERSION RATE", value: "3.2%", icon: TrendingUp, trend: "+0.8%", color: "text-orange-500" },
    ];

    const chartData = [40, 70, 45, 90, 65, 80, 95];

    return (
        <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 backdrop-blur-md"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <stat.icon size={20} className="text-white/40" />
                            <span className={`text-[10px] font-mono font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-2xl font-black">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 border border-white/10 p-10 backdrop-blur-md relative overflow-hidden"
            >
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h3 className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-1">NETWORK_TRAFFIC</h3>
                        <p className="text-3xl font-black uppercase">PERFORMANCE_NODE</p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-white/40 uppercase tracking-widest">
                        LAST 7 DAYS
                    </div>
                </div>

                <div className="flex items-end justify-between h-48 gap-4">
                    {chartData.map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: 0.7 + (i * 0.1), duration: 1, ease: "easeOut" }}
                                className="w-full bg-primary/20 border-t-2 border-primary relative group cursor-crosshair"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-black text-[10px] font-black px-2 py-1">
                                    {height}%
                                </div>
                            </motion.div>
                            <span className="font-mono text-[10px] text-white/20">D0{i + 1}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
