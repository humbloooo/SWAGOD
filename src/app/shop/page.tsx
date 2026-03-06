import Header from "@/components/layout/Header";
import { getProducts } from "@/lib/db";
import { Suspense } from "react";
import ShopContent from "@/components/shop/ShopContent";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export default async function Shop() {
    const products = await getProducts();
    // Default currency for server-side initial render
    const currency = "ZAR";

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <Suspense fallback={
                <div className="container mx-auto px-6">
                    <div className="h-20 w-3/4 mb-12 bg-foreground/5 animate-pulse" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="aspect-[3/4] w-full" />
                        ))}
                    </div>
                </div>
            }>
                <ShopContent products={products} currency={currency} />
            </Suspense>
        </main>
    );
}
