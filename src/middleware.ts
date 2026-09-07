import { auth } from "@/auth";

/**
 * /admin stranice zahtijevaju prijavu; sama stranica dodatno
 * provjerava ADMIN_ALLOWED_EMAIL i po potrebi prikazuje 403.
 * Admin API rute same vraćaju 401/403 (JSON, ne redirect).
 */
export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
