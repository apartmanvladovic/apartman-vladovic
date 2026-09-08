"use client";

/**
 * Tabovi admin modula: Rezervacije (direktan kalendar), Chat (Gemini),
 * Postavke (izbor LLM providera).
 */
import { CalendarDays, MessageSquare, Settings2 } from "lucide-react";
import { useState } from "react";

import { AdminChat } from "@/components/admin/AdminChat";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { ReservationCalendar } from "@/components/admin/ReservationCalendar";

const TABS = [
  { id: "rezervacije", label: "Rezervacije", icon: CalendarDays },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "postavke", label: "Postavke", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminTabs() {
  const [tab, setTab] = useState<TabId>("rezervacije");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav className="flex border-b border-pine-100 bg-white px-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 text-xs font-semibold transition ${
              tab === id
                ? "border-gold text-pine-900"
                : "border-transparent text-pine-950/50 hover:text-pine-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* Sve tri sekcije ostaju mountovane da chat ne izgubi historiju. */}
      <div className={`flex min-h-0 flex-1 flex-col ${tab === "rezervacije" ? "" : "hidden"}`}>
        <ReservationCalendar />
      </div>
      <div className={`flex min-h-0 flex-1 flex-col ${tab === "chat" ? "" : "hidden"}`}>
        <AdminChat />
      </div>
      <div className={`flex min-h-0 flex-1 flex-col ${tab === "postavke" ? "" : "hidden"}`}>
        <AdminSettings />
      </div>
    </div>
  );
}
