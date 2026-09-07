import { Mail, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/config/site";

export function ContactSection() {
  const { email, phoneDisplay, phoneIntl } = site.contact;

  return (
    <section id="kontakt" className="scroll-mt-20 bg-mist-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Rezervacija"
          title="Pošaljite upit"
          description="Odgovaramo obično u roku od nekoliko sati. Za brži dogovor, nazovite ili pišite direktno."
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="rounded border border-forest-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <ContactForm />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 rounded border border-forest-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded bg-forest-50">
                <Mail className="h-5 w-5 text-forest-500" aria-hidden />
              </span>
              <span>
                <span className="block text-sm text-forest-950/60">Email</span>
                <span className="font-medium text-forest-800">{email}</span>
              </span>
            </a>

            <a
              href={`tel:+${phoneIntl}`}
              className="flex items-center gap-4 rounded border border-forest-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded bg-forest-50">
                <Phone className="h-5 w-5 text-forest-500" aria-hidden />
              </span>
              <span>
                <span className="block text-sm text-forest-950/60">
                  Telefon / Viber
                </span>
                <span className="font-medium text-forest-800">{phoneDisplay}</span>
              </span>
            </a>

            <a
              href={`https://wa.me/${phoneIntl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded bg-forest-500 p-5 text-white shadow-sm transition-colors hover:bg-forest-600"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded bg-white/15">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm text-white/75">WhatsApp</span>
                <span className="font-medium">Pošalji poruku jednim klikom</span>
              </span>
            </a>

            <div className="rounded bg-forest-700 p-5 text-sm leading-relaxed text-white/85">
              Prijava (check-in) {site.houseRules.checkIn}, odjava (check-out){" "}
              {site.houseRules.checkOut}. Rani dolazak ili kasna odjava mogući
              po dogovoru, uz dostupnost.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
