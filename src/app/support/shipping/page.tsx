import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-background relative flex flex-col font-sans pt-24">
            <Header />
            <Navigation />
            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 py-32 gap-8 text-center bg-background">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                    COMING SOON //
                </h1>
                <p className="font-mono text-foreground/50 max-w-lg leading-relaxed uppercase">
                    This sector is currently being decrypted. Check back later for updates to our policies and information.
                </p>
            </div>
            
        </main>
    );
}
