import { Mail, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/config/site";

export function ContactSection() {
  const { email, phoneDisplay, phoneIntl } = site.contact;

  return (
    <section id="kontakt" className="scroll-mt-20 bg-mist-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Kontakt i rezervacija"
              title="Pišite nam — odgovaramo isti dan."
              description="Za brzu provjeru termina javite se na WhatsApp ili Viber. Za detaljne upite koristite formu."
            />

            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 rounded bg-mist-100 p-5 transition-colors hover:bg-brand-100"
              >
                <Mail className="h-5 w-5 shrink-0 text-brand-700" aria-hidden />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-brand-950/50">
                    Email
                  </span>
                  <span className="font-medium text-brand-700">{email}</span>
                </span>
              </a>

              <a
                href={`tel:+${phoneIntl}`}
                className="flex items-center gap-4 rounded bg-mist-100 p-5 transition-colors hover:bg-brand-100"
              >
                <Phone className="h-5 w-5 shrink-0 text-brand-700" aria-hidden />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-brand-950/50">
                    Telefon / Viber
                  </span>
                  <span className="font-medium text-brand-700">{phoneDisplay}</span>
                </span>
              </a>

              <a
                href={`https://wa.me/${phoneIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded bg-green-700 p-5 text-white transition-colors hover:bg-green-800"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-white/70">
                    WhatsApp
                  </span>
                  <span className="font-medium">Pošalji poruku jednim klikom</span>
                </span>
              </a>

              <p className="rounded bg-mist-100 p-4 text-sm leading-relaxed text-brand-950/70">
                Prijava (check-in) {site.houseRules.checkIn}, odjava (check-out){" "}
                {site.houseRules.checkOut}. Rani dolazak ili kasna odjava mogući
                po dogovoru, uz dostupnost.
              </p>
            </div>
          </div>

          <div className="rounded bg-mist-100 p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
