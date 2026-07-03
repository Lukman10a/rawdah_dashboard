"use client";

import { Archive, CheckCircle2, ChevronRight } from "lucide-react";

import { Card } from "@/components/dashboard/dashboard-shell";
import { NotificationShell } from "@/components/dashboard/NotificationShell";

const history = [
  {
    title: "Attendance digest sent",
    detail: "Daily attendance summary delivered to the admin team.",
    date: "Jun 30",
  },
  {
    title: "Payroll reminder closed",
    detail: "Finance cleared the pending weekly schedule update.",
    date: "Jun 28",
  },
  {
    title: "Parent communication archived",
    detail: "A guardian follow-up note was stored in the archive.",
    date: "Jun 24",
  },
];

export default function NotificationsHistoryPage() {
  return (
    <NotificationShell>
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display italic text-lg text-navy">History</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Previously handled updates and archived messages
            </p>
          </div>
          <div className="rounded-full border border-hairline bg-cream/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Archived
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {history.map((item) => (
            <div
              key={item.title}
              className="flex items-start justify-between gap-4 rounded-xl border border-hairline bg-white p-4"
            >
              <div className="flex gap-3">
                <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h4 className="font-medium text-navy">{item.title}</h4>
                  <p className="mt-1 text-sm text-ink-muted">{item.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <span>{item.date}</span>
                <button
                  className="rounded-full p-1 hover:bg-cream"
                  aria-label={`Open ${item.title}`}
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
