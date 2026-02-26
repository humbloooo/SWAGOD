import Hero from "@/components/Hero";
import LatestDrops from "@/components/LatestDrops";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import About from "@/components/About";
import BackToTop from "@/components/BackToTop";
import FeedbackForm from "@/components/FeedbackForm";
import BackgroundBrackets from "@/components/BackgroundBrackets";
import { getProducts, getAbout, getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allProducts = await getProducts();
  const aboutData = await getAbout();
  const settings = await getSettings();

  // Top Newest Releases (Dynamic Limit, default 7)
  const limit = settings?.latestDropsLimit || 7;

  // Sort by createdAt desc (newest first). Fallback to empty string if undefined.
  // Sort by createdAt desc (newest first). Fallback to empty string if undefined.
  const products = allProducts
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  // .slice(0, limit); // MOVED SLICING TO COMPONENT PER CATEGORY

  return (
    <main className="min-h-screen pb-[60px] bg-background">
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
