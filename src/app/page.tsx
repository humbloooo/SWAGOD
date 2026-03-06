import { Suspense } from "react";
import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import BackgroundBrackets from "@/components/ui/BackgroundBrackets";
import WelcomeBanner from "@/components/ui/WelcomeBanner";
import HomeHero from "@/components/home/HomeHero";
import HomeLatestDrops from "@/components/home/HomeLatestDrops";
import HomeAbout from "@/components/home/HomeAbout";
import FeedbackForm from "@/components/ui/FeedbackForm";
import ChangelogWidget from "@/components/ui/ChangelogWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSettings();

  return (
    <main id="main-content" className="min-h-screen pb-[60px] bg-background">
      <Header />
      <WelcomeBanner enabled={settings?.showPersonalization} />
      <BackgroundBrackets />

      <Suspense fallback={<div className="h-screen bg-black animate-pulse" />}>
        <HomeHero settings={settings} />
      </Suspense>

      <Suspense fallback={
        <div className="container mx-auto px-6 py-24 space-y-12">
          <Skeleton className="h-24 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="aspect-[3/4]" />
            <Skeleton className="aspect-[3/4]" />
            <Skeleton className="aspect-[3/4]" />
          </div>
        </div>
      }>
        <HomeLatestDrops settings={settings} />
      </Suspense>

      <FeedbackForm />

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <HomeAbout />
      </Suspense>

      <div className="container mx-auto px-6">
        <ChangelogWidget />
      </div>

      <Navigation />
    </main>
  );
}
