import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";

export default function ShippingPage() {
    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    SHIPPING <span className="text-primary">INFO</span>
                </h1>
                <div className="space-y-8 text-foreground/80 font-mono text-sm tracking-widest leading-relaxed uppercase">
                    <section className="bg-foreground/5 border border-foreground/10 p-8">
                        <h2 className="text-xl font-black text-primary mb-4 border-b border-foreground/10 pb-2">DOMESTIC ORDERS</h2>
                        <ul className="space-y-2">
                            <li>- STANDARD SHIPPING (3-5 BUSINESS DAYS)</li>
                            <li>- EXPRESS SHIPPING (1-2 BUSINESS DAYS)</li>
                            <li className="text-primary mt-4 font-bold">FREE STANDARD SHIPPING ON ORDERS OVER SPECIFIED AMOUNT.</li>
                        </ul>
                    </section>

                    <section className="bg-foreground/5 border border-foreground/10 p-8">
                        <h2 className="text-xl font-black text-primary mb-4 border-b border-foreground/10 pb-2">INTERNATIONAL ORDERS</h2>
                        <ul className="space-y-2">
                            <li>- WORLDWIDE DELIVERY AVAILABLE</li>
                            <li>- SHIPPING COSTS CALCULATED AT CHECKOUT BASED ON DESTINATION AND WEIGHT</li>
                            <li>- CUSTOMER IS RESPONSIBLE FOR ANY CUSTOMS DUTIES OR IMPORT TAXES</li>
                        </ul>
                    </section>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
