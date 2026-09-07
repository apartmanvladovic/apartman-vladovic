import { BookingProvider } from "@/components/BookingProvider";
import { ContactSection } from "@/components/ContactSection";
import { DrinksService } from "@/components/DrinksService";
import { Features } from "@/components/Features";
import { Finale } from "@/components/Finale";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Navbar } from "@/components/Navbar";
import { Overnight } from "@/components/Overnight";
import { Packages } from "@/components/Packages";
import { PremiumIncludes } from "@/components/PremiumIncludes";
import { Rules } from "@/components/Rules";
import { getBookedDates } from "@/lib/calendar";

export default async function Home() {
  const booked = await getBookedDates();

  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Gallery />
        <Packages />
        <PremiumIncludes />
        <DrinksService />
        <Overnight bookedDates={[...booked]} />
        <Rules />
        <Finale />
        <ContactSection />
        <Location />
      </main>
      <Footer />
    </BookingProvider>
  );
}
