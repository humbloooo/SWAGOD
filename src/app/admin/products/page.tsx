"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/data";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import { toast } from "sonner";

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            loading: 'Saving product...',
            success: async () => {
                // Refresh
                const updated = await fetch("/api/products").then(r => r.json());
                setProducts(updated);
                setIsEditing(false);
                setCurrentProduct({});
                return 'Product saved successfully!';
            },
            error: (err: any) => `Error: ${err.message}`
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product?")) return;

        toast.promise(
            async () => {
                const res = await fetch(`/api/products?id=${id}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete");
                return res;
            },
            {
                loading: 'Deleting product...',
                success: () => {
                    setProducts(products.filter(p => p.id !== id));
                    return 'Product deleted';
                },
                error: 'Failed to delete product'
            }
        );
    };

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Manage // <span className="text-primary">Products</span>
                    </h1>
                    <button
                        onClick={() => { setIsEditing(true); setCurrentProduct({}); }}
                        className="px-6 py-3 bg-black text-white font-bold uppercase hover:bg-primary transition-colors"
                    >
                        + Add Product
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold uppercase mb-6">{currentProduct.id ? "Edit Product" : "New Product"}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
                                <div>
                                    <label className="block mb-1">Title</label>
                                    <input
                                        className="w-full border p-2"
                                        value={currentProduct.title || ""}
                                        onChange={e => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1">Price (R)</label>
                                        <input
                                            type="number"
                                            className="w-full border p-2"
                                            value={currentProduct.price || ""}
                                            onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Category</label>
                                        <select
                                            className="w-full border p-2"
                                            value={currentProduct.category || "clothing"}
                                            onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value as any })}
                                        >
                                            <option value="clothing">Clothing</option>
                                            <option value="merch">Merch</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Product Image</label>
                                    <MultiImageUpload
                                        values={currentProduct.images || (currentProduct.image ? [currentProduct.image] : [])}
                                        onChange={(urls) => {
                                            setCurrentProduct({
                                                ...currentProduct,
                                                images: urls,
                                                image: urls[0] || "" // Keep main image synced with first gallery image
                                            });
                                        }}
                                        folder="products"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Sizes Available</label>
                                    <div className="flex gap-4 flex-wrap">
                                        {["S", "M", "L", "XL", "XXL"].map(size => (
                                            <label key={size} className="flex items-center gap-2 border p-2 cursor-pointer hover:bg-gray-100">
                                                <input
                                                    type="checkbox"
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
                                                <span className="font-bold">{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        className="w-full border p-2 h-32"
                                        value={currentProduct.description || ""}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-black uppercase font-bold">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-black text-white uppercase font-bold hover:bg-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid gap-4">
                    {products.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 bg-surface">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 relative">
                                    {/* Handle missing images gracefully */}
                                    {product.image && <img src={product.image} alt={product.title} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <h3 className="font-bold uppercase">{product.title}</h3>
                                    <p className="font-mono text-xs text-gray-500">R {product.price?.toFixed(2)} / {product.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setCurrentProduct(product); setIsEditing(true); }}
                                    className="px-4 py-2 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="px-4 py-2 border border-red-500 text-red-500 text-xs font-bold uppercase hover:bg-red-500 hover:text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
