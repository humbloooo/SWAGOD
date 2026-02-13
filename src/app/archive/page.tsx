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
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
                    The // <span className="text-primary">Archive</span>
                </h1>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {archives.map((item: any) => (
                        <div key={item.id} className="relative break-inside-avoid aspect-[3/4] bg-surface group overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                                <p className="text-white font-mono text-center px-4">
                                    <span className="block font-bold mb-2">{item.title}</span>
                                    {item.description}
                                </p>
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
