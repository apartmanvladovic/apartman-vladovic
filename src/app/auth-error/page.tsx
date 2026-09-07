/**
 * Dijagnostička Auth.js error stranica — prikazuje konkretan tip greške
 * (?error=...) umjesto generičke "server configuration" poruke.
 * Privremeno za otklanjanje OAuth problema; kasnije se može stilizovati.
 */
import { SignInButton } from "@/components/admin/SignInButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Greška pri prijavi",
  robots: { index: false, follow: false },
};

const DESCRIPTIONS: Record<string, string> = {
  Configuration: "Greška u konfiguraciji servera (env varijable ili OAuth klijent).",
  AccessDenied: "Pristup odbijen — nalog nije dozvoljen.",
  Verification: "Link za prijavu je istekao ili je već iskorišten.",
  OAuthSignin: "Greška pri pokretanju Google prijave.",
  OAuthCallback: "Greška pri povratku sa Google prijave.",
  OAuthCreateAccount: "Nije moguće kreirati nalog.",
  EmailCreateAccount: "Nije moguće kreirati nalog.",
  Callback: "Greška u callback obradi.",
  OAuthAccountNotLinked: "Email je već vezan uz drugi način prijave.",
  SessionRequired: "Potrebna je prijava.",
  Default: "Nepoznata greška pri prijavi.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error = "Default" } = await searchParams;
  const description = DESCRIPTIONS[error] ?? DESCRIPTIONS.Default;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pine-950 px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">
        Greška pri prijavi
      </p>
      <h1 className="mt-3 font-mono text-2xl font-semibold text-cream-50">
        error = {error}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-cream-50/70">{description}</p>
      <p className="mt-2 max-w-sm text-xs text-cream-50/50">
        Pošaljite ovaj naziv greške administratoru sistema.
      </p>
      <div className="mt-8">
        <SignInButton label="Pokušaj ponovo" />
      </div>
    </main>
  );
}
