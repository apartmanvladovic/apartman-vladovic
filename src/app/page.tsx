import { About } from "@/components/About";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { ContactSection } from "@/components/ContactSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Navbar } from "@/components/Navbar";
import { getBookedDates } from "@/lib/calendar";

export default async function Home() {
  const booked = await getBookedDates();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Gallery />
        <AvailabilityCalendar bookedDates={[...booked]} />
        <ContactSection />
        <Location />
      </main>
      <Footer />
    </>
  );
}
