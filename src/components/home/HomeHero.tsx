import Hero from "@/components/ui/Hero";
import { SiteSettings } from "@/lib/types";

export default function HomeHero({ settings }: { settings: SiteSettings | null }) {
    return (
        <Hero
            heroImage={settings?.heroImage}
            lightModeWallpaper={settings?.lightModeWallpaper}
            heroSlogan={settings?.heroSlogan}
        />
    );
}
