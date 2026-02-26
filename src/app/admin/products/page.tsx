"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/types"; // Fixed import
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Check, X, Box, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"newest" | "price" | "likes">("newest");

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!currentProduct.title || (currentProduct.price ?? 0) <= 0) {
            toast.error("INVALID PRODUCT DATA");
            return;
        }

        const method = currentProduct.id ? "PUT" : "POST";

        const promise = new Promise(async (resolve, reject) => {
            try {
                const res = await fetch("/api/products", {
                    method,
                    body: JSON.stringify(currentProduct),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Failed to save product");
                }

                resolve(res);
            } catch (err) {
                reject(err);
            }
        });

        toast.promise(promise, {
            loading: 'SYNCING WITH ARCHIVE...',
            success: async () => {
                const updated = await fetch("/api/products").then(r => r.json());
                setProducts(updated);
                setIsEditing(false);
                setCurrentProduct({});
                return 'STORE UPDATED';
            },
            error: (err: any) => `SYNC ERROR: ${err.message}`
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("DELETE THIS PRODUCT?")) return;

        toast.promise(
            async () => {
                const res = await fetch(`/api/products?id=${id}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete");
                return res;
            },
            {
                loading: 'PURGING...',
                success: () => {
                    setProducts(products.filter(p => p.id !== id));
                    return 'ENTRY PURGED';
                },
                error: 'PURGE FAILED'
            }
        );
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const bulkDelete = async () => {
        if (!confirm(`PURGE ${selectedIds.length} ENTRIES?`)) return;

        toast.promise(
            Promise.all(selectedIds.map(id => fetch(`/api/products?id=${id}`, { method: "DELETE" }))),
            {
                loading: 'BULK PURGING...',
                success: () => {
                    setProducts(products.filter(p => !selectedIds.includes(p.id)));
                    setSelectedIds([]);
                    return 'ARCHIVE CLEANED';
                },
                error: 'BULK PURGE FAILED'
            }
        );
    };

    return (
        <main className="pb-[100px] pt-32 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <header>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                            STORE // <span className="text-primary">COLLECTIONS</span>
                        </h1>
                        <p className="text-primary font-mono uppercase tracking-[0.2em] text-sm">TOTAL PRODUCTS: {products.length}</p>
                    </header>
                    <div className="flex gap-4">
                        {selectedIds.length > 0 && (
                            <button
                                onClick={bulkDelete}
                                className="px-6 py-4 border border-red-500/50 text-red-500 font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                            >
                                <Trash2 size={18} /> PURGE SELECTED ({selectedIds.length})
                            </button>
                        )}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-4 bg-black border border-white/20 text-white font-black uppercase tracking-widest outline-none hover:border-white/40 transition-colors"
                        >
                            <option value="newest">SORT: NEWEST</option>
                            <option value="price">SORT: PRICE (HIGH)</option>
                            <option value="likes">SORT: LIKES (HIGH)</option>
                        </select>
                        <button
                            onClick={() => { setIsEditing(true); setCurrentProduct({ category: 'clothing' }); }}
                            className="px-8 py-4 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                        >
                            <Plus size={20} /> ADD ENTRY
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {[...products].sort((a, b) => {
                            if (sortBy === "price") return (b.price || 0) - (a.price || 0);
                            if (sortBy === "likes") return (b.likes?.length || 0) - (a.likes?.length || 0);
                            return 0;
                        }).map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group relative flex items-center justify-between p-6 border transition-all duration-300 ${selectedIds.includes(product.id)
                                    ? 'border-primary bg-primary/5'
                                    : 'border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => toggleSelection(product.id)}
                                        className={`w-6 h-6 border flex items-center justify-center transition-colors ${selectedIds.includes(product.id) ? 'bg-primary border-primary' : 'border-white/20 hover:border-primary'
                                            }`}
                                    >
                                        {selectedIds.includes(product.id) && <Check size={14} className="text-black font-black" />}
                                    </button>

                                    <div className="w-20 h-20 bg-white/10 border border-white/10 relative overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <Box size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{product.title}</h3>
                                        <div className="flex gap-4 mt-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                                            <span>PRICE: <span className="text-white">R {product.price?.toFixed(2)}</span></span>
                                            <span>CAT: <span className="text-white">{product.category}</span></span>
                                            {product.sizes && product.sizes.length > 0 && (
                                                <span>SIZES: <span className="text-white">{product.sizes.join(', ')}</span></span>
                                            )}
                                            <span className="text-primary font-bold">LIKES: {product.likes?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setCurrentProduct(product); setIsEditing(true); }}
                                        className="p-3 border border-white/10 hover:border-primary hover:text-primary transition-all"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-3 border border-white/10 hover:border-red-500 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black border border-white/20 p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                        >
                            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>

                            <header className="mb-10">
                                <h2 className="text-4xl font-black uppercase tracking-tighter">
                                    {currentProduct.id ? "EDIT // PRODUCT" : "NEW // PRODUCT"}
                                </h2>
                                <p className="text-primary font-mono text-[10px] uppercase tracking-widest mt-2 italic">SAVING TO DATABASE...</p>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs uppercase tracking-[0.15em]">
                                <div className="space-y-2">
                                    <label className="text-white/40">TITLE_STRING</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all"
                                        value={currentProduct.title || ""}
                                        onChange={e => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-white/40">VALUE_ZAR</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all"
                                            value={currentProduct.price || ""}
                                            onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-white/40">CATEGORY_TYPE</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all appearance-none"
                                            value={currentProduct.category || "clothing"}
                                            onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value as any })}
                                        >
                                            <option value="clothing">CLOTHING</option>
                                            <option value="merch">MERCH</option>
                                            <option value="accessories">ACCESSORIES</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white/40">VISUAL_ASSETS</label>
                                    <div className="p-6 border border-white/10 bg-white/5">
                                        <MultiImageUpload
                                            values={currentProduct.images || (currentProduct.image ? [currentProduct.image] : [])}
                                            onChange={(urls) => {
                                                setCurrentProduct({
                                                    ...currentProduct,
                                                    images: urls,
                                                    image: urls[0] || ""
                                                });
                                            }}
                                            folder="products"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-white/40">SIZE_MATRIX</label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["S", "M", "L", "XL", "XXL"].map(size => (
                                            <label key={size} className="group flex items-center gap-4 border border-white/10 p-4 cursor-pointer hover:border-primary transition-all flex-1 min-w-[80px] justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={currentProduct.sizes?.includes(size) || false}
                                                    onChange={(e) => {
                                                        const currentSizes = currentProduct.sizes || [];
                                                        if (e.target.checked) {
                                                            setCurrentProduct({ ...currentProduct, sizes: [...currentSizes, size] });
                                                        } else {
                                                            setCurrentProduct({ ...currentProduct, sizes: currentSizes.filter(s => s !== size) });
                                                        }
                                                    }}
                                                />
                                                <span className={`text-lg font-black transition-colors ${currentProduct.sizes?.includes(size) ? 'text-primary' : 'text-white/40 group-hover:text-white'}`}>{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white/40">INTEL_DESCRIPTION</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 p-4 h-40 focus:border-primary outline-none transition-all resize-none"
                                        value={currentProduct.description || ""}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-6 pt-10">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-10 py-5 border border-white/20 font-black tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        ABORT
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-10 py-5 bg-primary text-black font-black tracking-widest hover:bg-white transition-all"
                                    >
                                        EXECUTE_WRITE
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </main>
    );
}
