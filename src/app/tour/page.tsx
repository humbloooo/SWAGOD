import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

import Link from "next/link";
import { getTours } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Tour() {
    const tours = await getTours();

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
                    Our // <span className="text-primary">Tours</span>
                </h1>

                <div className="space-y-8">
                    {tours.map((tour) => (
                        <div key={tour.id} className="border-b border-black py-8 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-surface transition-colors px-4 group">
                            <div>
                                <span className="block text-sm font-mono text-gray-500 mb-2">{tour.date}</span>
                                <h3 className="text-4xl font-bold uppercase group-hover:text-primary transition-colors">
                                    {tour.city} // {tour.venue}
                                </h3>
                            </div>

                            {tour.soldOut ? (
                                <span className="mt-4 md:mt-0 px-6 py-2 border border-red-500 text-red-500 font-bold cursor-not-allowed uppercase text-sm rotate-3">
                                    Sold Out
                                </span>
                            ) : (
                                <Link
                                    href={tour.ticketLink || "#"}
                                    target={tour.ticketLink ? "_blank" : undefined}
                                    className="mt-4 md:mt-0 px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase font-bold text-sm"
                                >
                                    Get Tickets
                                </Link>
                            )}
                        </div>
                    ))}

                    {tours.length === 0 && (
                        <div className="py-24 text-center border-y border-dashed border-gray-300">
                            <h3 className="text-xl font-bold uppercase text-gray-400">No Upcoming Dates</h3>
                            <p className="font-mono text-sm text-gray-400 mt-2">Check back soon for new announcements.</p>
                        </div>
                    )}
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
