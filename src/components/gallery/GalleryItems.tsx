import Image from "next/image";
import { getGalleries } from "@/lib/db";
import { Product } from "@/lib/types";

export default async function GalleryItems() {
    const galleries = await getGalleries();

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleries.map((item: Product) => (
                <div key={item.id} className="relative break-inside-avoid aspect-[3/4] bg-surface group overflow-hidden border border-white/5 hover:border-primary transition-colors">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover grayscale-0 hover:grayscale transition-all duration-700"
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
    );
}
