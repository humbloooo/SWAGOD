"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductSchema from "@/components/ui/ProductSchema";

interface ProductClientProps {
    id: string;
}

export default function ProductClient({ id }: ProductClientProps) {
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPromo, setShowPromo] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const { currency } = useAppStore();
    const { scrollY } = useScroll();
    const [showStickyCart, setShowStickyCart] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);

    // Delivery Estimate (3-7 days from now)
    const [deliveryEstimate, setDeliveryEstimate] = useState("");

    useEffect(() => {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 3);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 7);

        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        setDeliveryEstimate(`${minDate.toLocaleDateString('en-ZA', options)} - ${maxDate.toLocaleDateString('en-ZA', options)}`);
    }, []);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            // Show sticky cart roughly after scrolling past the main product info
            setShowStickyCart(latest > 600);
        });
    }, [scrollY]);

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
        async function fetchProduct() {
            try {
                const res = await fetch('/api/products');
                const products: Product[] = await res.json();

                const found = products.find((p) => p.id === id);
                if (found) {
                    setProduct(found);
                    if (found.sizes && found.sizes.length > 0) {
                        setSelectedSize(found.sizes[0]);
                    }
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
        if (id) {
            fetchProduct();
            // Generate a stable random number based on part of the ID string
            const idSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            // Will produce a number between 12 and 45
            setViewerCount((idSum % 34) + 12);
        }
    }, [id]);

    useEffect(() => {
        if (product) {
            try {
                const stored = localStorage.getItem('recentlyViewed');
                let viewedList: Product[] = stored ? JSON.parse(stored) : [];
                viewedList = viewedList.filter(p => p.id !== product.id);
                viewedList.unshift(product);
                if (viewedList.length > 4) viewedList = viewedList.slice(0, 4);
                localStorage.setItem('recentlyViewed', JSON.stringify(viewedList));
            } catch (error) {
                console.error("Failed to update recently viewed", error);
            }
        }
    }, [product]);

    if (loading) return (
        <main className="min-h-screen bg-black pt-32 pb-[100px] overflow-hidden">
            <Header />
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <div className="h-4 bg-white/5 w-64 animate-pulse rounded"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
                    <div className="space-y-6">
                        <div className="relative aspect-[3/4] bg-white/5 animate-pulse border border-white/10"></div>
                        <div className="grid grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="relative aspect-square bg-white/5 animate-pulse border border-white/10"></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-12">
                        <div className="space-y-6">
                            <div className="h-20 bg-white/5 animate-pulse w-3/4"></div>
                            <div className="h-10 bg-white/5 animate-pulse w-1/3"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 bg-white/5 animate-pulse"></div>
                            <div className="h-12 bg-white/5 animate-pulse"></div>
                        </div>
                        <div className="h-16 bg-white/5 animate-pulse w-full"></div>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
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
            <ProductSchema product={product} />
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
                            className="relative aspect-[3/4] border border-white/10 bg-white/5 overflow-hidden cursor-zoom-in group"
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            <Image
                                src={selectedImage || product.image || "/assets/placeholder.png"}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                                    {formatPrice(product.price, currency)}
                                </p>
                                <span className="px-3 py-1 border border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                    {product.category}
                                </span>
                                {/* Item 31: Scarcity Blip */}
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20">
                                    <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                                    <span className="text-[8px] font-mono text-primary font-black uppercase tracking-tighter">
                                        {viewerCount > 0 ? `${viewerCount} VIEWING THIS // ` : ''}LIMITED STOCK
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="mb-12 space-y-2 border-l border-white/10 pl-8">
                            <Accordion title="PRODUCT DETAILS">
                                <div className="grid grid-cols-2 gap-y-4 font-mono text-[10px] uppercase tracking-widest text-white/60 pt-4">
                                    <div>CATEGORY:</div><div className="text-white">{product.category}</div>
                                    <div>REGION:</div><div className="text-white">SOUTH AFRICA</div>
                                    <div>STATUS:</div><div className="text-white text-primary">AUTHENTIC</div>
                                </div>
                            </Accordion>

                            <Accordion title="DESCRIPTION">
                                <p className="text-white/60 font-mono text-sm leading-relaxed uppercase max-w-lg pt-4 pb-2">
                                    {product.description}
                                </p>
                            </Accordion>
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
                                <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1">
                                    ESTIMATED ARRIVAL:<br />
                                    {deliveryEstimate || "CALCULATING..."}
                                </p>
                                <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">GOVERNMENT COMPLIANT {"//"} FREE OVER R2000</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">RETURN_POLICY</p>
                                <p className="text-[10px] font-mono uppercase tracking-widest">30_DAY ARCHIVE PROTOCOL</p>
                                {/* Item 74: Share Buttons */}
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">TRANSMIT TO NETWORK:</p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out ${product.title} at SWAGOD&url=https://swagod.co.za/product/${product.id}`, '_blank')}
                                            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/10 hover:border-primary transition-colors"
                                        >
                                            X / TWITTER
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`https://swagod.co.za/product/${product.id}`);
                                                toast.success("LINK COPIED TO CLIPBOARD");
                                            }}
                                            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/10 hover:border-primary transition-colors"
                                        >
                                            COPY LINK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related */}
                    {relatedProducts.length > 0 && (
                        <div className="border-t border-white/5 pt-32 mb-32">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 italic">RECOMMENDED {"//"} <span className="text-primary">MODULES</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProducts.map((rp) => (
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
                                            <p className="font-mono text-xs text-white/40">{formatPrice(rp.price, currency)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tap-to-Enlarge Lightbox */}
                <AnimatePresence>
                    {isLightboxOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6 items-center justify-center cursor-zoom-out"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <button
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                                onClick={() => setIsLightboxOpen(false)}
                            >
                                <X size={48} />
                            </button>
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-4xl max-h-[85vh] aspect-[3/4] md:aspect-auto md:h-full border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={selectedImage || product.image || "/assets/placeholder.png"}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sticky Mobile Add to Cart */}
                <AnimatePresence>
                    {showStickyCart && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed bottom-[60px] left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 md:hidden"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm uppercase truncate">{product.title}</h4>
                                    <p className="font-mono text-xs text-primary">{formatPrice(product.price, currency)}</p>
                                </div>
                                <div className="w-1/2">
                                    <AddToCartButton product={product} selectedSize={selectedSize} className="!py-3 !text-sm" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Navigation />
            </div>
        </main>
    );
}

function Accordion({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 last:border-0 py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left py-2 hover:text-primary transition-colors group"
            >
                <h3 className="text-[10px] font-mono text-white/40 group-hover:text-primary transition-colors uppercase tracking-[0.3em]">{title}</h3>
                <span className="text-white/40 group-hover:text-primary transition-colors">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
