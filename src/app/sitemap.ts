import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://swagod.co.za';

    // Static routes
    const routes = ['', '/shop', '/tour', '/archive', '/about'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic product routes
    try {
        const products = await getProducts();
        const productRoutes = products.map((product) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
        return [...routes, ...productRoutes];
    } catch (e) {
        return routes;
    }
}
