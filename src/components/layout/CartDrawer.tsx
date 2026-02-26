"use client";

import { useCartStore } from "@/lib/store";
import { X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

export default function CartDrawer() {
    const { items, isCartOpen, closeCart, removeItem, total, addItem, currency } = useCartStore();
    const [recommendations, setRecommendations] = useState<Product[]>([]);

    useEffect(() => {
        if (isCartOpen) {
            fetch("/api/products")
                .then(res => res.json())
                .then((data: Product[]) => {
                    const cartIds = items.map(i => i.id);
                    // Filter out items already in cart, sort by likes (proxy for popularity)
                    const available = data
                        .filter(p => !cartIds.includes(p.id))
                        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                        .slice(0, 2);
                    setRecommendations(available);
                })
                .catch(err => console.error("Failed to fetch recommendations", err));
        }
    }, [isCartOpen, items]);

    useEscapeKey(() => {
        if (isCartOpen) closeCart();
    });

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-xl z-[70] shadow-2xl flex flex-col border-l border-white/20"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
                            <button onClick={closeCart} aria-label="Close Cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
                                    <span className="text-4xl">🛒</span>
                                    <p className="font-mono uppercase text-center">Your cart is empty</p>
                                    <button
                                        onClick={closeCart}
                                        className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-primary transition-colors"
                                    >
                                        EXPLORE LATEST DROPS
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-24 bg-surface flex-shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold uppercase leading-tight line-clamp-2">{item.title}</h3>
                                                <p className="text-sm font-mono text-gray-500">{formatPrice(item.price, currency)}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-200">
                                                    <button aria-label={`Remove ${item.title} from cart`} onClick={() => {
                                                        removeItem(item.id);
                                                    }} className="p-3 hover:bg-gray-100 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                                <span className="text-xs font-mono">QTY: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Cross-Selling Section */}
                            {recommendations.length > 0 && (
                                <div className="pt-8 border-t border-gray-100">
                                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-4">You Might Also Like</h3>
                                    <div className="flex flex-col gap-4">
                                        {recommendations.map(product => (
                                            <div key={product.id} className="flex gap-4 border border-gray-100 p-2 hover:border-black transition-colors">
                                                <Link href={`/product/${product.id}`} onClick={closeCart} className="relative w-16 h-20 bg-surface flex-shrink-0">
                                                    <Image src={product.image || "/assets/placeholder.png"} alt={product.title} fill className="object-cover" />
                                                </Link>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <Link href={`/product/${product.id}`} onClick={closeCart} className="text-xs font-bold uppercase leading-tight line-clamp-1 hover:text-primary transition-colors">
                                                            {product.title}
                                                        </Link>
                                                        <p className="text-xs font-mono text-primary mt-1">{formatPrice(product.price, currency)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const sizeToAdd = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
                                                            addItem(product, sizeToAdd);
                                                        }}
                                                        className="text-[10px] font-black uppercase tracking-widest text-left hover:text-primary transition-colors flex items-center gap-1"
                                                    >
                                                        <Plus size={10} /> ADD TO CART
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-surface">
                            <div className="flex justify-between items-center mb-6 text-lg font-bold uppercase">
                                <span>Total</span>
                                <span>{formatPrice(total(), currency)}</span>
                            </div>
                            <CheckoutButton />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

import { useSession, signIn } from "next-auth/react";

function CheckoutButton() {
    const { data: session } = useSession();

    const handleCheckout = () => {
        alert("PROCEEDING TO SECURE CHECKOUT...");
    };

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleCheckout}
                className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
                Checkout
            </button>
            {!session && (
                <button
                    onClick={() => signIn("google")}
                    className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest border border-black hover:bg-gray-50 transition-colors"
                >
                    Login to Save Order
                </button>
            )}
        </div>
    );
}
