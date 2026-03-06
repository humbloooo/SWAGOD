import { getTours } from "@/lib/db";
import Link from "next/link";
import NotifyButton from "@/components/ui/NotifyButton";

export default async function TourList() {
    const tours = await getTours();

    if (tours.length === 0) {
        return (
            <div className="py-24 text-center border-y border-dashed border-foreground/20">
                <h3 className="text-xl font-bold uppercase text-foreground/40">No Upcoming Dates</h3>
                <p className="font-mono text-sm text-foreground/30 mt-2 uppercase">Check back soon for new announcements.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {tours.map((tour) => (
                <div key={tour.id} className="border-b border-foreground/10 py-8 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-foreground/5 transition-colors px-4 group">
                    <div>
                        <span className="block text-sm font-mono text-foreground/40 mb-2 uppercase">{tour.date}</span>
                        <h3 className="text-4xl font-bold uppercase group-hover:text-primary transition-colors">
                            {tour.city} {"//"} {tour.venue}
                        </h3>
                    </div>

                    {tour.soldOut ? (
                        <NotifyButton city={tour.city} />
                    ) : (
                        <Link
                            href={tour.ticketLink || "#"}
                            target={tour.ticketLink ? "_blank" : undefined}
                            className="mt-4 md:mt-0 px-8 py-3 bg-foreground text-background font-black text-xs tracking-[0.2em] hover:bg-primary transition-colors uppercase border border-foreground glow-primary"
                        >
                            Get Tickets
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}
