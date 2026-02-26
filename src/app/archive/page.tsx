import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import { getArchives } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Archive() {
    const archives = await getArchives();

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
                    The // <span className="text-primary">Archive</span>
                </h1>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {archives.map((item: any) => (
                        <div key={item.id} className="relative break-inside-avoid aspect-[3/4] bg-surface group overflow-hidden border border-white/5 hover:border-primary transition-colors">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-sm pointer-events-none p-6">
                                <div className="text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="block font-black text-white text-xl uppercase mb-2 tracking-tighter drop-shadow-md">{item.title}</span>
                                    <p className="text-white/60 font-mono text-xs uppercase tracking-widest">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="font-mono text-sm animate-pulse">
                        <span className="text-primary">TAG US @SWAGOD</span> <span className="text-gray-500">TO BE FEATURED</span>
                    </p>
                </div>
            </div>
            <Navigation />
        </main>
    );
}
