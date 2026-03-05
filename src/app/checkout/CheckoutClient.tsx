"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Truck, ArrowLeft, Loader2, Lock } from "lucide-react";
import Script from "next/script";
import { toast } from "sonner";

interface PaystackResponse {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string | undefined;
                email: string;
                amount: number;
                currency: string;
                ref: string;
                callback: (response: PaystackResponse) => Promise<void>;
                onClose: () => void;
            }) => { openIframe: () => void };
        };
    }
}

export default function CheckoutClient() {
    const { items, total, currency, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: session?.user?.email || "",
        address: "",
        city: "",
        province: "",
        zipCode: "",
        phone: ""
    });

    useEffect(() => {
        if (session?.user?.email) {
            setFormData(prev => ({ ...prev, email: session.user?.email || "" }));
        }
    }, [session]);

    if (items.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-4xl font-black uppercase mb-4">CART EMPTY</h2>
                <p className="font-mono text-foreground/40 mb-8 uppercase">Nothing to secure. Return to collection.</p>
                <button onClick={() => router.push("/shop")} className="px-8 py-4 bg-primary text-background font-bold tracking-widest uppercase hover:scale-105 transition-all">
                    BACK TO SHOP
                </button>
            </div>
        );
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaystack = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.address || !formData.phone) {
            toast.error("PLEASE FILL ALL REQUIRED FIELDS");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create Order in DB
            const orderRes = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    total: total(),
                    currency,
                    shippingAddress: {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        province: formData.province,
                        zipCode: formData.zipCode,
                        phoneNumber: formData.phone
                    }
                })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

            // 2. Initialize Paystack
            const handler = window.PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: formData.email,
                amount: total() * 100, // Kobo
                currency: currency || "ZAR",
                ref: `REF-${Date.now()}`,
                callback: async (response: PaystackResponse) => {
                    // 3. Verify on Backend
                    const verifyRes = await fetch("/api/checkout/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            reference: response.reference,
                            orderId: orderData.orderId
                        })
                    });

                    const verifyResult = await verifyRes.json();
                    if (verifyResult.success) {
                        toast.success("PAYMENT_SUCCESSFUL // ORDER_SECURED");
                        clearCart();
                        router.push(`/checkout/success?id=${orderData.orderId}`);
                    } else {
                        toast.error("VERIFICATION_FAILED_CONTACT_SUPPORT");
                        setIsProcessing(false);
                    }
                },
                onClose: () => {
                    setIsProcessing(false);
                    toast.info("TRANSACTION_CANCELLED");
                }
            });

            handler.openIframe();
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6">
            <Script src="https://js.paystack.co/v1/inline.js" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left: Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-mono text-foreground/40 uppercase tracking-widest hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft size={12} /> RETREAT_TO_CART
                    </button>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">SECURE_TRANSMISSION</h1>
                        <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest">Provide coordinates for delivery.</p>
                    </div>

                    <form onSubmit={handlePaystack} className="space-y-8">
                        <section className="space-y-4">
                            <h3 className="font-mono text-[10px] text-primary uppercase tracking-[0.3em]">ID_RECOGNITION</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required name="fullName" placeholder="FULL NAME" value={formData.fullName} onChange={handleInput} className="checkout-input" />
                                <input required name="email" type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={handleInput} className="checkout-input" />
                            </div>
                            <input required name="phone" placeholder="PHONE NUMBER (+27...)" value={formData.phone} onChange={handleInput} className="checkout-input" />
                        </section>

                        <section className="space-y-4">
                            <h3 className="font-mono text-[10px] text-primary uppercase tracking-[0.3em]">GEOGRAPHICAL_COORDINATES</h3>
                            <input required name="address" placeholder="STREET ADDRESS" value={formData.address} onChange={handleInput} className="checkout-input" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <input required name="city" placeholder="CITY" value={formData.city} onChange={handleInput} className="checkout-input" />
                                <input required name="province" placeholder="PROVINCE" value={formData.province} onChange={handleInput} className="checkout-input" />
                                <input required name="zipCode" placeholder="ZIP CODE" value={formData.zipCode} onChange={handleInput} className="checkout-input" />
                            </div>
                        </section>

                        <button
                            disabled={isProcessing}
                            className="w-full py-6 bg-primary text-background font-black uppercase tracking-[0.3em] text-xl hover:bg-white transition-all disabled:opacity-50 relative overflow-hidden"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" /> INITIALIZING...
                                </span>
                            ) : (
                                "AUTHORIZE PAYMENT"
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-foreground/20 uppercase tracking-widest">
                            <div className="flex items-center gap-2"><Lock size={10} /> SECURE_SSL</div>
                            <div className="flex items-center gap-2"><ShieldCheck size={10} /> PAYSTACK_VERIFIED</div>
                        </div>
                    </form>
                </motion.div>

                {/* Right: Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:sticky lg:top-32 h-fit space-y-8"
                >
                    <div className="bg-foreground/5 dark:bg-white/5 border border-foreground/10 p-8 space-y-8 backdrop-blur-md">
                        <h3 className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] border-b border-foreground/10 pb-4">ORDER_MANIFEST</h3>

                        <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                            {items.map(item => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-20 bg-foreground/10">
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-bold uppercase truncate max-w-[200px]">{item.title}</h4>
                                        <p className="text-[10px] font-mono text-foreground/40 uppercase">
                                            {item.selectedSize ? `SIZE: ${item.selectedSize} // ` : ""}QTY: {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-mono text-xs">{formatPrice(item.price * item.quantity, currency)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-foreground/10">
                            <div className="flex justify-between text-xs font-mono text-foreground/40">
                                <span>SUBTOTAL</span>
                                <span>{formatPrice(total(), currency)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono text-foreground/40">
                                <span>SHIPPING</span>
                                <span>{total() >= 2000 ? "COMPLIMENTARY" : formatPrice(150, currency)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black uppercase pt-4 border-t border-primary/20 text-primary">
                                <span>TOTAL</span>
                                <span>{formatPrice(total() >= 2000 ? total() : total() + 150, currency)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-foreground/5 text-center space-y-2">
                            <Truck className="mx-auto text-primary" size={24} />
                            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">PRIORITY DISPATCH</p>
                        </div>
                        <div className="p-4 border border-foreground/5 text-center space-y-2">
                            <Lock className="mx-auto text-primary" size={24} />
                            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">ENCRYPTED DATA</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .checkout-input {
                    width: 100%;
                    padding: 1rem;
                    background: rgba(var(--foreground), 0.05);
                    border: 1px solid rgba(var(--foreground), 0.1);
                    color: rgb(var(--foreground));
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    outline: none;
                    transition: all 0.2s;
                }
                .checkout-input:focus {
                    border-color: var(--primary);
                    background: rgba(var(--foreground), 0.08);
                }
            `}</style>
        </div>
    );
}
