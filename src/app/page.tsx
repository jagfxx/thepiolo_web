import { Navbar } from "@/components/Navbar";
import { LocaleContentFade } from "@/components/ui/LocaleContentFade";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { FeaturedProject } from "@/components/FeaturedProject";
import { Process } from "@/components/Process";
import { TechStack } from "@/components/TechStack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <LocaleContentFade>
        <main>
          <Hero />
          <About />
          <Services />
          <FeaturedProject />
          <Process />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </LocaleContentFade>
    </>
  );
}
