import { getProducts } from "@/lib/db";
import LatestDrops from "@/components/ui/LatestDrops";
import { SiteSettings } from "@/lib/types";

export default async function HomeLatestDrops({ settings }: { settings: SiteSettings | null }) {
    const limit = settings?.latestDropsLimit || 7;
    const productsResult = await getProducts(limit);
    const products = productsResult.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return (
        <LatestDrops
            products={products}
            featuredCategory={settings?.featuredCategory}
            latestDropsLimit={settings?.latestDropsLimit}
        />
    );
}
