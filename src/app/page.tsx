import { Navbar } from "@/components/Navbar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { LocaleContentFade } from "@/components/ui/LocaleContentFade";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Plans } from "@/components/Plans";
import { FeaturedProject } from "@/components/FeaturedProject";
import { Process } from "@/components/Process";
import { TechStack } from "@/components/TechStack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingWhatsApp />
      <LocaleContentFade>
        <main>
          <Hero />
          <Services />
          <FeaturedProject />
          <Plans />
          <Process />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </LocaleContentFade>
    </>
  );
}
