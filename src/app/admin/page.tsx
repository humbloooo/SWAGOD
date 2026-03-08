import AdminAnalytics from "@/components/admin/AdminAnalytics";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";

export default async function AdminPage() {
    await dbConnect();
    const recentTransactions = await Transaction.find()
        .sort({ timestamp: -1 })
        .limit(8);

    return (
        <main className="pb-[60px] md:pb-[100px] pt-24 md:pt-32">
            <div className="container mx-auto px-4 md:px-6">
                <header className="mb-12 md:mb-20">
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 leading-none">
                        SWAGOD // <span className="text-primary italic">ADMIN</span>
                    </h1>
                    <p className="text-primary font-mono uppercase tracking-[0.2em] text-[10px] md:text-sm italic mb-12 md:mb-16">WEBSITE CONTROL CENTER</p>

                    <AdminAnalytics />
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
                    <Link href="/admin/products" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">01</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">STORE</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">PRODUCTS</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">MANAGE SHOP ITEMS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            ENTER <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/gallery" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">02</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">BRAND</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">GALLERY</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">MANAGE BRAND VISUALS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            VIEW <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/tour" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">03</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">OPERATIONS</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">TOUR DATES</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">GLOBAL SOURCING AND EVENTS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            MANAGE DATES <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/feedback" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">04</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">COMMUNICATION</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">FEEDBACK</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">CLIENT ENQUIRIES & REVIEWS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            VIEW INBOX <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/about" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">05</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">IDENTITY</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">ABOUT US</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">MANAGE BRAND STORY</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            EDIT STORY <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/settings" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">06</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">CONFIGURATION</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">SETTINGS</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">WEBSITE SETTINGS & DATA</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            ACCESS CORE <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/promos" className="group relative p-6 md:p-10 border border-foreground/10 bg-foreground/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-foreground/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">07</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">MARKETING</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">PROMOS</p>
                        <p className="text-foreground/40 font-mono text-[8px] md:text-[10px] uppercase">CAMPAIGN AND OFFERS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            DEPLOY CAMPAIGN <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/developer" className="group relative p-6 md:p-10 border border-red-500/20 bg-red-500/5 backdrop-blur-md hover:border-red-500 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-red-500/10 group-hover:text-red-500 transition-colors text-[10px] md:text-sm">99</div>
                        <h3 className="font-mono text-red-500 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">DANGER_ZONE</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2 text-red-500">ROOT_ACCESS</p>
                        <p className="text-red-500/40 font-mono text-[8px] md:text-[10px] uppercase">TECHNICAL LOGS & MONITORING</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all text-red-500">
                            INITIALIZE <span className="text-red-500">→</span>
                        </div>
                    </Link>
                </div>

                <div className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-foreground/10">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 md:mb-10 glitch-hover inline-block">RECENT TRANSACTIONS</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[8px] md:text-xs uppercase tracking-widest">
                            <thead>
                                <tr className="border-b border-primary/30 text-primary">
                                    <th className="py-4 md:py-6 font-black">REFERENCE_ID</th>
                                    <th className="py-4 md:py-6 font-black">CUSTOMER</th>
                                    <th className="py-4 md:py-6 font-black">AMOUNT</th>
                                    <th className="py-4 md:py-6 font-black">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="text-foreground/60">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((tx) => (
                                        <tr key={tx._id.toString()} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors group">
                                            <td className="py-4 md:py-6 font-mono">{tx.orderId}</td>
                                            <td className="py-4 md:py-6 italic text-[7px] md:text-[10px] truncate max-w-[100px] md:max-w-none">{tx.customerEmail}</td>
                                            <td className="py-4 md:py-6">R {tx.amount.toFixed(2)}</td>
                                            <td className="py-4 md:py-6">
                                                <span className={`px-2 md:px-3 py-0.5 md:py-1 border text-[7px] md:text-[10px] font-black ${tx.status === 'success' ? 'bg-primary/20 text-primary border-primary/20 glow-primary' : 'bg-red-500/20 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {tx.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-foreground/20 italic">
                                            NO_TRANSACTIONS_RECORDED
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    );
}
