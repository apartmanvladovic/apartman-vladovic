"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/admin" })}
      className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-pine-950 transition hover:bg-gold-light"
    >
      Prijavi se Google nalogom
    </button>
  );
}
