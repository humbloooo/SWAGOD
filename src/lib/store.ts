import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from './types';

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    addItem: (product: Product, size?: string) => void;
    removeItem: (productId: string, size?: string) => void;
    clearCart: () => void;
    total: () => number;
    openCart: () => void;
    closeCart: () => void;
}

interface ProductCacheState {
    cachedProducts: Product[];
    lastFetch: number | null;
    setCachedProducts: (products: Product[]) => void;
}

interface CurrencyState {
    currency: "ZAR" | "USD";
    setCurrency: (currency: "ZAR" | "USD") => void;
}

interface AppState extends CartState, ProductCacheState, CurrencyState { }

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),
            addItem: (product, size) => {
                const currentItems = get().items;
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
                get().openCart();
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
            cachedProducts: [],
            lastFetch: null,
            setCachedProducts: (products) => set({ cachedProducts: products, lastFetch: Date.now() }),
            currency: "ZAR",
            setCurrency: (currency) => set({ currency }),
        }),
        {
            name: 'SWGD_STORE',
        }
    )
);

// Fallback exports for backward compatibility if needed, though we should refactor
export const useCartStore = useAppStore;
