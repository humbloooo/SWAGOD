import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { Suspense } from "react";
import TourList from "@/components/tour/TourList";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export default function Tour() {
    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
                    Our {"//"} <span className="text-primary">Tours</span>
                </h1>

                <Suspense fallback={
                    <div className="space-y-8">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                    </div>
                }>
                    <TourList />
                </Suspense>

                <div className="mt-16 p-8 bg-foreground text-background">
                    <h3 className="text-2xl font-bold uppercase mb-4 text-primary">Sponsorships</h3>
                    <p className="max-w-2xl text-background/60 font-mono text-sm uppercase">
                        We partner with brands that share our vision of the future.
                        Contact us for event sponsorship opportunities.
                    </p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
