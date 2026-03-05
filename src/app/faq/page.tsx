import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
    const settings = await getSettings();
    const faqs = settings?.faqItems || [
        { question: "WHAT IS SWAGOD?", answer: "A PREMIUM LUXURY STREETWEAR BRAND." },
        { question: "DO YOU SHIP INTERNATIONALLY?", answer: "YES. RATES APPLY AT CHECKOUT." },
        { question: "HOW DO I TRACK MY ORDER?", answer: "USE THE TRACKING PAGE UNDER SUPPORT." }
    ];

    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
                </h1>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-foreground/5 p-8 border border-foreground/10">
                            <h3 className="font-black uppercase tracking-widest text-lg mb-4 text-primary font-mono select-none">
                                Q: {faq.question}
                            </h3>
                            <p className="font-mono text-sm text-foreground/80 uppercase tracking-widest leading-relaxed">
                                A: {faq.answer}
                            </p>
                        </div>
                    ))}

                    {faqs.length === 0 && (
                        <div className="text-center p-12 bg-foreground/5 border border-foreground/10">
                            <p className="font-mono text-xs text-foreground/50 uppercase tracking-widest">NO FAQS CONFIGURED YET.</p>
                        </div>
                    )}
                </div>
            </div>
            <Navigation />
        </main>
    );
}
