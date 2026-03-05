import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    const settings = await getSettings();
    const contact = settings?.contactInfo;

    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    CONTACT <span className="text-primary">US</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono uppercase tracking-widest">
                    <div className="bg-foreground/5 p-8 border border-foreground/10 flex flex-col items-center justify-center text-center hover:border-primary transition-all">
                        <span className="text-primary mb-4 block font-black border-b border-primary/30 pb-2">SUPPORT EMAIL</span>
                        <a href={`mailto:${contact?.email || 'SUPPORT@SWAGOD.COM'}`} className="hover:text-primary transition-colors text-sm break-all">
                            {contact?.email || "SUPPORT@SWAGOD.COM"}
                        </a>
                    </div>

                    <div className="bg-foreground/5 p-8 border border-foreground/10 flex flex-col items-center justify-center text-center hover:border-primary transition-all">
                        <span className="text-primary mb-4 block font-black border-b border-primary/30 pb-2">PHONE DIRECTORY</span>
                        <p className="text-sm">
                            {contact?.phone || "UNAVAILABLE"}
                        </p>
                    </div>

                    <div className="bg-foreground/5 p-8 border border-foreground/10 flex flex-col items-center justify-center text-center md:col-span-2 hover:border-primary transition-all">
                        <span className="text-primary mb-4 block font-black border-b border-primary/30 pb-2">PHYSICAL ADDRESS</span>
                        <p className="text-sm">
                            {contact?.address || "HQ LOCATION WITHHELD"}
                        </p>
                    </div>

                    <div className="bg-foreground/5 p-8 border border-foreground/10 flex flex-col items-center justify-center text-center md:col-span-2 hover:border-primary transition-all">
                        <span className="text-primary mb-4 block font-black border-b border-primary/30 pb-2">OPERATING HOURS</span>
                        <p className="text-sm">
                            {contact?.hours || "MON-FRI: 9AM - 5PM"}
                        </p>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
