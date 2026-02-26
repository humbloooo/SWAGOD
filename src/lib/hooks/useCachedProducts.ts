import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Product } from '@/lib/types';

const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useCachedProducts() {
    const { cachedProducts, lastFetch, setCachedProducts } = useAppStore();

    useEffect(() => {
        const fetchProducts = async () => {
            const now = Date.now();
            if (!lastFetch || (now - lastFetch > CACHE_STALE_TIME) || cachedProducts.length === 0) {
                try {
                    const res = await fetch('/api/products');
                    if (res.ok) {
                        const products: Product[] = await res.json();
                        setCachedProducts(products);
                    }
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                }
            }
        };

        fetchProducts();
    }, [lastFetch, cachedProducts.length, setCachedProducts]);

    return cachedProducts;
}
