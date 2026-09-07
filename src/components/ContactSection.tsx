import { Clock, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { site } from "@/config/site";

export function ContactSection() {
  const { phoneDisplay, phoneIntl } = site.contact;

  return (
    <section id="kontakt" className="scroll-mt-20 bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
              Kontakt i rezervacija
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-pine-700 sm:text-4xl">
              {site.cta}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-pine-950/70">
              Nazovite, pošaljite poruku ili popunite formu — potvrdit ćemo
              termin u naj kraćem roku.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:+${phoneIntl}`}
                className="flex items-center gap-4 rounded bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <Phone className="h-5 w-5 shrink-0 text-pine-700" aria-hidden />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-pine-950/50">
                    Telefon
                  </span>
                  <span className="text-lg font-semibold text-pine-700">{phoneDisplay}</span>
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
                    WhatsApp / Viber
                  </span>
                  <span className="font-medium">Pošalji poruku jednim klikom</span>
                </span>
              </a>

              <p className="flex items-center gap-3 rounded bg-white p-4 text-sm text-pine-950/70 shadow-sm">
                <Clock className="h-5 w-5 shrink-0 text-pine-700" aria-hidden />
                Dnevni najam: <strong className="text-pine-800">{site.hours}</strong>
              </p>
            </div>
          </div>

          <div className="rounded bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
