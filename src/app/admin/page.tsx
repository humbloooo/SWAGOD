import AdminAnalytics from "@/components/admin/AdminAnalytics";
import Link from "next/link";

export default async function AdminPage() {
    return (
        <main className="pb-[60px] md:pb-[100px] pt-24 md:pt-32">
            <div className="container mx-auto px-4 md:px-6">
                <header className="mb-12 md:mb-20">
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 leading-none">
                        SWAGOD // <span className="text-primary italic">ADMIN</span>
                    </h1>
                    <p className="text-primary font-mono uppercase tracking-[0.2em] text-[10px] md:text-sm italic mb-12 md:mb-16">DASHBOARD CONTROL CENTER</p>

                    <AdminAnalytics />
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
                    <Link href="/admin/products" className="group relative p-6 md:p-10 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">01</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">STORE</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">PRODUCTS</p>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase">MANAGE SHOP ITEMS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            ENTER <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/archives" className="group relative p-6 md:p-10 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">02</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">STORIES</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">BLOG / EVENTS</p>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase">MANAGE BLOG CONTENT</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            VIEW <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/tour" className="group relative p-6 md:p-10 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">03</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">LOGISTICS</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">TOUR DATES</p>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase">GLOBAL SOURCING AND EVENTS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            MANAGE DATES <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/feedback" className="group relative p-6 md:p-10 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">04</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">COMMUNICATION</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">FEEDBACK</p>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase">CLIENT ENQUIRIES & REVIEWS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            VIEW INBOX <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/settings" className="group relative p-6 md:p-10 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">05</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">INFRASTRUCTURE</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">SETTINGS</p>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase">CORE SYSTEM CONFIGURATION</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            ACCESS CORE <span className="text-primary">→</span>
                        </div>
                    </Link>

                    <Link href="/admin/promos" className="group relative p-6 md:p-10 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-primary transition-colors text-[10px] md:text-sm">06</div>
                        <h3 className="font-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">MARKETING</h3>
                        <p className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 md:mb-2">PROMOS</p>
                        <p className="text-white/40 font-mono text-[8px] md:text-[10px] uppercase">CAMPAIGN AND OFFERS</p>
                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                            DEPLOY CAMPAIGN <span className="text-primary">→</span>
                        </div>
                    </Link>
                </div>

                <div className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-white/10">
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
                            <tbody className="text-white/60">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 md:py-6 font-mono">SWG_RTN_{100 * i}X</td>
                                        <td className="py-4 md:py-6 italic text-[7px] md:text-[10px] truncate max-w-[100px] md:max-w-none">USER_ACCOUNT_{i}@SWAGOD.COM</td>
                                        <td className="py-4 md:py-6">R {(500 + i * 123.45).toFixed(2)}</td>
                                        <td className="py-4 md:py-6 text-primary">
                                            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-primary/20 text-primary border border-primary/20 text-[7px] md:text-[10px] font-black glow-primary">
                                                SUCCESS
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
