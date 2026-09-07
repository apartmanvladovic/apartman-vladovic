import { ContactSection } from "@/components/ContactSection";
import { DrinksService } from "@/components/DrinksService";
import { Features } from "@/components/Features";
import { Finale } from "@/components/Finale";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Packages } from "@/components/Packages";
import { PremiumIncludes } from "@/components/PremiumIncludes";
import { Rules } from "@/components/Rules";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Packages />
        <PremiumIncludes />
        <DrinksService />
        <Rules />
        <Finale />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
