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
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
                    Shop // <span className="text-primary">All</span>
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-24">
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className="group block">
                            <div className="relative aspect-[3/4] border border-white/5 mb-4 overflow-hidden bg-surface group-hover:border-primary transition-colors">
                                <Image
                                    src={product.image || "/assets/placeholder.png"}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                                />
                                {product.images && product.images.length > 1 && (
                                    <Image
                                        src={product.images[1]}
                                        alt={`${product.title} alternate`}
                                        fill
                                        className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                                    />
                                )}

                                {product.category === 'merch' && (
                                    <div className="absolute top-2 left-2 bg-primary text-black px-2 py-1 text-[8px] font-black tracking-widest uppercase">
                                        MERCH
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-2 py-1 text-[8px] font-mono tracking-widest hidden group-hover:block uppercase">
                                    {product.likes?.length || 0} SAVED
                                </div>
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
