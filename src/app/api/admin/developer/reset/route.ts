import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import SiteSettings from "@/lib/models/SiteSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Delete all products
        await Product.deleteMany({});

        // 2. Reset site settings to defaults
        // We delete the existing main settings and it will be recreated with schema defaults next time it's fetched or we can force it now
        await SiteSettings.deleteOne({ _id: 'main' });

        const defaultSettings = new SiteSettings({
            _id: 'main',
            heroSlogan: "LUXURY STREETWEAR // BORN IN SA",
            footerText: "© 2026 SWAGOD. ALL RIGHTS RESERVED.",
            footerAboutText: "We're a local streetwear brand, born in SA, inspired by Hip-Hop and local streetwear.",
            marqueeText: "WORLDWIDE SHIPPING // NEW DROP AVAILABLE // SWAGOD CLASSICS",
            showMarquee: false,
            showSocials: true,
            featuredCategory: "all",
            marqueeSettings: {
                speed: 20,
                direction: "left",
                colors: { bg: "#ff6400", text: "#ffffff" }
            },
            psychologyTriggers: {
                scarcity: { enabled: true, stockThreshold: 5, text: "ONLY {count} LEFT IN STOCK" },
                urgency: { enabled: true, expiryMinutes: 15, text: "OFFER EXPIRES IN {time}" },
                socialProof: { enabled: true, minLikes: 10, recentPurchaseInterval: 24 }
            }
        });

        await defaultSettings.save();

        return NextResponse.json({ success: true, message: "System factory reset completed successfully." });
    } catch (error) {
        console.error("Factory reset failed:", error);
        return NextResponse.json({ error: "System Error: Factory reset failed" }, { status: 500 });
    }
}
