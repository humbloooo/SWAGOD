import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";

export default function PolicyPage() {
    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    RETURNS <span className="text-primary">POLICY</span>
                </h1>
                <div className="space-y-8 text-foreground/80 font-mono text-sm tracking-widest leading-relaxed uppercase">
                    <p>WE ACCEPT RETURNS WITHIN 14 DAYS OF DELIVERY FOR MOST ITEMS IN NEW CONDITION.</p>
                    <ul className="list-inside space-y-4 border-l-2 border-primary pl-6">
                        <li>- ITEMS MUST BE UNWORN, UNWASHED, AND UNALTERED.</li>
                        <li>- ALL ORIGINAL TAGS AND PACKAGING MUST BE INTACT.</li>
                        <li>- FOOTWEAR MUST INCLUDE THE ORIGINAL SHOE BOX IN ITS ORIGINAL CONDITION.</li>
                        <li>- MERCH EXCLUSIVES AND LIMITED DROPS MAY BE SUBJECT TO FINAL SALE CONDITIONS.</li>
                    </ul>
                    <p className="mt-8 text-xs text-foreground/50 font-sans normal-case tracking-normal">Please note that original shipping fees are non-refundable, and return shipping costs are the responsibility of the customer unless the return is due to a defective product or an error on our part.</p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
