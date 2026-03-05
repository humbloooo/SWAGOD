"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteSettings } from "@/lib/types";
import { toast } from "sonner";
import { Truck, RefreshCcw, MessageSquare, Twitter, Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const year = new Date().getFullYear();

    return (
        <footer>
            {/* TOP SECTION - Shipping, Returns, Support */}
            <div className="bg-foreground/5 text-foreground py-16 border-t border-foreground/10">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {/* SHIPPING */}
                    <div className="flex flex-col items-center">
                        <Truck size={28} className="mb-6 stroke-[1.5]" />
                        <h4 className="font-bold uppercase mb-4 text-xs tracking-[0.2em]">SHIPPING</h4>
                        <p className="text-sm text-foreground/70 mb-2 font-mono">Delivery 2-5 business days</p>
                        <p className="text-sm text-foreground/70 font-mono">R90 / Free over R900</p>
                    </div>
                    {/* RETURNS */}
                    <div className="flex flex-col items-center">
                        <RefreshCcw size={28} className="mb-6 stroke-[1.5]" />
                        <h4 className="font-bold uppercase mb-4 text-xs tracking-[0.2em]">RETURNS</h4>
                        <p className="text-sm text-foreground/70 mb-4 font-mono">Return online orders in-store or online.</p>
                        <Link href="/faq" className="text-sm text-foreground/70 mb-4 hover:underline hover:text-primary transition-colors font-mono">FAQ's</Link>
                        <Link href="/support/return" className="text-sm text-foreground hover:text-primary transition-colors border-b border-foreground hover:border-primary font-mono pb-1">Log a Return</Link>
                    </div>
                    {/* SUPPORT */}
                    <div className="flex flex-col items-center">
                        <MessageSquare size={28} className="mb-6 stroke-[1.5]" />
                        <h4 className="font-bold uppercase mb-4 text-xs tracking-[0.2em]">SUPPORT</h4>
                        <p className="text-sm text-foreground/70 mb-4 font-mono">We uphold the Consumer Goods and Services Code.</p>
                        <Link href="/faq" className="text-sm text-foreground/70 mb-4 hover:underline hover:text-primary transition-colors font-mono">FAQs</Link>
                        <p className="text-sm text-foreground/70 font-mono uppercase">CGSO PARTICIPANT</p>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION - Dark Nav */}
            <div className="bg-[#111] text-white py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                        {/* QUICKLINKS */}
                        <div>
                            <h4 className="font-bold uppercase mb-8 text-[11px] tracking-[0.2em] text-white">QUICKLINKS</h4>
                            <ul className="space-y-4 font-mono text-[13px] text-white/60">
                                <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                                <li><Link href="/support/order" className="hover:text-white transition-colors">How to place an order</Link></li>
                                <li><Link href="/support/track" className="hover:text-white transition-colors">Track my Order</Link></li>
                                <li><Link href="/support/return" className="hover:text-white transition-colors">Log a Return</Link></li>
                                <li><Link href="/support/policy" className="hover:text-white transition-colors">Returns Policy</Link></li>
                                <li><Link href="/support/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
                            </ul>
                        </div>

                        {/* SWAGOD COMPANY */}
                        <div>
                            <h4 className="font-bold uppercase mb-8 text-[11px] tracking-[0.2em] text-white">SWAGOD COMPANY</h4>
                            <ul className="space-y-4 font-mono text-[13px] text-white/60">
                                <li><Link href="/careers" className="hover:text-white transition-colors">Careers & Opportunities</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Reach out</Link></li>
                                <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                            </ul>
                        </div>

                        {/* SWAGOD BRAND */}
                        <div>
                            <h4 className="font-bold uppercase mb-8 text-[11px] tracking-[0.2em] text-white">SWAGOD</h4>
                            <p className="text-white font-mono text-[13px] mb-6">
                                {settings?.heroSlogan || "Smart. African. Ambitious."}
                            </p>
                            <p className="text-white/60 font-mono text-[13px] mb-8 leading-relaxed pr-4">
                                {settings?.footerAboutText || "We're a local streetwear brand, born in SA, inspired by Hip-Hop and local streetwear."}
                            </p>
                            <Link href="/about" className="text-white/60 hover:text-white transition-colors border-b border-white/60 hover:border-white font-mono text-[13px] pb-1">
                                Our Story
                            </Link>
                        </div>

                        {/* JOIN THE FAM */}
                        <div>
                            <h4 className="font-bold uppercase mb-8 text-[11px] tracking-[0.2em] text-white">JOIN THE SWAGOD FAM</h4>
                            <p className="text-white/60 font-mono text-[13px] mb-6">Events | Collabs | Promos</p>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!newsletterEmail) return;
                                    setIsSubmitting(true);
                                    try {
                                        const res = await fetch("/api/newsletter", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ email: newsletterEmail })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            toast.success(data.message);
                                            setNewsletterEmail("");
                                        } else {
                                            toast.error(data.message);
                                        }
                                    } catch {
                                        toast.error("SYSTEM ERROR");
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                            >
                                <div className="flex items-center mb-6 border border-white/20 hover:border-white/40 transition-colors bg-transparent">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="E-mail"
                                        className="bg-transparent border-none px-4 py-3 font-mono text-[13px] w-full focus:outline-none text-white !cursor-text"
                                        suppressHydrationWarning
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="pe-4 text-white hover:text-primary transition-colors disabled:opacity-50"
                                        aria-label="Subscribe"
                                    >
                                        <Mail size={18} />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-white text-black font-bold tracking-[0.2em] text-[11px] uppercase hover:bg-gray-200 transition-colors w-[150px]"
                                >
                                    {isSubmitting ? "..." : "SUBSCRIBE"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* BOTTOM SIGNATURE ROW */}
                    <div className="flex flex-col gap-8 text-[11px] font-mono text-white/40">
                        <div className="flex gap-6">
                            <a href={settings?.socials?.twitter || "#"} className="hover:text-white transition-colors" aria-label="Facebook">
                                <Facebook size={18} className="stroke-[1.5]" />
                            </a>
                            <a href={settings?.socials?.twitter || "#"} className="hover:text-white transition-colors" aria-label="X (Twitter)">
                                <Twitter size={18} className="stroke-[1.5]" />
                            </a>
                            <a href={settings?.socials?.instagram || "#"} className="hover:text-white transition-colors" aria-label="Instagram">
                                <Instagram size={18} className="stroke-[1.5]" />
                            </a>
                        </div>
                        <p>{(mounted && settings?.footerText) || `© ${year} - SWAGOD`}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
