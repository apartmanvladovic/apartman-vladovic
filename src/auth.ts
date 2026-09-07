/**
 * Auth.js (NextAuth v5) — Google OAuth.
 * Prijavu dozvoljavamo svima, ali administratorski pristup
 * provjerava isključivo isAdmin() (ADMIN_ALLOWED_EMAIL).
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Session } from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
});

export function isAdmin(session: Session | null): boolean {
  const allowed = process.env.ADMIN_ALLOWED_EMAIL;
  return (
    !!allowed &&
    !!session?.user?.email &&
    session.user.email.toLowerCase() === allowed.toLowerCase()
  );
}
