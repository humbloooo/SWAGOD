import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from './types';

interface CartState {
    items: CartItem[];
    addItem: (product: Product, size?: string) => void;
    removeItem: (productId: string, size?: string) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, size) => {
                const currentItems = get().items;
                // If product has sizes but no size selected, default to 'M' or handle error?
                // For now, if no size passed but product has sizes, we might need to enforce it in UI.
                // Here we assume UI creates the unique key.
                const selectedSize = size || "M";

                const existingItem = currentItems.find((item) => item.id === product.id && item.selectedSize === selectedSize);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id && item.selectedSize === selectedSize
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...product, quantity: 1, selectedSize }] });
                }
            },
            removeItem: (productId, size) => {
                set({
                    items: get().items.filter((item) => !(item.id === productId && (size ? item.selectedSize === size : true))),
                });
            },
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'swagod-cart',
        }
    )
);
