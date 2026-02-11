import { PRODUCTS } from "@/lib/data";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";

export default function Merch() {
    const merchItems = PRODUCTS.filter(p => p.category === 'merch');

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
                    Clothing // <span className="text-primary">Merch</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {merchItems.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id} className="relative aspect-square border border-black hover:border-primary transition-colors group block">
                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <span className="font-mono text-2xl uppercase mb-2">{product.title}</span>
                                <span className="font-bold text-primary">R {product.price.toFixed(2)}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 p-8 border border-dashed border-gray-300">
                    <h3 className="tex-2xl font-bold uppercase mb-4">Collection 001</h3>
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
