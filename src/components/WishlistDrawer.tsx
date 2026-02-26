"use client";

import { useAppStore } from "@/lib/store";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
    const { wishlistItems, removeFromWishlist, addItem } = useAppStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white/90 backdrop-blur-xl z-[70] shadow-2xl flex flex-col border-l border-white/20"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-black uppercase tracking-tighter">Wishlist</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {wishlistItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                    <span className="text-4xl">🖤</span>
                                    <p className="font-mono uppercase text-center">Your wishlist is empty.<br />Save some heat for later.</p>
                                </div>
                            ) : (
                                wishlistItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="relative w-24 h-32 bg-surface flex-shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold uppercase leading-tight line-clamp-2">{item.title}</h3>
                                                <p className="text-sm font-mono text-gray-500">R {item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        addItem(item);
                                                        removeFromWishlist(item.id);
                                                    }}
                                                    className="flex-1 py-2 bg-black text-white text-[10px] font-bold uppercase hover:bg-primary transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingBag size={12} /> Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    className="p-2 border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <Link
                                href="/shop"
                                onClick={onClose}
                                className="block w-full py-4 text-center border border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
