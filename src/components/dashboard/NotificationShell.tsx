"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AlertCircle, BellRing, Clock3, SlidersHorizontal } from "lucide-react";

const links = [
  { href: "/notifications", label: "Overview", icon: BellRing },
  { href: "/notifications/alerts", label: "Alerts", icon: AlertCircle },
  { href: "/notifications/history", label: "History", icon: Clock3 },
  {
    href: "/notifications/preferences",
    label: "Preferences",
    icon: SlidersHorizontal,
  },
] as const;

export function NotificationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/notifications";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-hairline bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Communication hub
            </p>
            <h2 className="mt-2 font-display italic text-2xl text-navy">
              Notifications & announcements
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Monitor policy updates, attendance alerts, and parent-facing
              communications from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                    active
                      ? "border-gold/40 bg-gold/10 text-navy"
                      : "border-hairline bg-cream/50 text-ink-muted hover:border-gold/20 hover:text-navy"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
