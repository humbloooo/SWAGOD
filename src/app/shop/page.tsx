import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Shop() {
    const products = await getProducts();

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
                    Shop // <span className="text-primary">All</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className="group block">
                            <div className="relative aspect-[3/4] border border-black mb-4 overflow-hidden bg-surface">
                                <Image
                                    src={product.image || "/assets/placeholder.png"}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {product.category === 'merch' && (
                                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                                        MERCH
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold uppercase text-lg group-hover:text-primary transition-colors">{product.title}</h3>
                            <p className="font-mono text-sm text-gray-500">R {product.price.toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            </div>
            <Navigation />
        </main>
    );
}
