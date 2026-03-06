"use client";

import React, { memo, useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];
const AVAILABLE_CATEGORIES = ["male", "female", "merch"];
const AVAILABLE_SUBCATEGORIES = ["accessories", "shirts", "jerseys", "hoodies", "hats", "other"];

export default function ShopContent({ products, currency }: { products: Product[], currency: "ZAR" | "USD" }) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    useEffect(() => {
        setMounted(true);
        try {
            const stored = localStorage.getItem('recentlyViewed');
            if (stored) setRecentlyViewed(JSON.parse(stored));
        } catch (error) {
            console.error("Error reading recently viewed", error);
        }
    }, []);

    const filteredProducts = products.filter(product => {
        if (selectedSize && (!product.sizes || !product.sizes.includes(selectedSize))) return false;
        if (selectedCategory && product.category !== selectedCategory) return false;
        if (selectedSubCategory && product.subCategory !== selectedSubCategory) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-6">
            <h1 className="text-[12vw] md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
                SHOP // <span className="text-primary">ALL ITEMS</span>
            </h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-y border-foreground/10 py-10">
                <div className="space-y-4">
                    <h3 className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">01 // SEGMENT</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-4 py-1.5 border font-mono text-[10px] uppercase transition-all duration-300",
                                !selectedCategory ? 'bg-primary border-primary text-black font-black glow-primary px-6' : 'border-foreground/10 bg-foreground/5 hover:border-primary/50'
                            )}
                        >
                            ALL
                        </button>
                        {AVAILABLE_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-1.5 border font-mono text-[10px] uppercase transition-all duration-300",
                                    selectedCategory === cat ? 'bg-primary border-primary text-black font-black glow-primary px-6' : 'border-foreground/10 bg-foreground/5 hover:border-primary/50'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">02 // CLASSIFICATION</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedSubCategory(null)}
                            className={cn(
                                "px-4 py-1.5 border font-mono text-[10px] uppercase transition-all duration-300",
                                !selectedSubCategory ? 'bg-primary border-primary text-black font-black glow-primary px-6' : 'border-foreground/10 bg-foreground/5 hover:border-primary/50'
                            )}
                        >
                            ALL TYPES
                        </button>
                        {AVAILABLE_SUBCATEGORIES.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={cn(
                                    "px-4 py-1.5 border font-mono text-[10px] uppercase transition-all duration-300",
                                    selectedSubCategory === sub ? 'bg-primary border-primary text-black font-black glow-primary px-6' : 'border-foreground/10 bg-foreground/5 hover:border-primary/50'
                                )}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">03 // MEASUREMENT</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedSize(null)}
                            className={cn(
                                "px-4 py-1.5 border font-mono text-[10px] uppercase transition-all duration-300",
                                !selectedSize ? 'bg-foreground border-foreground text-background font-black px-6' : 'border-foreground/10 bg-foreground/5 hover:border-foreground/40'
                            )}
                        >
                            ANY
                        </button>
                        {AVAILABLE_SIZES.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "px-4 py-1.5 border font-mono text-[10px] uppercase transition-all duration-300",
                                    selectedSize === size ? 'bg-foreground border-foreground text-background font-black px-6' : 'border-foreground/10 bg-foreground/5 hover:border-foreground/40'
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
                {filteredProducts.map((product) => (
                    <ShopProductCard key={product.id!} product={product} currency={currency} />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-24 text-center border border-foreground/10 bg-foreground/5">
                        <span className="text-4xl block mb-4">🦇</span>
                        <h3 className="text-xl font-black uppercase tracking-widest text-foreground/50">NO INVENTORY FOUND</h3>
                        <p className="font-mono text-xs text-foreground/30 tracking-widest mt-2 uppercase">Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            {mounted && recentlyViewed.length > 0 && (
                <div className="border-t border-foreground/10 pt-24 mb-24">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-12">RECENTLY <span className="text-primary">VIEWED</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {recentlyViewed.map(product => (
                            <ShopProductCard key={`recent-${product.id!}`} product={product} currency={currency} />
                        ))}
                    </div>
                </div>
            )}
            <Navigation />
        </div>
    );
}

const ShopProductCard = memo(function ShopProductCard({ product, currency, className = "" }: { product: Product, currency: "ZAR" | "USD", className?: string }) {
    return (
        <Link href={`/product/${product.id!}`} className={cn("group block overflow-hidden", className)}>
            <motion.div whileHover={{ scale: 1.02 }} className="relative aspect-[3/4] border border-foreground/10 bg-foreground/5 mb-4 overflow-hidden group-hover:border-primary transition-all duration-200">
                <Image src={product.image ? (product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `/${product.image}`) : "/assets/placeholder.png"} alt={product.title} fill className="object-cover transition-opacity duration-500 group-hover:opacity-0" />
                {product.images?.[1] && <Image src={product.images[1].startsWith('http') || product.images[1].startsWith('/') ? product.images[1] : `/${product.images[1]}`} alt={product.title} fill className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105" />}
                {product.category === 'merch' && <div className="absolute top-2 left-2 bg-primary text-black px-2 py-1 text-[8px] font-black tracking-widest uppercase">MERCH</div>}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-2 py-1 text-[8px] font-mono tracking-widest hidden group-hover:block uppercase">{product.likes?.length || 0} SAVED</div>
            </motion.div>
            <h3 className="font-bold uppercase text-lg text-foreground group-hover:text-primary transition-colors">{product.title}</h3>
            <p className="font-mono text-sm text-foreground/60">{formatPrice(product.price, currency)}</p>
        </Link>
    );
});
