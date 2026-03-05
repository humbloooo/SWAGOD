"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { AboutData } from "@/lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

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
        <main className="min-h-screen bg-background relative flex flex-col font-sans">
            <Header />
            <Navigation />

            <div className="absolute top-24 left-4 md:left-8 z-[60]">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-foreground/60 hover:text-foreground hover:-translate-x-1 transition-all uppercase font-mono text-xs tracking-widest font-bold">
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            <div id="login-container" className="flex-1 relative flex flex-col items-center justify-center p-6 z-10 pt-32 pb-32 gap-8 w-full overflow-hidden">
                {/* Background Elements - Responsive Animated Watermarks */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {[...Array(4)].map((_, i) => (
                        <BouncingLogo key={i} />
                    ))}
                </div>
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
            <Footer />
        </main >
    );
}

const BouncingLogo = () => {
    const logoRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const vel = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Hydration safety
        pos.current = {
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 100)
        };
        vel.current = {
            x: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5),
            y: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5)
        };

        let animationFrameId: number;

        const animate = () => {
            if (logoRef.current) {
                const rect = logoRef.current.getBoundingClientRect();

                // Update position
                pos.current.x += vel.current.x;
                pos.current.y += vel.current.y;

                const container = document.getElementById('login-container');
                if (!container) return;
                const containerRect = container.getBoundingClientRect();

                if (pos.current.x <= 0) {
                    vel.current.x *= -1;
                    pos.current.x = 0;
                } else if (pos.current.x + rect.width >= containerRect.width) {
                    vel.current.x *= -1;
                    pos.current.x = containerRect.width - rect.width;
                }

                if (pos.current.y <= 0) {
                    vel.current.y *= -1;
                    pos.current.y = 0;
                } else if (pos.current.y + rect.height >= containerRect.height) {
                    vel.current.y *= -1;
                    pos.current.y = containerRect.height - rect.height;
                }

                logoRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div
            ref={logoRef}
            className="absolute top-0 left-0 text-[10vw] md:text-[8vw] font-black uppercase whitespace-nowrap text-foreground select-none opacity-[0.03]"
            style={{ willChange: 'transform' }}
        >
            SWAGOD
        </div>
    );
};
