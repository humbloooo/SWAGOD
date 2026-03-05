"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { toast } from "sonner";

interface AddToCartButtonProps {
    product: Product;
    selectedSize?: string;
    className?: string;
    showCartOnAdd?: boolean;
}

export default function AddToCartButton({ product, selectedSize, className = "", showCartOnAdd = true }: AddToCartButtonProps) {
    const { addItem, openCart, currency } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleAddToCart = async () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error("PLEASE SELECT A SIZE", {
                className: "font-mono font-bold uppercase",
            });
            return;
        }

        if (window.navigator.vibrate) window.navigator.vibrate([10, 30, 20]);
        setIsAdding(true);

        // Simulate a small delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));

        const sizeToAdd = selectedSize || (product.sizes ? product.sizes[0] : undefined);
        addItem(product, sizeToAdd);
        setIsAdding(false);
        setIsSuccess(true);

        toast.success(`${product.title} ADDED TO CART`, {
            description: `${sizeToAdd ? `SIZE: ${sizeToAdd} // ` : ""}${formatPrice(product.price, currency)}`,
            className: "font-mono font-bold uppercase",
            action: showCartOnAdd ? {
                label: "VIEW CART",
                onClick: () => openCart(),
            } : undefined,
        });

        if (showCartOnAdd) {
            setTimeout(() => {
                openCart();
                setIsSuccess(false);
            }, 500);
        } else {
            setTimeout(() => setIsSuccess(false), 2000);
        }
    };

    return (
        <Magnetic>
            <motion.button
                whileTap={{ scale: 0.95 }}
                animate={isSuccess ? {
                    backgroundColor: ["#FF3300", "#000000", "#FF3300"],
                    scale: [1, 1.05, 1]
                } : {}}
                transition={{ duration: 0.5 }}
                onClick={handleAddToCart}
                disabled={isAdding || isSuccess}
                className={cn(
                    "w-full py-6 bg-primary text-background font-black uppercase tracking-[0.3em] text-lg md:text-xl hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl overflow-hidden",
                    className
                )}
            >
                {isAdding ? (
                    <Loader2 size={24} className="animate-spin" />
                ) : isSuccess ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <Check size={24} strokeWidth={4} />
                        <span>SUCCESS</span>
                    </motion.div>
                ) : (
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={24} strokeWidth={3} />
                        <span>ADD TO ORDER</span>
                    </div>
                )}
            </motion.button>
        </Magnetic>
    );
}
