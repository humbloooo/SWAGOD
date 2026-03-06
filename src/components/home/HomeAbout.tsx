import { getAbout } from "@/lib/db";
import About from "@/components/ui/About";

export default async function HomeAbout() {
    const aboutData = await getAbout();
    if (!aboutData) return null;
    return <About data={aboutData} />;
}
