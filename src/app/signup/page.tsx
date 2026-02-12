"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
// We need to implement the actual registration logic using Firebase Client SDK
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = () => {
        setIsLoading('google');
        signIn("google", { callbackUrl: "/" });
    };

    const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading('email');
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(null);
            return;
        }

        try {
            // 1. Create User in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Update Profile Display Name
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
            }

            // 3. User is created. authenticating with NextAuth? 
            // Since we are using CredentialsProvider for "email" logic in NextAuth, 
            // we can try to sign them in immediately.
            // However, NextAuth Credentials typically verifies against a backend.
            // If we use Firebase Adapter, we should use 'email' provider (magic link) OR 
            // we use the credentials provider that verifies the token.

            // SIMPLER APPROACH FOR NOW:
            // Just redirect to login and ask them to sign in? 
            // OR auto-login via signIn('credentials', { ... }) 
            // But our credentials provider currently only supports "admin".

            // To make this work properly, we need to update src/auth.ts to 
            // allow verifying firebase users or standard credentials.

            toast.success("Account created successfully!");

            // For now, redirect to login
            router.push('/login');

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create account");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8 border border-black p-8 bg-surface">
                    <div className="text-center">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                            CREATE ACCOUNT
                        </h1>
                        <p className="font-mono text-gray-500 text-sm">
                            JOIN THE FUTURE OF STREETWEAR
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 text-xs font-mono text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <input
                                name="name"
                                type="text"
                                placeholder="FULL NAME"
                                required
                                className="w-full p-4 bg-transparent border border-black font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:bg-black focus:text-white transition-colors"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                required
                                className="w-full p-4 bg-transparent border border-black font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:bg-black focus:text-white transition-colors"
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="PASSWORD"
                                required
                                minLength={6}
                                className="w-full p-4 bg-transparent border border-black font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:bg-black focus:text-white transition-colors"
                            />
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="CONFIRM PASSWORD"
                                required
                                minLength={6}
                                className="w-full p-4 bg-transparent border border-black font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:bg-black focus:text-white transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!!isLoading}
                            className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-primary transition-colors border border-black disabled:opacity-50"
                        >
                            {isLoading === 'email' ? 'CREATING...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <div className="relative flex items-center justify-center">
                        <span className="bg-surface px-4 text-xs font-mono text-gray-400 uppercase">Or</span>
                        <div className="absolute inset-0 border-t border-gray-200 -z-10" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={!!isLoading}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors border border-black disabled:opacity-50"
                    >
                        {isLoading === 'google' ? 'REDIRECTING...' : 'SIGN UP WITH GOOGLE'}
                    </button>

                    <div className="text-center pt-2">
                        <span className="text-xs font-mono text-gray-400 uppercase">
                            ALREADY HAVE AN ACCOUNT? <Link href="/login" className="text-black border-b border-black hover:bg-black hover:text-white transition-colors">LOGIN</Link>
                        </span>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
