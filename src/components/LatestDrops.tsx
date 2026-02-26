"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import LikeButton from "./LikeButton";

interface LatestDropsProps {
    products: Product[];
}

export default function LatestDrops({ products }: LatestDropsProps) {
    const addItem = useAppStore((state) => state.addItem);
    const sortedProducts = [...products].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return (
        <section id="latest-drops" className="py-24 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.05),transparent)] pointer-events-none"></div>

            <div className="container mx-auto px-6 mb-16 flex items-end justify-between relative z-10">
                <header>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4">
                        NEW <span className="text-primary italic">RELEASES</span>
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 italic">// CURRENT INVENTORY ARCHIVE</p>
                </header>
                <div className="hidden md:flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">COLLECTION STATUS: ACTIVE</span>
                    <div className="w-24 h-[1px] bg-primary/30 shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                </div>
            </div>

            {/* CLOTHING SECTION */}
            <div className="container mx-auto px-6 mb-20 relative z-10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-primary glow-primary"></span> CLOTHING
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedProducts.filter(p => (p.category || "").toLowerCase() === 'clothing').slice(0, 4).length > 0 ? (
                        sortedProducts.filter(p => (p.category || "").toLowerCase() === 'clothing').slice(0, 4).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} addItem={addItem} />
                        ))
                    ) : (
                        <div className="col-span-full py-24 border border-white/5 bg-white/[0.02] flex items-center justify-center">
                            <p className="font-mono text-white/20 uppercase italic tracking-widest text-sm">NO ITEMS FOUND IN THIS CATEGORY</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MERCH/ACCESSORIES SECTION */}
            <div className="container mx-auto px-6 relative z-10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-primary"></span> ACCESSORIES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedProducts.filter(p => {
                        const cat = (p.category || "").toLowerCase();
                        return cat === 'accessories' || cat === 'merch';
                    }).slice(0, 4).length > 0 ? (
                        sortedProducts.filter(p => {
                            const cat = (p.category || "").toLowerCase();
                            return cat === 'accessories' || cat === 'merch';
                        }).slice(0, 4).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} addItem={addItem} />
                        ))
                    ) : (
                        <div className="col-span-full py-24 border border-white/5 bg-white/[0.02] flex items-center justify-center">
                            <p className="font-mono text-white/20 uppercase italic tracking-widest text-sm">NO ITEMS FOUND IN THIS CATEGORY</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center mt-32 relative z-10 px-6">
                <Link href="/shop" className="w-full md:w-auto text-center px-16 py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-primary transition-all duration-500 group">
                    SHOP ALL PRODUCTS <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                </Link>
            </div>
        </section>
    );
}

function ProductCard({ product, index, addItem }: { product: Product, index: number, addItem: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            className="group relative aspect-[3/4] brutalist-card overflow-hidden hover:border-primary transition-all duration-500"
        >
            <Link href={`/product/${product.id}`} className="block relative w-full h-full">
                <Image
                    src={product.image || "/assets/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                />

                {/* Advanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 z-30">
                    <LikeButton productId={product.id} initialLikes={product.likedBy} />
                </div>
            </Link>

            {/* Quick Add Actions */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="space-y-1 backdrop-blur-lg bg-black/60 p-4 border border-white/10 glow-primary">
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black uppercase tracking-tight line-clamp-1">{product.title}</h4>
                        <span className="text-[8px] font-mono text-white/40">{product.likedBy?.length || 0} SAVED</span>
                    </div>
                    <p className="font-mono text-[10px] text-primary">R {product.price.toFixed(2)}</p>
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
                        });
                    }}
                    className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 glow-primary"
                >
                    <ShoppingBag size={14} /> ADD TO CART
                </button>
            </div>

            {/* Product ID Indicator */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 uppercase tracking-widest vertical-text group-hover:text-primary transition-colors">
                ITEM_{product.id.substring(0, 8)}
            </div>
        </motion.div>
    );
}
