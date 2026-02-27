"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const HighlightMatch = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;

    // Split on highlight term and include term in result array
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
        <span>
            {parts.map((part, i) => (
                part.toLowerCase() === highlight.toLowerCase() ?
                    <span key={i} className="text-primary glow-primary">{part}</span> :
                    <span key={i}>{part}</span>
            ))}
        </span>
    );
};

export default function Search({ isOpen, onClose }: SearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [popular, setPopular] = useState<Product[]>([]);
    const router = useRouter();
    const { currency } = useAppStore();

    // Fetch popular/all items on open
    useEffect(() => {
        if (isOpen && popular.length === 0) {
            fetch("/api/products")
                .then(res => res.json())
                .then(data => {
                    const sorted = data.sort((a: Product, b: Product) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 3);
                    setPopular(sorted);
                })
                .catch(err => console.error("Failed to load popular items", err));
        }
    }, [isOpen, popular.length]);

    useEscapeKey(() => {
        if (isOpen) onClose();
    });

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/products`);
                const allProducts: Product[] = await res.json();
                const filtered = allProducts.filter(p =>
                    p.title.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (results.length > 0) {
            router.push(`/product/${results[0].id}`);
            onClose();
        } else if (popular.length > 0 && query.length < 2) {
            router.push(`/product/${popular[0].id}`);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-6 md:p-12 text-foreground"
                >
                    <button
                        onClick={onClose}
                        aria-label="Close Search"
                        className="self-end p-2 text-foreground hover:text-primary transition-colors"
                    >
                        <X size={48} />
                    </button>

                    <div className="max-w-4xl mx-auto w-full mt-12">
                        <form onSubmit={handleSearch} className="relative border-b-2 border-foreground/20 pb-4 flex items-center gap-4">
                            <SearchIcon size={32} className="text-foreground/50" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="SEARCH ARCHIVES / PRODUCTS"
                                className="bg-transparent text-4xl md:text-6xl font-black uppercase text-foreground outline-none w-full placeholder:text-foreground/20 tracking-tighter"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </form>

                        <div className="mt-12 overflow-y-auto max-h-[60vh] no-scrollbar">
                            {isLoading && <div className="text-white font-mono animate-pulse">SEARCHING...</div>}

                            {!isLoading && results.length > 0 && (
                                <div className="grid gap-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="group flex items-center justify-between p-4 border border-foreground/10 hover:border-primary transition-colors bg-foreground/5"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 relative overflow-hidden">
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-foreground uppercase"><HighlightMatch text={product.title} highlight={query} /></h3>
                                                    <p className="text-primary font-mono text-sm">{formatPrice(product.price, currency)}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="text-foreground/20 group-hover:text-primary transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!isLoading && query.length >= 2 && results.length === 0 && (
                                <div className="text-foreground/40 font-mono italic">NO RESULTS FOUND FOR &quot;{query}&quot;</div>
                            )}

                            {!isLoading && query.length < 2 && popular.length > 0 && (
                                <div>
                                    <h4 className="text-foreground/40 font-mono text-xs uppercase tracking-widest mb-6 border-b border-foreground/10 pb-2">SUGGESTED DISCOVERIES</h4>
                                    <div className="grid gap-4">
                                        {popular.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.id}`}
                                                onClick={onClose}
                                                className="group flex items-center justify-between p-4 border border-white/5 hover:border-primary transition-colors bg-white/5"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 relative overflow-hidden">
                                                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-foreground uppercase">{product.title}</h3>
                                                        <p className="text-primary font-mono text-xs">{formatPrice(product.price, currency)}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-foreground/30 group-hover:text-primary transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
