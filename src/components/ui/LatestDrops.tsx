"use client";
import React, { memo } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import LikeButton from "./LikeButton";
import { formatPrice } from "@/lib/utils";

interface LatestDropsProps {
    products: Product[];
    featuredCategory?: string;
    latestDropsLimit?: number;
}

export default function LatestDrops({ products, featuredCategory, latestDropsLimit }: LatestDropsProps) {
    const { addItem, openCart, currency } = useAppStore();

    const sortedProducts = React.useMemo(() => {
        return [...products].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }, [products]);

    const apparelProducts = React.useMemo(() => {
        return sortedProducts.filter(p => {
            const isApparel = ['male', 'female'].includes((p.category || "").toLowerCase());
            if (!featuredCategory || featuredCategory === 'all') return isApparel;
            return isApparel && (p.category?.toLowerCase() === featuredCategory.toLowerCase() || p.subCategory?.toLowerCase() === featuredCategory.toLowerCase());
        }).slice(0, latestDropsLimit || 8);
    }, [sortedProducts, featuredCategory, latestDropsLimit]);

    const merchProducts = React.useMemo(() => {
        return sortedProducts.filter(p => {
            const cat = (p.category || "").toLowerCase();
            return cat === 'merch';
        }).slice(0, latestDropsLimit || 8);
    }, [sortedProducts, latestDropsLimit]);

    return (
        <section id="latest-drops" className="py-24 bg-background text-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.05),transparent)] pointer-events-none"></div>

            <div className="container mx-auto px-6 mb-16 flex items-end justify-between relative z-10">
                <header>
                    <h2 className="text-[12vw] md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
                        NEW <span className="text-primary italic">RELEASES</span>
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/70 dark:text-foreground/40 italic">{"//"} CURRENT INVENTORY GALLERY</p>
                </header>
                <div className="hidden md:flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest">COLLECTION STATUS: ACTIVE</span>
                    <div className="w-24 h-[1px] bg-primary/30 shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                </div>
            </div>

            {/* CLOTHING SECTION */}
            <div className="container mx-auto px-6 mb-20 relative z-10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-primary glow-primary"></span> {featuredCategory && featuredCategory !== 'all' ? featuredCategory : 'ALL APPAREL'}
                </h3>
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {apparelProducts.length > 0 ? (
                        apparelProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} addItem={addItem} openCart={openCart} currency={currency} className="min-w-[75vw] md:min-w-[25vw] snap-center shrink-0" />
                        ))
                    ) : products.length === 0 ? (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-foreground/5 animate-pulse border border-foreground/10 brutalist-card" />
                            ))}
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-12 border border-foreground/10 bg-foreground/5 backdrop-blur-sm">
                            <span className="text-4xl block mb-4">🦇</span>
                            <h3 className="text-xl font-black uppercase tracking-widest text-foreground/80 dark:text-foreground/50">NO ACTIVE INVENTORY</h3>
                            <p className="font-mono text-xs text-foreground/60 dark:text-foreground/30 tracking-widest mt-2 uppercase text-center max-w-sm">No items matching &quot;{featuredCategory || 'ALL APPAREL'}&quot; are currently scheduled for release.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MERCH SECTION */}
            <div className="container mx-auto px-6 relative z-10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-primary"></span> MERCH EXCLUSIVES
                </h3>
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {merchProducts.length > 0 ? (
                        merchProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} addItem={addItem} openCart={openCart} currency={currency} className="min-w-[75vw] md:min-w-[25vw] snap-center shrink-0" />
                        ))
                    ) : products.length === 0 ? (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-foreground/5 animate-pulse border border-foreground/10 brutalist-card" />
                            ))}
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-12 border border-foreground/10 bg-foreground/5 backdrop-blur-sm">
                            <span className="text-4xl block mb-4">🦇</span>
                            <h3 className="text-xl font-black uppercase tracking-widest text-foreground/80 dark:text-foreground/50">NO MERCHANDISE</h3>
                            <p className="font-mono text-xs text-foreground/60 dark:text-foreground/30 tracking-widest mt-2 uppercase text-center max-w-sm">Check back later for new exclusive drops.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center mt-32 relative z-10 px-6">
                <Link href="/shop" className="w-full md:w-auto text-center px-16 py-6 bg-foreground text-background font-black uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-white transition-all duration-500 group border border-foreground/10">
                    SHOP ALL PRODUCTS <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                </Link>
            </div>
        </section>
    );
}

const ProductCard = memo(function ProductCard({ product, index, addItem, openCart, currency, className }: { product: Product, index: number, addItem: (p: Product, s?: string) => void, openCart: () => void, currency: "ZAR" | "USD", className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            className={`group relative aspect-[3/4] brutalist-card overflow-hidden hover:border-primary transition-all duration-500 border border-foreground/5 ${className || ''}`}
        >
            <Link href={`/product/${product.id!}`} prefetch={true} className="block relative w-full h-full">
                <Image
                    src={product.image || "/assets/placeholder.png"}
                    alt={product.title}
                    fill
                    className={`object-cover md:grayscale group-hover:grayscale-0 transition-all duration-500 ease-out ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                    suppressHydrationWarning
                />

                {product.images && product.images.length > 1 && (
                    <Image
                        src={product.images[1]}
                        alt={`${product.title} alternate`}
                        fill
                        className="object-cover absolute inset-0 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
                        suppressHydrationWarning
                    />
                )}

                {/* Advanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 z-30">
                    <LikeButton productId={product.id!} initialLikes={product.likes} />
                </div>
            </Link>

            {/* Active Inventory / Scarcity Indicator */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-30 transition-opacity">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                </div>
                {product.id && product.id.charCodeAt(0) % 2 === 0 && ( /* Pseudo-random low stock for demonstration */
                    <div className="bg-primary/90 text-white font-mono text-[8px] px-2 py-1 uppercase tracking-widest animate-pulse border border-foreground/20 whitespace-nowrap glow-primary shadow-[0_0_15px_rgba(255,0,0,0.8)] backdrop-blur-md">
                        ONLY 2 LEFT
                    </div>
                )}
            </div>

            {/* Quick Add Actions */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="space-y-1 backdrop-blur-lg bg-background/60 p-4 border border-foreground/10 glow-primary text-foreground">
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black uppercase tracking-tight line-clamp-1">{product.title}</h4>
                        <span className="text-[8px] font-mono text-foreground/40">{product.likes?.length || 0} SAVED</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-mono text-[10px] text-primary font-bold">{formatPrice(product.price, currency)}</p>
                        <p className="font-mono text-[10px] text-foreground/40 line-through">{formatPrice(product.price * 1.3, currency)}</p>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const sizeToAdd = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
                        addItem(product, sizeToAdd);
                        toast.success(`PRODUCT ADDED`, {
                            description: `${product.title} IS IN YOUR CART.`,
                            className: "font-mono font-bold uppercase",
                            action: {
                                label: "VIEW CART",
                                onClick: () => openCart(),
                            },
                        });
                    }}
                    className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2 glow-primary"
                    suppressHydrationWarning
                >
                    <ShoppingBag size={14} suppressHydrationWarning /> ADD TO CART
                </button>
            </div>

            {/* Product ID Indicator Removed */}
        </motion.div>
    );
});
