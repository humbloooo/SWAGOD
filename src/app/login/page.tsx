"use client";

import { signIn } from "next-auth/react"; // Client side sign in
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleAdminLogin = () => {
        signIn("credentials", { callbackUrl: "/admin" });
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8 border border-black p-8 bg-surface">
                    <div className="text-center">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                            SWAGOD // ID
                        </h1>
                        <p className="font-mono text-gray-500 text-sm">
                            PLEASE SELECT YOUR ACCESS LEVEL
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleAdminLogin}
                            className="w-full py-6 bg-black text-white font-bold uppercase tracking-widest hover:bg-primary transition-colors border border-black group relative overflow-hidden"
                        >
                            <span className="relative z-10">Administrator</span>
                            <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                        </button>

                        <div className="relative flex items-center justify-center">
                            <span className="bg-surface px-4 text-xs font-mono text-gray-400 uppercase">Or</span>
                            <div className="absolute inset-0 border-t border-gray-200 -z-10" />
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-6 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors border border-black"
                        >
                            Customer (Google)
                        </button>
                    </div>

                    <div className="text-center pt-4">
                        <a href="/" className="text-xs font-mono text-gray-400 hover:text-black uppercase border-b border-transparent hover:border-black transition-colors">
                            Return to Store
                        </a>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
