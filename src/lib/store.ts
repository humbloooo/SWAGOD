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

interface WishlistState {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

interface AppState extends CartState, WishlistState { }

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            items: [],
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

            // Wishlist
            wishlistItems: [],
            addToWishlist: (product) => {
                if (!get().wishlistItems.find(p => p.id === product.id)) {
                    set({ wishlistItems: [...get().wishlistItems, product] });
                }
            },
            removeFromWishlist: (productId) => {
                set({ wishlistItems: get().wishlistItems.filter(p => p.id !== productId) });
            },
            isInWishlist: (productId) => {
                return get().wishlistItems.some(p => p.id === productId);
            }
        }),
        {
            name: 'swagod-store',
        }
    )
);

// Fallback exports for backward compatibility if needed, though we should refactor
export const useCartStore = useAppStore;
