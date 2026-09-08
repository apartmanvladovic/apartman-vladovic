import Image from "next/image";

import { auth, isAdmin } from "@/auth";
import { site } from "@/lib/content";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { SignInButton } from "@/components/admin/SignInButton";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  // 1) Nije prijavljen → Google prijava
  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-pine-950 px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">
          {site.name} — Admin
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-cream-50">
          Prijava potrebna
        </h1>
        <p className="mt-3 max-w-sm text-sm text-cream-50/70">
          Uređivanje sadržaja dostupno je samo vlasniku objekta. Prijavite se
          svojim Google nalogom.
        </p>
        <div className="mt-8">
          <SignInButton />
        </div>
      </main>
    );
  }

  // 2) Prijavljen, ali pogrešan email → 403
  if (!isAdmin(session)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-pine-950 px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">
          403 — Pristup odbijen
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-cream-50">
          Ovaj nalog nema administratorski pristup
        </h1>
        <p className="mt-3 max-w-sm text-sm text-cream-50/70">
          Prijavljeni ste kao <strong>{session.user.email}</strong>. Administracija
          je dozvoljena samo nalogu vlasnika.
        </p>
        <div className="mt-8">
          <SignOutButton label="Odjavi se i probaj drugi nalog" />
        </div>
      </main>
    );
  }

  // 3) Admin
  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image ?? "",
  };

  return (
    <main className="flex min-h-screen flex-col bg-cream-50">
      <header className="flex items-center justify-between border-b border-pine-100 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-pine-900">
            {site.name} — Admin chat
          </p>
          <p className="truncate text-xs text-pine-950/60">
            {user.name} ({user.email})
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : null}
          <SignOutButton label="Odjava" />
        </div>
      </header>
      <AdminTabs />
    </main>
  );
}
