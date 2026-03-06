"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-foreground/5 relative overflow-hidden",
                "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-foreground/5 after:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export function ProductSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    );
}
