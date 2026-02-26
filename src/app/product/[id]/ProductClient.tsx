"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ProductClientProps {
    id: string;
}

export default function ProductClient({ id }: ProductClientProps) {
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [showPromo, setShowPromo] = useState(false);
    const [promoCode, setPromoCode] = useState("");

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return;
        toast.info("PROMO CODE APPLIED", {
            description: `CODE ${promoCode.toUpperCase()} REGISTERED`,
            className: "font-mono font-bold uppercase",
        });
        setPromoCode("");
        setShowPromo(false);
    };

    useEffect(() => {
        /* ... rest of useEffect ... */
        async function fetchProduct() {
            try {
                const res = await fetch('/api/products');
                const products: Product[] = await res.json();

                const found = products.find((p) => p.id === id);
                if (found) {
                    setProduct(found);
                    const related = products
                        .filter(p => p.category === found.category && p.id !== found.id)
                        .slice(0, 3);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="font-mono text-primary text-xs tracking-[0.5em]"
            >
                LOADING...
            </motion.div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-4xl font-black uppercase mb-4">PRODUCT NOT FOUND</h1>
            <p className="font-mono text-xs text-white/40 mb-8 uppercase tracking-widest">The requested item is currently unavailable.</p>
            <Link href="/shop" className="px-8 py-4 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-all">
                BROWSE PRODUCTS
            </Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-black text-white pb-[100px] pt-32">
            <Header />
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[10px] font-mono uppercase text-white/40">
                        <Link href="/shop" className="hover:text-primary transition-colors">SHOP</Link>
                        <ChevronRight size={10} />
                        <Link href={`/shop#${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                        <ChevronRight size={10} />
                        <span className="text-white font-bold">{product.title}</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
                    {/* Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-[3/4] border border-white/10 bg-white/5 overflow-hidden"
                        >
                            <Image
                                src={selectedImage || product.image || "/assets/placeholder.png"}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square border transition-all ${selectedImage === img ? "border-primary" : "border-white/10 hover:border-white/30"}`}
                                    >
                                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-12"
                        >
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                                {product.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <p className="text-3xl font-black text-primary font-mono tracking-tighter">
                                    R {product.price.toFixed(2)}
                                </p>
                                <span className="px-3 py-1 border border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                    {product.category}
                                </span>
                                {/* Item 31: Scarcity Blip */}
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20">
                                    <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                                    <span className="text-[8px] font-mono text-primary font-black uppercase tracking-tighter">
                                        LIMITED STOCK // ADD TO CART
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="mb-12 space-y-8 border-l border-white/10 pl-8">
                            <div>
                                <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">PRODUCT DETAILS:</h3>
                                <div className="grid grid-cols-2 gap-y-4 font-mono text-[10px] uppercase tracking-widest text-white/60">
                                    <div>CATEGORY:</div><div className="text-white">{product.category}</div>
                                    <div>REGION:</div><div className="text-white">SOUTH AFRICA</div>
                                    <div>STATUS:</div><div className="text-white text-primary">AUTHENTIC</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">DESCRIPTION:</h3>
                                <p className="text-white/60 font-mono text-sm leading-relaxed uppercase max-w-lg">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-6">SELECT SIZE:</h3>
                                <div className="flex gap-4 flex-wrap">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-14 h-14 flex items-center justify-center border font-black transition-all ${selectedSize === size
                                                ? "bg-primary text-black border-primary scale-110 shadow-[0_0_20px_rgba(255,100,0,0.3)]"
                                                : "bg-white/5 text-white border-white/10 hover:border-primary"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-6">
                            <AddToCartButton product={product} selectedSize={selectedSize} />

                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowPromo(!showPromo)}
                                    className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-primary transition-colors text-left flex items-center gap-2"
                                >
                                    <span>{showPromo ? "[-]" : "[+]"}</span> {showPromo ? "CANCEL PROMO" : "APPLY PROMO CODE"}
                                </button>

                                <AnimatePresence>
                                    {showPromo && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden flex gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                placeholder="ENTER CODE"
                                                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-widest focus:border-primary outline-none"
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                className="px-6 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors"
                                            >
                                                APPLY
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                            <div className="space-y-2">
                                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">SHIPPING_PRIORITY</p>
                                <p className="text-[10px] font-mono uppercase tracking-widest">GOVERNMENT COMPLIANT // FREE OVER R2000</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">RETURN_POLICY</p>
                                <p className="text-[10px] font-mono uppercase tracking-widest">30_DAY ARCHIVE PROTOCOL</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-white/5 pt-32 mb-32">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 italic">RECOMMENDED // <span className="text-primary">MODULES</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProducts.map((rp, idx) => (
                                <Link href={`/product/${rp.id}`} key={rp.id} className="group block relative overflow-hidden bg-white/5 border border-white/10 p-6">
                                    <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                                        <Image
                                            src={rp.image || "/assets/placeholder.png"}
                                            alt={rp.title}
                                            fill
                                            className="object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black uppercase tracking-tight text-lg group-hover:text-primary transition-colors">{rp.title}</h3>
                                        <p className="font-mono text-xs text-white/40">R {rp.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Navigation />
        </main>
    );
}
