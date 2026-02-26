import Hero from "@/components/ui/Hero";
import LatestDrops from "@/components/ui/LatestDrops";
import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import About from "@/components/ui/About";
import BackToTop from "@/components/ui/BackToTop";
import FeedbackForm from "@/components/ui/FeedbackForm";
import BackgroundBrackets from "@/components/ui/BackgroundBrackets";
import { getProducts, getAbout, getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const aboutData = await getAbout();
  const settings = await getSettings();

  // Top Newest Releases (Dynamic Limit, default 7)
  const limit = settings?.latestDropsLimit || 7;
  const productsResult = await getProducts(limit);

  // Sort by createdAt desc (newest first). Fallback to empty string if undefined.
  const products = productsResult
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return (
    <main id="main-content" className="min-h-screen pb-[60px] bg-background">
      <Header />
      <BackgroundBrackets />
      <Hero heroImage={settings?.heroImage} />
      <About data={aboutData} />
      <LatestDrops products={products} />
      <FeedbackForm />
      <Navigation />
      <BackToTop />
    </main>
  );
}
