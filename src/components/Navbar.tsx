"use client";

import { Menu, Waves, X } from "lucide-react";
import { useState } from "react";

import { site } from "@/lib/content";

const links = [
  { href: "#sadrzaji", label: "Sadržaji" },
  { href: "#galerija", label: "Galerija" },
  { href: "#paketi", label: "Dnevni najam" },
  { href: "#nocenje", label: "Noćenje" },
  { href: "#pravila", label: "Pravila" },
  { href: "#lokacija", label: "Lokacija" },
];
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-pine-950/10 bg-cream-50/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="#vrh" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-700 text-gold-light">
            <Waves className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-wide text-pine-700">
            {site.name}
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-pine-950/70 transition-colors hover:text-gold-dark"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-pine-950 transition-colors hover:bg-gold-light"
          >
            Rezerviši
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          onClick={() => setOpen((v) => !v)}
          className="text-pine-800 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-pine-950/10 bg-cream-50 px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-pine-950/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-gold px-5 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-pine-950"
          >
            Rezerviši
          </a>
        </div>
      )}
    </header>
  );
}
