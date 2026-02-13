"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface LatestDropsProps {
    products: Product[];
}

export default function LatestDrops({ products }: LatestDropsProps) {
    const addItem = useCartStore((state) => state.addItem) as (product: any) => void;
    // Double check sorting here just in case
    const sortedProducts = [...products].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return (
        <section id="latest-drops" className="py-24 bg-background border-t border-gray-100">
            <div className="container mx-auto px-4 mb-16 flex items-end justify-between">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                    Latest Drops
                </h2>
                <span className="text-sm font-mono text-gray-400 hidden md:block">
          // SCROLL DOWN
                </span>
            </div>

            {/* CLOTHING SECTION */}
            <h3 className="text-2xl font-bold uppercase mb-8 px-4 border-l-4 border-primary ml-4">Clothing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 mb-16">
                {sortedProducts.filter(p => p.category === 'clothing').map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} addItem={addItem} />
                ))}
            </div>

            {/* MERCH/ACCESSORIES SECTION */}
            <h3 className="text-2xl font-bold uppercase mb-8 px-4 border-l-4 border-primary ml-4">Merch & Accessories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {sortedProducts.filter(p => p.category === 'accessories' || p.category === 'merch').map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} addItem={addItem} />
                ))}
            </div>

            <div className="flex justify-center mt-24">
                <Link href="/shop" className="px-12 py-4 border border-black hover:bg-black hover:text-white transition-colors uppercase font-bold tracking-widest text-sm">
                    View All Products
                </Link>
            </div>
        </section>
    );
}

function ProductCard({ product, index, addItem }: { product: Product, index: number, addItem: any }) {
    return (
        <motion.div
            className="group relative aspect-[3/4] border text-black hover:border-primary transition-colors duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/product/${product.id}`} className="block relative w-full h-full overflow-hidden bg-surface">
                <Image
                    src={product.image || "/assets/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            </Link>
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem(product);
                        toast.success(`ADDED ${product.title} TO CART`);
                    }}
                    className="p-3 bg-white text-black hover:bg-primary hover:text-white transition-colors rounded-full shadow-lg"
                    aria-label="Add to cart"
                >
                    <ShoppingBag size={18} />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10 flex flex-col gap-1 pointer-events-none">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-wider leading-none drop-shadow-md">{product.title}</h3>
                        <p className="font-mono text-sm opacity-90 drop-shadow-md">R {product.price.toFixed(2)}</p>
                    </div>
                    <Link href={`/product/${product.id}`} className="pointer-events-auto text-xs font-mono border-b border-white group-hover:border-primary text-white hover:text-primary transition-colors">
                        [VIEW]
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
