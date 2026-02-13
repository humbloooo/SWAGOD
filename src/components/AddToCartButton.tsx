import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export default function AddToCartButton({ product, selectedSize }: { product: Product, selectedSize?: string }) {
    const addItem = useCartStore((state) => state.addItem) as (product: any, size?: string) => void;

    return (
        <button
            onClick={() => {
                // @ts-ignore
                if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                    toast.error("PLEASE SELECT A SIZE");
                    return;
                }
                const sizeToAdd = selectedSize || (product.sizes ? product.sizes[0] : undefined);
                addItem(product, sizeToAdd);
                toast.success(`ADDED ${product.title} TO CART`);
            }}
            className="w-full py-6 bg-black text-white font-bold uppercase tracking-widest text-xl hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Add to Order
        </button>
    );
}
