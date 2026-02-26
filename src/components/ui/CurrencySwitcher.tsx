"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export default function CurrencySwitcher() {
    const [currency, setCurrency] = useState("ZAR");

    const currencies = [
        { code: "ZAR", symbol: "R", label: "SOUTH AFRICA" },
        { code: "USD", symbol: "$", label: "UNITED STATES" },
        { code: "EUR", symbol: "€", label: "EUROPE" },
        { code: "GBP", symbol: "£", label: "UNITED KINGDOM" },
    ];

    return (
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-widest uppercase">
            <div className="flex items-center gap-2 text-white/40">
                <Globe size={12} />
                <span>REGION // {currencies.find(c => c.code === currency)?.label}</span>
            </div>
            <div className="flex gap-2">
                {currencies.map((c) => (
                    <button
                        key={c.code}
                        onClick={() => {
                            setCurrency(c.code);
                            // In a real app, this would update a global state/context
                        }}
                        className={`transition-colors ${currency === c.code ? 'text-primary font-bold' : 'text-white/20 hover:text-white'}`}
                    >
                        {c.code}
                    </button>
                ))}
            </div>
        </div>
    );
}
