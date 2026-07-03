"use client";

import { AlertTriangle, BellRing, ChevronRight } from "lucide-react";

import { Card } from "@/components/dashboard/dashboard-shell";
import { NotificationShell } from "@/components/dashboard/NotificationShell";

const alerts = [
  {
    title: "High attendance risk",
    detail: "Three classes are trending above the threshold for late arrivals.",
    level: "High",
    time: "12 min ago",
  },
  {
    title: "Pending parent follow-up",
    detail:
      "A guardian reply is still outstanding for grade 7 project submissions.",
    level: "Medium",
    time: "1 hr ago",
  },
  {
    title: "Lesson plan review due",
    detail: "Two lesson plans need revision before tomorrow’s timetable shift.",
    level: "Low",
    time: "2 hrs ago",
  },
];

export default function NotificationsAlertsPage() {
  return (
    <NotificationShell>
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display italic text-lg text-navy">
              Alert centre
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Actionable items that require attention
            </p>
          </div>
          <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            3 active
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className="flex items-start justify-between gap-4 rounded-xl border border-hairline bg-white p-4"
            >
              <div className="flex gap-3">
                <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-navy">{alert.title}</h4>
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                      {alert.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{alert.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <span>{alert.time}</span>
                <button
                  className="rounded-full p-1 hover:bg-cream"
                  aria-label={`Open ${alert.title}`}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </NotificationShell>
  );
}
