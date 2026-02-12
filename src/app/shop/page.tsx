import { getProducts } from "@/lib/db";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function Shop() {
    const products = await getProducts();
    const clothing = products.filter(p => p.category === 'clothing');
    const merch = products.filter(p => p.category === 'merch' || p.category === 'accessories');

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
                    Shop // <span className="text-primary">All</span>
                </h1>

                {/* Clothing Section */}
                <section className="mb-24">
                    <h2 className="text-4xl font-black uppercase mb-8 border-b-2 border-black pb-4">Clothing</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {clothing.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group block relative">
                                <div className="relative aspect-[3/4] border border-gray-200 overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Hover Price Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="font-mono font-bold text-white text-xl">
                                            R {product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-bold uppercase text-sm leading-tight group-hover:text-primary transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="font-mono text-xs text-gray-500 mt-1">
                                        R {product.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {clothing.length === 0 && <p className="font-mono text-gray-400">No clothing items available yet.</p>}
                </section>

                {/* Merch Section */}
                <section className="mb-24">
                    <h2 className="text-4xl font-black uppercase mb-8 border-b-2 border-black pb-4">Merch & Accessories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {merch.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id} className="group block relative">
                                <div className="relative aspect-square border border-gray-200 overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Hover Price Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="font-mono font-bold text-white text-xl">
                                            R {product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="font-bold uppercase text-sm leading-tight group-hover:text-primary transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="font-mono text-xs text-gray-500 mt-1">
                                        R {product.price.toFixed(2)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="mt-12 p-8 border border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold uppercase mb-4">Collection 001</h3>
                    <p className="max-w-xl text-gray-500">
                        Our debut collection focuses on raw materials and brutalist aesthetics.
                        Each piece is limited edition and numbered.
                    </p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
