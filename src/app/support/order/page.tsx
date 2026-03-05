import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";

export default function OrderSupportPage() {
    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    HOW TO PLACE AN <span className="text-primary">ORDER</span>
                </h1>
                <div className="space-y-6 text-foreground/80 font-mono text-sm uppercase tracking-widest leading-relaxed">
                    <p>
                        01. BROWSE OUR INVENTORY AND SELECT YOUR DESIRED ITEMS.<br />
                        02. CHOOSE YOUR SIZE AND ADD ITEMS TO YOUR CART.<br />
                        03. PROCEED TO CHECKOUT TO ENTER YOUR SHIPPING DETAILS.<br />
                        04. COMPLETE PAYMENT SECURELY USING OUR GATEWAY.<br />
                        05. RECEIVE YOUR CONFIRMATION EMAIL WITH TRACKING DETAILS.
                    </p>
                    <p className="mt-8 text-xs text-foreground/40 italic">ALL TRANSACTIONS ARE ENCRYPTED AND SECURE.</p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
