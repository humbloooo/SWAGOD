import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";

export default function ReturnsPage() {
    return (
        <main className="min-h-screen pb-[60px] bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 mb-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                    LOG A <span className="text-primary">RETURN</span>
                </h1>
                <div className="space-y-8 text-foreground/80 font-mono text-sm tracking-widest leading-relaxed">
                    <p className="uppercase">TO LOG A RETURN, PLEASE ENSURE YOUR ITEM MEETS OUR RETURN CONDITIONS. ITEMS MUST BE UNWORN, UNWASHED, AND HAVE ORIGINAL TAGS ATTACHED.</p>

                    <div className="border border-foreground/10 bg-foreground/5 p-8 mt-8">
                        <h2 className="text-xl font-black uppercase mb-6 text-primary border-b border-foreground/10 pb-4">RETURN AUTHORIZATION FORM</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-foreground/50 font-bold">ORDER NUMBER</label>
                                    <input type="text" className="w-full bg-background border border-foreground/10 p-4 outline-none focus:border-primary transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-foreground/50 font-bold">EMAIL ADDRESS</label>
                                    <input type="email" className="w-full bg-background border border-foreground/10 p-4 outline-none focus:border-primary transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase text-foreground/50 font-bold">REASON FOR RETURN</label>
                                <textarea className="w-full bg-background border border-foreground/10 p-4 outline-none focus:border-primary transition-all h-32 resize-none"></textarea>
                            </div>
                            <button type="button" className="w-full py-4 bg-primary text-background font-black uppercase tracking-widest hover:bg-foreground transition-all">
                                REQUEST AUTHORIZATION
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
