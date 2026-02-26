"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LikeButtonProps {
    productId: string;
    initialLikes?: string[];
    variant?: "compact" | "full";
}

export default function LikeButton({ productId, initialLikes = [], variant = "compact" }: LikeButtonProps) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState<string[]>(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.email) {
            setIsLiked(likes.includes(session.user.email));
        }
    }, [session, likes]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error("SIGN IN REQUIRED", {
                description: "PLEASE LOG IN TO SAVE THIS PRODUCT.",
                className: "font-mono",
            });
            signIn("google");
            return;
        }

        const userEmail = session.user?.email;
        if (!userEmail || loading) return;

        setLoading(true);
        const newIsLiked = !isLiked;

        // Optimistic UI
        setIsLiked(newIsLiked);
        if (newIsLiked) {
            setLikes(prev => [...prev, userEmail]);
        } else {
            setLikes(prev => prev.filter(email => email !== userEmail));
        }

        try {
            const res = await fetch(`/api/products/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, action: newIsLiked ? "like" : "unlike" }),
            });

            if (!res.ok) throw new Error("Sync failed");

            toast.success(newIsLiked ? "PRODUCT SAVED" : "REMOVED FROM SAVED", {
                description: productId.substring(0, 8),
                className: "font-mono uppercase",
            });
        } catch {
            // Revert on error
            setIsLiked(!newIsLiked);
            toast.error("SYNC ERROR", { description: "FAILED TO UPDATE SAVED STATE." });
        } finally {
            setLoading(false);
        }
    };

    if (variant === "full") {
        return (
            <button
                onClick={handleLike}
                disabled={loading}
                className={cn(
                    "flex-1 py-4 border font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3",
                    isLiked
                        ? "bg-primary text-white border-primary glow-primary"
                        : "bg-white/5 text-white border-white/10 hover:border-primary"
                )}
            >
                <Heart size={14} className={cn("transition-transform duration-300", isLiked && "fill-current scale-110")} />
                {isLiked ? "SAVED" : "SAVE"}
                {likes.length > 0 && <span className="opacity-40 ml-1">[{likes.length}]</span>}
            </button>
        );
    }

    return (
        <button
            onClick={handleLike}
            className="flex items-center gap-2 group"
            aria-label="Save Item"
        >
            <div className={cn(
                "p-2 rounded-full border transition-all duration-300",
                isLiked
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-black/40 border-white/10 text-white/40 group-hover:border-primary group-hover:text-primary"
            )}>
                <Heart size={16} className={cn(isLiked && "fill-current")} />
            </div>
            {likes.length > 0 && (
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-tighter">
                    {likes.length} SAVED
                </span>
            )}
        </button>
    );
}
