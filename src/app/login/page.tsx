"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading("google");
        try {
            await signIn("google", { callbackUrl: "/admin" }); // Default to admin, middleware handles redirect if not admin
        } catch (error) {
            toast.error("Google sign in failed");
        } finally {
            setIsLoading(null);
        }
    };

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("credentials");

        const res = await signIn("credentials", {
            username: email, // Changed from hardcoded "admin" to user input email
            password: password,
            redirect: false,
        });

        if (res?.error) {
            toast.error("Invalid credentials");
            setIsLoading(null);
        } else {
            router.push("/admin");
        }
    };

    return (
        <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
            <Header />
            <Navigation />

            <div className="flex-1 flex items-center justify-center p-6 z-10 pt-24">
                <div className="w-full max-w-md bg-white border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-center">
                        Welcome // <span className="text-primary">Back</span>
                    </h1>
                    <p className="text-gray-500 font-mono text-xs text-center mb-8 uppercase">
                        Secure Access Portal
                    </p>

                    <div className="space-y-6">
                        {/* Primary Login Form */}
                        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1 font-bold text-gray-500">Email</label>
                                <input
                                    type="text"
                                    value={email} // Using password state reused or need email state? Standard uses email.
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 border border-gray-300 px-4 font-mono text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1 font-bold text-gray-500">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 border border-gray-300 px-4 font-mono text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!!isLoading}
                                className="w-full h-12 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                            >
                                {isLoading === "credentials" ? <Loader2 className="animate-spin mx-auto" /> : "Login"}
                            </button>
                        </form>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-mono uppercase">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={!!isLoading}
                            className="w-full h-12 border border-black bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isLoading === "google" ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <span>Continue with Google</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="font-mono text-xs text-gray-500">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-black font-bold hover:text-primary underline decoration-2">
                                JOIN THE CULT
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black uppercase leading-none whitespace-nowrap">
                    SWAGOD
                </div>
            </div>
        </main>
    );
}
