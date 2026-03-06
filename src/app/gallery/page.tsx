import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { Suspense } from "react";
import GalleryItems from "@/components/gallery/GalleryItems";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export default async function Gallery() {
    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
                    The {"//"} <span className="text-primary">Gallery</span>
                </h1>

                <Suspense fallback={
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="aspect-[3/4] w-full" />
                        ))}
                    </div>
                }>
                    <GalleryItems />
                </Suspense>

                <div className="mt-12 text-center">
                    <p className="font-mono text-sm animate-pulse">
                        <span className="text-primary">TAG US @SWAGOD</span> <span className="text-gray-500">TO BE FEATURED</span>
                    </p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
