"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Search({ isOpen, onClose }: SearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6 md:p-12"
                >
                    <button
                        onClick={onClose}
                        className="self-end p-2 text-white hover:text-primary transition-colors"
                    >
                        <X size={48} />
                    </button>

                    <div className="max-w-4xl mx-auto w-full mt-12">
                        <div className="relative border-b-2 border-white/20 pb-4 flex items-center gap-4">
                            <SearchIcon size={32} className="text-white/50" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="SEARCH ARCHIVES / PRODUCTS"
                                className="bg-transparent text-4xl md:text-6xl font-black uppercase text-white outline-none w-full placeholder:text-white/10 tracking-tighter"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="mt-12 overflow-y-auto max-h-[60vh] no-scrollbar">
                            {isLoading && <div className="text-white font-mono animate-pulse">SEARCHING...</div>}

                            {!isLoading && results.length > 0 && (
                                <div className="grid gap-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="group flex items-center justify-between p-4 border border-white/10 hover:border-primary transition-colors bg-white/5"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 relative overflow-hidden">
                                                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white uppercase">{product.title}</h3>
                                                    <p className="text-primary font-mono text-sm">R {product.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="text-white/20 group-hover:text-primary transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!isLoading && query.length >= 2 && results.length === 0 && (
                                <div className="text-white/30 font-mono italic">NO RESULTS FOUND FOR "{query}"</div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
