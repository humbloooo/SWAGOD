"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function CartDrawer() {
    const { items, isCartOpen, closeCart, removeItem, clearCart, total } = useCartStore();

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
                            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                                                <p className="text-sm font-mono text-gray-500">R {item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-200">
                                                    <button onClick={() => {
                                                        removeItem(item.id);
                                                    }} className="p-3 hover:bg-gray-100 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                                <span className="text-xs font-mono">QTY: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-surface">
                            <div className="flex justify-between items-center mb-6 text-lg font-bold uppercase">
                                <span>Total</span>
                                <span>R {total().toFixed(2)}</span>
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
        if (!session) {
            signIn("google");
        } else {
            alert("PROCEEDING TO CHECKOUT...");
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest hover:bg-black transition-colors"
        >
            {session ? "Checkout" : "Login to Checkout"}
        </button>
    );
}
