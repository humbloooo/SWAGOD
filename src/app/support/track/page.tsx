"use client";

import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { Search } from "lucide-react";

export default function TrackOrderPage() {
    const [trackingInput, setTrackingInput] = useState("");

    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    TRACK <span className="text-primary">ORDER</span>
                </h1>
                <div className="space-y-6 text-foreground/80 font-mono text-sm uppercase tracking-widest leading-relaxed">
                    <p>ENTER YOUR ORDER NUMBER OR TRACKING ID BELOW TO VIEW THE CURRENT STATUS OF YOUR SHIPMENT.</p>

                    <div className="flex bg-foreground/5 border border-foreground/10 p-2 mt-8">
                        <input
                            type="text"
                            placeholder="ORDER # OR TRACKING ID"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="w-full bg-transparent border-none outline-none font-mono text-sm p-4 uppercase placeholder:text-foreground/30"
                        />
                        <button className="bg-primary text-background px-8 flex items-center justify-center font-black transition-all hover:bg-foreground hover:text-background">
                            <Search size={20} />
                        </button>
                    </div>

                    <div className="mt-12 p-8 border border-foreground/10 bg-foreground/5 relative overflow-hidden text-center opacity-50">
                        AWAITING INPUT_DATA...
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
