"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { AboutData } from "@/lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [aboutData, setAboutData] = useState<AboutData | null>(null);

    useEffect(() => {
        fetch("/api/about")
            .then(res => res.json())
            .then(data => setAboutData(data))
            .catch(err => console.error("Failed to load about data", err));
    }, []);

    const handleGoogleSignIn = async () => {
        setIsLoading("google");
        try {
            await signIn("google", { callbackUrl: "/admin" }); // Default to admin, middleware handles redirect if not admin
        } catch {
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

            <div className="absolute top-24 left-4 md:left-8 z-[60]">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-foreground/60 hover:text-foreground hover:-translate-x-1 transition-all uppercase font-mono text-xs tracking-widest font-bold">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 pt-32 pb-32 gap-8 max-w-lg mx-auto w-full">
                {/* Form Section */}
                <div className="w-full max-w-md bg-background border border-foreground p-8 shadow-[8px_8px_0px_0px_var(--foreground)] transition-colors">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-center">
                        Welcome // <span className="text-primary">Back</span>
                    </h1>
                    <p className="text-foreground/50 font-mono text-xs text-center mb-8 uppercase">
                        Secure Access Portal
                    </p>

                    <div className="space-y-6">
                        {/* Primary Login Form */}
                        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1 font-bold text-foreground/50">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-background border border-foreground/30 px-4 font-mono text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all placeholder:text-foreground/20"
                                    placeholder="Enter your email"
                                    suppressHydrationWarning
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase mb-1 font-bold text-foreground/50">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 bg-background border border-foreground/30 px-4 pr-12 font-mono text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all placeholder:text-foreground/20"
                                        placeholder="••••••••"
                                        suppressHydrationWarning
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!!isLoading}
                                className="w-full h-12 bg-foreground text-background font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors border border-foreground"
                            >
                                {isLoading === "credentials" ? <Loader2 className="animate-spin mx-auto" /> : "Login"}
                            </button>
                        </form>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-foreground/20"></div>
                            <span className="flex-shrink-0 mx-4 text-foreground/40 text-xs font-mono uppercase">OR</span>
                            <div className="flex-grow border-t border-foreground/20"></div>
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={!!isLoading}
                            className="w-full h-12 border border-foreground bg-background text-foreground font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 group"
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
                        <p className="font-mono text-xs text-foreground/50">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-foreground font-bold hover:text-primary underline decoration-2">
                                JOIN THE CULT
                            </Link>
                        </p>
                    </div>
                </div>

                {/* About Us Section */}
                <div className="w-full max-w-md mx-auto md:mx-0 bg-background/50 border border-foreground/10 p-8 md:p-12 text-center md:text-left backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-6 -right-6 text-foreground/5 pointer-events-none">
                        <span className="text-9xl font-black">S</span>
                    </div>
                    {aboutData ? (
                        <>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-foreground">{aboutData.heading || "ABOUT SWAGOD"}</h2>
                            <div className="space-y-4 mb-6">
                                {aboutData.paragraphs?.map((p, i) => (
                                    <p key={i} className="font-mono text-[10px] md:text-xs text-foreground/60 leading-relaxed uppercase tracking-widest text-justify">
                                        {p}
                                    </p>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-foreground/10 flex justify-between items-center text-foreground/40 font-mono text-[10px]">
                                <span>{aboutData.footer?.split(' // ')[0] || "EST. 2026"}</span>
                                <span>{aboutData.footer?.split(' // ')[1] || "WORLDWIDE"}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-foreground/50 gap-4 py-12">
                            <Loader2 className="animate-spin w-8 h-8" />
                            <span className="font-mono text-[10px] uppercase tracking-widest">DECRYPTING ARCHIVES...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Elements - Responsive Animated Watermarks */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: (i * 15) + "%",
                            y: (i * 15) + "%",
                            rotate: i * 45
                        }}
                        animate={{
                            x: [
                                ((i * 15) % 100) + "%",
                                ((i * 35) % 100) + "%",
                                ((i * 15) % 100) + "%"
                            ],
                            y: [
                                ((i * 25) % 100) + "%",
                                ((i * 55) % 100) + "%",
                                ((i * 25) % 100) + "%"
                            ],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 25 + (i * 5),
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute text-[8vw] font-black uppercase whitespace-nowrap text-foreground select-none"
                    >
                        SWAGOD
                    </motion.div>
                ))}
            </div>
        </main >
    );
}
