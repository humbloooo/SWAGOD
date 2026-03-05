"use client";

import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Link from "next/link";
import Image from "next/image";
import { useCachedProducts } from "@/lib/hooks/useCachedProducts";
import React, { memo, useState } from "react";
import { Product } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { useEffect } from "react";
import { motion } from "framer-motion";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];
const AVAILABLE_CATEGORIES = ["male", "female", "merch"];
const AVAILABLE_SUBCATEGORIES = ["accessories", "shirts", "jerseys", "hoodies", "hats", "other"];

export default function Shop() {
    const products = useCachedProducts();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const { currency, lastFetch } = useAppStore();
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
    const isLoading = products.length === 0 && !lastFetch;

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        try {
            const stored = localStorage.getItem('recentlyViewed');
            if (stored) {
                setTimeout(() => setRecentlyViewed(JSON.parse(stored)), 0);
            }
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
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-[12vw] md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
                    Shop // <span className="text-primary">All</span>
                </h1>

                {/* Category Filters */}
                <div className="mb-8">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-3">COLLECTION / CATEGORY</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-2 border font-mono text-sm uppercase transition-colors ${!selectedCategory ? 'bg-primary border-primary text-black font-bold glow-primary' : 'border-foreground/20 text-foreground dark:border-white/20 dark:text-white hover:border-primary hover:text-primary'}`}
                        >
                            ALL
                        </button>
                        {AVAILABLE_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 border font-mono text-sm uppercase transition-colors ${selectedCategory === cat ? 'bg-primary border-primary text-black font-bold glow-primary' : 'border-foreground/20 text-foreground dark:border-white/20 dark:text-white hover:border-primary hover:text-primary'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SubCategory Filters (Only show if not merch, or show always) */}
                <div className="mb-8">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-3">TYPE / SUBCATEGORY</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedSubCategory(null)}
                            className={`px-6 py-2 border font-mono text-xs uppercase transition-colors ${!selectedSubCategory ? 'bg-primary border-primary text-black font-bold glow-primary' : 'border-foreground/20 text-foreground hover:border-primary hover:text-primary bg-foreground/5'}`}
                        >
                            ALL TYPES
                        </button>
                        {AVAILABLE_SUBCATEGORIES.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`px-6 py-2 border font-mono text-xs uppercase transition-colors ${selectedSubCategory === sub ? 'bg-primary border-primary text-black font-bold glow-primary' : 'border-foreground/20 text-foreground hover:border-primary hover:text-primary bg-foreground/5'}`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Filters */}
                <div className="mb-12">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-3">AVAILABLE SIZES</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedSize(null)}
                            className={`px-6 py-2 border font-mono text-sm uppercase transition-colors ${!selectedSize ? 'bg-white border-white text-black font-bold' : 'border-foreground/20 text-foreground dark:border-white/20 dark:text-white hover:border-white hover:text-white'}`}
                        >
                            ANY SIZE
                        </button>
                        {AVAILABLE_SIZES.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-6 py-2 border font-mono text-sm uppercase transition-colors ${selectedSize === size ? 'bg-white border-white text-black font-bold' : 'border-foreground/20 text-foreground dark:border-white/20 dark:text-white hover:border-white hover:text-white'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-4 md:gap-8 mb-24">
                    {isLoading ? (
                        [...Array(12)].map((_, i) => (
                            <div key={i} className={`bg-foreground/5 dark:bg-white/5 animate-pulse border border-foreground/10 dark:border-white/10 ${i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[3/4]"
                                }`} />
                        ))
                    ) : (
                        <>
                            {filteredProducts.map((product, idx) => (
                                <ShopProductCard
                                    key={product.id!}
                                    product={product}
                                    currency={currency}
                                    className={idx % 5 === 0 ? "col-span-2 row-span-2" : ""}
                                />
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-24 text-center border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/5 backdrop-blur-sm">
                                    <span className="text-4xl block mb-4">🦇</span>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-foreground/50 dark:text-white/50">NO INVENTORY FOUND</h3>
                                    <p className="font-mono text-xs text-foreground/30 dark:text-white/30 tracking-widest mt-2 uppercase">Try adjusting your filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {mounted && recentlyViewed.length > 0 && (
                    <div className="border-t border-foreground/10 dark:border-white/10 pt-24 mb-24">
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-12">
                            RECENTLY <span className="text-primary">VIEWED</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {recentlyViewed.map(product => (
                                <ShopProductCard key={`recent-${product.id!}`} product={product} currency={currency} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Navigation />
        </main>
    );
}

const ShopProductCard = memo(function ShopProductCard({
    product,
    currency,
    className = ""
}: {
    product: Product,
    currency: "ZAR" | "USD",
    className?: string
}) {
    return (
        <Link
            href={`/product/${product.id!}`}
            prefetch={true}
            className={cn("group block overflow-hidden", className)}
            onClick={() => { if (window.navigator.vibrate) window.navigator.vibrate(5); }}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    (e.currentTarget as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    (e.currentTarget as HTMLElement).style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
                }}
                className="relative aspect-[3/4] border border-foreground/10 bg-foreground/5 mb-4 overflow-hidden group-hover:border-primary transition-[border-color,transform] duration-200 ease-out preserve-3d"
            >
                <Image
                    src={product.image ? (product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `/${product.image}`) : "/assets/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                {product.images && product.images.length > 1 && (
                    <Image
                        src={product.images[1].startsWith('http') || product.images[1].startsWith('/') ? product.images[1] : `/${product.images[1]}`}
                        alt={`${product.title} alternate`}
                        fill
                        className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                )}

                {product.category === 'merch' && (
                    <div className="absolute top-2 left-2 bg-primary text-black px-2 py-1 text-[8px] font-black tracking-widest uppercase">
                        MERCH
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-2 py-1 text-[8px] font-mono tracking-widest hidden group-hover:block uppercase">
                    {product.likes?.length || 0} SAVED
                </div>
            </motion.div>
            <h3 className="font-bold uppercase text-lg text-foreground group-hover:text-primary transition-colors">{product.title}</h3>
            <p className="font-mono text-sm text-foreground/60">{formatPrice(product.price, currency)}</p>
        </Link>
    );
});
