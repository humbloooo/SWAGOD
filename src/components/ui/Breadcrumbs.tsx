"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
    const pathname = usePathname();
    if (pathname === "/") return null;

    const paths = pathname.split("/").filter(Boolean);

    return (
        <nav className="container mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-mono uppercase text-gray-400">
            <Link href="/" className="hover:text-black transition-colors">HOME</Link>
            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join("/")}`;
                const isLast = index === paths.length - 1;

                return (
                    <div key={path} className="flex items-center gap-2">
                        <ChevronRight size={10} />
                        {isLast ? (
                            <span className="text-black font-bold">{path.replace("-", " ")}</span>
                        ) : (
                            <Link href={href} className="hover:text-black transition-colors">
                                {path.replace("-", " ")}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
