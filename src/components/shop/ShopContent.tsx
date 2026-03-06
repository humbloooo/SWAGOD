"use client";

import React, { memo, useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];
const AVAILABLE_CATEGORIES = ["male", "female", "merch"];
const AVAILABLE_SUBCATEGORIES = ["accessories", "shirts", "jerseys", "hoodies", "hats", "other"];

interface ProductCardProps {
    product: Product;
    currency: string;
    isSmall?: boolean;
}

const ProductCard = memo(({ product, currency, isSmall = false }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative"
        >
            <Link href={`/product/${product.id}`} className="block">
                <div className={cn(
                    "relative aspect-[4/5] overflow-hidden bg-foreground/5 border border-foreground/10 transition-all duration-700 group-hover:border-primary/50",
                    isSmall ? "aspect-[3/4]" : ""
                )}>
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.title ?? "Product Image"}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-[10px] font-mono font-black text-primary tracking-widest mb-1">VIEW_DETAILS</p>
                    </div>
                    {product.isPromo && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary text-black font-mono text-[10px] font-black uppercase tracking-widest skew-x-[-12deg]">
                                PROMO {"//"} DROP
                            </span>
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors truncate pr-4">{product.title}</h3>
                        <p className="font-mono text-sm font-black">{formatPrice(product.price, currency as "ZAR" | "USD")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/40 uppercase tracking-widest italic">
                        <span>{product.category}</span>
                        <span>{"//"}</span>
                        <span>{product.subCategory}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});

ProductCard.displayName = "ProductCard";

export default function ShopContent({ products, currency }: { products: Product[], currency: "ZAR" | "USD" }) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            try {
                const stored = localStorage.getItem('recentlyViewed');
                if (stored) setRecentlyViewed(JSON.parse(stored));
            } catch (error) {
                console.error("Error reading recently viewed", error);
            }
        }, 0);
        return () => clearTimeout(timer);
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
                SHOP {"//"} <span className="text-primary">ALL ITEMS</span>
            </h1>

            <div className="mb-12 space-y-8">
                {/* Premium Organized Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 border border-foreground/10 bg-foreground/5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Category Column */}
                    <div className="space-y-4">
                        <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] font-black italic">SEGMENT_ID</p>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                    className={cn(
                                        "px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all border",
                                        selectedCategory === cat
                                            ? "bg-primary text-black border-primary font-black shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.3)]"
                                            : "border-foreground/10 hover:border-primary/50 text-foreground/60"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subcategory Column */}
                    <div className="space-y-4 border-l border-foreground/5 md:pl-8">
                        <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] font-black italic">CLASSIFICATION</p>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SUBCATEGORIES.map((sub) => (
                                <button
                                    key={sub}
                                    onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub)}
                                    className={cn(
                                        "px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all border",
                                        selectedSubCategory === sub
                                            ? "bg-primary text-black border-primary font-black shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.3)]"
                                            : "border-foreground/10 hover:border-primary/50 text-foreground/60"
                                    )}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Column */}
                    <div className="space-y-4 border-l border-foreground/5 md:pl-8">
                        <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] font-black italic">MEASUREMENT</p>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center font-mono text-[10px] transition-all border",
                                        selectedSize === size
                                            ? "bg-primary text-black border-primary font-black shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.3)]"
                                            : "border-foreground/10 hover:border-primary/50 text-foreground/60"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-primary/60 border-b border-foreground/10 pb-4">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            ACTIVE_INVENTORY: {filteredProducts.length}
                        </span>
                        {(selectedCategory || selectedSubCategory || selectedSize) && (
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedSubCategory(null);
                                    setSelectedSize(null);
                                }}
                                className="text-foreground/40 hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                            >
                                RESET_FILTERS
                            </button>
                        )}
                    </div>
                    <div className="hidden md:block italic">
                        REGION_DETECTED: {currency === "ZAR" ? "SOUTH_AFRICA_ZA" : "UNITED_STATES_US"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} currency={currency} />
                ))}
            </div>

            <AnimatePresence>
                {mounted && recentlyViewed.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-32 pt-12 border-t border-foreground/10"
                    >
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 italic">RECENTLY {"//"} <span className="text-primary">VIEWED</span></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recentlyViewed.map((product) => (
                                <ProductCard key={`recent-${product.id}`} product={product} currency={currency} isSmall />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Navigation />
        </div>
    );
}
