"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { site } from "@/config/site";

const links = [
  { href: "#o-nama", label: "O nama" },
  { href: "#sadrzaji", label: "Sadržaji" },
  { href: "#galerija", label: "Galerija" },
  { href: "#kalendar", label: "Kalendar" },
  { href: "#lokacija", label: "Lokacija" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-950/10 bg-mist-50/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="#vrh" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700 font-display text-sm text-mist-50">
            AV
          </span>
          <span className="font-display text-lg text-forest-700">
            {site.name}
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-forest-950/70 transition-colors hover:text-amber-700"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="rounded-full bg-amber-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-orange-800"
          >
            Rezerviši
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          onClick={() => setOpen((v) => !v)}
          className="text-forest-800 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-950/10 bg-mist-50 px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-forest-950/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-amber-700 px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white"
          >
            Rezerviši
          </a>
        </div>
      )}
    </header>
  );
}
