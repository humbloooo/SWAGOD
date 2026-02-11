import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function Tour() {
    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
                    Our // <span className="text-primary">Tours</span>
                </h1>

                <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b border-black py-8 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-surface transition-colors px-4">
                            <div>
                                <span className="block text-sm font-mono text-gray-500 mb-2">2026 / 0{i + 2} / 1{i}</span>
                                <h3 className="text-4xl font-bold uppercase">City {i} // Venue {i}</h3>
                            </div>
                            <button className="mt-4 md:mt-0 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase font-bold text-sm">
                                View Line Up
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-black text-white">
                    <h3 className="text-2xl font-bold uppercase mb-4 text-primary">Sponsorships</h3>
                    <p className="max-w-2xl text-gray-400">
                        We partner with brands that share our vision of the future.
                        Contact us for event sponsorship opportunities.
                    </p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
