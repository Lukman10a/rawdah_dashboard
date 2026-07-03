"use client";

import { BellRing, CheckCircle2, Clock3, Sparkles, Users } from "lucide-react";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import { NotificationShell } from "@/components/dashboard/NotificationShell";

const feed = [
  {
    title: "New attendance anomaly",
    detail:
      "Grade 3A shows a 14% increase in late arrivals after the 10:30 break.",
    time: "8 min ago",
    category: "Alert",
  },
  {
    title: "Parent reminder drafted",
    detail:
      "A communication note for Hamza Bello has been prepared for review.",
    time: "24 min ago",
    category: "Message",
  },
  {
    title: "Payroll batch approved",
    detail: "Hourly faculty pay for the current cycle was approved by finance.",
    time: "1 hr ago",
    category: "Finance",
  },
];

export default function NotificationsPage() {
  return (
    <NotificationShell>
      <PageHeader
        title="Today at a glance"
        description="Priority notices and recent activity"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          label="Unread"
          value="12"
          hint="4 high priority"
          accent="gold"
        />
        <KpiCard
          label="Resolved"
          value="46"
          hint="+8 this week"
          accent="green"
        />
        <KpiCard
          label="Parents notified"
          value="184"
          hint="94% delivered"
          accent="muted"
        />
        <KpiCard
          label="AI summaries"
          value="9"
          hint="Auto-generated"
          accent="muted"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display italic text-lg text-navy">
                Recent activity
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Most relevant updates for your team
              </p>
            </div>
            <div className="rounded-full bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Live
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {feed.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 rounded-xl border border-hairline bg-cream/40 p-4"
              >
                <div className="mt-0.5 rounded-full bg-navy/10 p-2 text-navy">
                  <BellRing className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-medium text-navy">{item.title}</h4>
                    <span className="text-[11px] text-ink-muted">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{item.detail}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gold">
                    <Sparkles className="size-3" /> {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <h3 className="font-display italic text-lg text-navy">
                  Delivery health
                </h3>
                <p className="text-sm text-ink-muted">
                  Message reach and follow-up status
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Parent alerts</span>
                  <span className="font-medium text-navy">92%</span>
                </div>
                <div className="h-2 rounded-full bg-cream">
                  <div className="h-2 w-[92%] rounded-full bg-gold" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Staff notices</span>
                  <span className="font-medium text-navy">88%</span>
                </div>
                <div className="h-2 rounded-full bg-cream">
                  <div className="h-2 w-[88%] rounded-full bg-navy" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cream p-2 text-navy">
                <Users className="size-4" />
              </div>
              <div>
                <h3 className="font-display italic text-lg text-navy">
                  Awaiting review
                </h3>
                <p className="text-sm text-ink-muted">3 approvals needed</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2">
                <span>Student absence request</span>
                <span className="text-ink-muted">10m</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2">
                <span>Attendance escalation</span>
                <span className="text-ink-muted">35m</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2">
                <span>Parent communication draft</span>
                <span className="text-ink-muted">1h</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </NotificationShell>
  );
}
