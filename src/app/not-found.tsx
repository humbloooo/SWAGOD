import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - ENTITY_NOT_FOUND',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.1),transparent)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-none mb-4 animate-pulse">
                    <span className="text-primary italic">4</span>0<span className="text-primary italic">4</span>
                </h1>

                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2">
                    ENTITY_NOT_FOUND
                </h2>

                <p className="font-mono text-sm md:text-base uppercase tracking-[0.3em] mb-12 text-white/40">
                    // SIGNAL_LOST IN THE MAINFRAME
                </p>

                <Link href="/" className="px-10 py-5 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                    RETURN TO BASE
                </Link>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-1/4 left-10 font-mono text-[8px] text-white/10 uppercase tracking-widest vertical-text hidden md:block">
                ERR_CODE: 404_VOID
            </div>
            <div className="absolute bottom-1/4 right-10 font-mono text-[8px] text-white/10 uppercase tracking-widest vertical-text hidden md:block">
                SECTOR: UNKNOWN
            </div>
        </div>
    );
}
