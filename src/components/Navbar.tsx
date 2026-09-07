"use client";

import { Menu, Mountain, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors ${
        scrolled || open
          ? "bg-mist-50/95 shadow-sm backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#vrh"
          className={`flex items-center gap-2 font-semibold tracking-tight ${
            scrolled || open ? "text-forest-800" : "text-white"
          }`}
        >
          <Mountain className="h-6 w-6" aria-hidden />
          {site.name}
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                scrolled ? "text-forest-800" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Rezerviši
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden ${scrolled || open ? "text-forest-800" : "text-white"}`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-100 bg-mist-50/95 px-4 pb-4 backdrop-blur md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-forest-800"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-amber-700 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Rezerviši
          </a>
        </div>
      )}
    </header>
  );
}
