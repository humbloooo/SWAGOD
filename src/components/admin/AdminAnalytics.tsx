"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingCart } from "lucide-react";

import { useEffect, useState } from "react";

interface AnalyticsData {
    todayVisits: number;
    monthlyVisits: number;
    totalProducts: number;
    chartData: number[];
}

export default function AdminAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        fetch('/api/analytics')
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error(err));
    }, []);

    // Provide default fallback while loading or on error
    const d = data || { todayVisits: 0, monthlyVisits: 0, totalProducts: 0, chartData: [0, 0, 0, 0, 0, 0, 0] };

    const stats = [
        { label: "PRODUCTS", value: d.totalProducts.toString(), icon: ShoppingCart, trend: "LIVE", color: "text-green-500" },
        { label: "TODAY VISITS", value: d.todayVisits.toString(), icon: Users, trend: "LIVE", color: "text-blue-500" },
        { label: "MONTH VISITS", value: d.monthlyVisits.toString(), icon: Users, trend: "LIVE", color: "text-primary" },
        { label: "CONVERSION", value: "TBA", icon: TrendingUp, trend: "N/A", color: "text-orange-500" },
    ];

    const chartData = d.chartData;

    return (
        <section className="mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-foreground/5 border border-foreground/10 p-4 md:p-6 backdrop-blur-md"
                    >
                        <div className="flex justify-between items-start mb-2 md:mb-4">
                            <div suppressHydrationWarning>
                                <stat.icon size={16} className="text-foreground/40 md:w-5 md:h-5" suppressHydrationWarning />
                            </div>
                            <span className={`text-[8px] md:text-[10px] font-mono font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-xl md:text-2xl font-black">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md relative overflow-hidden"
            >
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h3 className="text-foreground/40 font-mono text-[10px] uppercase tracking-widest mb-1">LIVE FEEDBACK</h3>
                        <p className="text-3xl font-black uppercase">PERFORMANCE</p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                        LAST 7 DAYS
                    </div>
                </div>

                <div className="flex items-end justify-between h-48 gap-4">
                    {chartData.map((count: number, i: number) => {
                        const maxVal = Math.max(...chartData, 1);
                        const percentage = (count / maxVal) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ delay: 0.7 + (i * 0.1), duration: 1, ease: "easeOut" }}
                                    className="w-full bg-primary/20 border-t-2 border-primary relative group cursor-crosshair"
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-black text-[10px] font-black px-2 py-1 whitespace-nowrap shadow-lg z-10">
                                        {count} VISITS
                                    </div>
                                </motion.div>
                                <span className="font-mono text-[10px] text-foreground/20">D0{i + 1}</span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
