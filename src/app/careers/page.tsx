import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";

export default function CareersPage() {
    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    CAREERS & <span className="text-primary">OPPORTUNITIES</span>
                </h1>
                <div className="space-y-8 text-foreground/80 font-mono text-sm tracking-widest leading-relaxed uppercase">
                    <p>WE ARE ALWAYS LOOKING FOR INNOVATIVE MINDS TO JOIN THE SWAGOD SYNDICATE.</p>

                    <div className="bg-foreground/5 p-8 border border-foreground/10 text-center">
                        <h2 className="text-2xl font-black mb-4">NO ACTIVE OPENINGS</h2>
                        <p className="text-xs text-foreground/50">WHILE WE DON&apos;T HAVE ANY OPEN POSITIONS RIGHT NOW, YOU CAN SEND YOUR PORTFOLIO TO CAREERS@SWAGOD.COM</p>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
