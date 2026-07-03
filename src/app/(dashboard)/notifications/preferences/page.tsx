"use client";

import { useState } from "react";
import { BellRing, Mail, Smartphone } from "lucide-react";

import { Card } from "@/components/dashboard/dashboard-shell";
import { NotificationShell } from "@/components/dashboard/NotificationShell";

const channels = [
  {
    id: "email",
    label: "Email",
    icon: Mail,
    desc: "Receive weekly digest and admin notices",
    enabled: true,
    accent: "bg-navy/10 text-navy",
    pill: "Primary",
  },
  {
    id: "sms",
    label: "SMS",
    icon: Smartphone,
    desc: "Urgent attendance and payroll alerts",
    enabled: false,
    accent: "bg-gold/10 text-gold",
    pill: "Urgent",
  },
  {
    id: "push",
    label: "In-app",
    icon: BellRing,
    desc: "Quick updates and approvals",
    enabled: true,
    accent: "bg-emerald-50 text-emerald-700",
    pill: "Default",
  },
];

export default function NotificationsPreferencesPage() {
  const [preferences, setPreferences] = useState(channels);

  const toggleChannel = (id: string) => {
    setPreferences((current) =>
      current.map((channel) =>
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel,
      ),
    );
  };

  return (
    <NotificationShell>
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display italic text-lg text-navy">
              Preferences
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Choose how your team receives updates.
            </p>
          </div>
          <div className="rounded-full border border-hairline bg-cream/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Tailored delivery
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {preferences.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${channel.accent}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-navy">{channel.label}</h4>
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                        {channel.pill}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted">{channel.desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className={`relative h-6 w-11 rounded-full transition ${channel.enabled ? "bg-navy" : "bg-cream"}`}
                  aria-label={`Toggle ${channel.label}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${channel.enabled ? "left-5" : "left-0.5"}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </NotificationShell>
  );
}
