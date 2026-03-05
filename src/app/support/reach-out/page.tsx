import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import FeedbackForm from "@/components/ui/FeedbackForm";

export default function ReachOutPage() {
    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-10 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-center">
                    REACH <span className="text-primary">OUT</span>
                </h1>
                <p className="text-foreground/50 font-mono text-xs uppercase tracking-widest text-center mb-12">
                    WE VALUE YOUR FEEDBACK, INQUIRIES, AND COLLABORATION PROPOSALS.
                </p>
            </div>

            <div className="relative z-10 scale-95 md:scale-100 transform origin-top">
                <FeedbackForm />
            </div>

            <Navigation />
        </main>
    );
}
