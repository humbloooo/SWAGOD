"use client";

import { Product } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AddToCartButtonProps {
    product: Product;
    selectedSize?: string;
    className?: string;
}

export default function AddToCartButton({ product, selectedSize, className }: AddToCartButtonProps) {
    const { addItem, openCart } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error("PLEASE SELECT A SIZE", {
                className: "font-mono font-bold uppercase",
            });
            return;
        }

        setIsAdding(true);

        // Simulate a small delay for premium feel
        setTimeout(() => {
            const sizeToAdd = selectedSize || (product.sizes ? product.sizes[0] : undefined);
            addItem(product, sizeToAdd);
            toast.success(`${product.title} ADDED TO CART`, {
                description: sizeToAdd ? `SIZE: ${sizeToAdd}` : undefined,
                className: "font-mono font-bold uppercase",
                action: {
                    label: "VIEW CART",
                    onClick: () => openCart(),
                },
            });
            setIsAdding(false);
        }, 600);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-6 bg-black text-white font-bold uppercase tracking-widest text-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
            {isAdding ? (
                <Loader2 size={24} className="animate-spin" />
            ) : (
                <ShoppingBag size={24} />
            )}
            {isAdding ? "ADDING..." : "ADD TO ORDER"}
        </motion.button>
    );
}
