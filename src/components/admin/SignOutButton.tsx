"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin" })}
      className="rounded-full border border-pine-200 px-4 py-1.5 text-xs font-semibold text-pine-700 transition hover:bg-pine-50"
    >
      {label}
    </button>
  );
}
