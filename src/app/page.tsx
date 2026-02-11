import Hero from "@/components/Hero";
import LatestDrops from "@/components/LatestDrops";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import About from "@/components/About";
import BackToTop from "@/components/BackToTop";
import FeedbackForm from "@/components/FeedbackForm";
import { getProducts, getAbout } from "@/lib/db";

export default async function Home() {
  const products = await getProducts();
  const aboutData = await getAbout();

  return (
    <main className="min-h-screen pb-[60px] bg-background">
      <Header />
      <Hero />
      <About data={aboutData} />
      <LatestDrops products={products} />
      <FeedbackForm />
      <Navigation />
      <BackToTop />
    </main>
  );
}
