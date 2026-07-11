"use client";

import { useState } from "react";
import {
  BookOpenCheck,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { aiInsights } from "@/lib/mock-data";

import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "Attendance Pattern": CalendarCheck,
  "Leave Pattern": CalendarCheck,
  Curriculum: BookOpenCheck,
  "Payroll Forecast": Wallet,
  "Student Risk": TrendingUp,
};

const sevBadge = {
  Info: "bg-navy/5 text-navy",
  Warning: "bg-amber-50 text-amber-700",
  Critical: "bg-rose-50 text-rose-700",
} as const;

export default function AiInsightsPage() {
  const [selectedInsight, setSelectedInsight] = useState<(typeof aiInsights)[number] | null>(null);

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="Attendance patterns, curriculum audits, payroll forecasts & student risk"
        right={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-mono">
            <Sparkles className="size-3" /> Copilot online
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiInsights.map((it) => {
          const Icon = iconMap[it.kind] ?? Sparkles;
          return (
            <Card key={it.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-cream grid place-items-center">
                    <Icon className="size-5 text-navy" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-muted font-mono">
                      {it.kind}
                    </div>
                    <div className="font-display italic text-lg text-navy mt-0.5">
                      {it.title}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sevBadge[it.severity as keyof typeof sevBadge]}`}
                >
                  {it.severity}
                </span>
              </div>
              <p className="text-sm text-ink-muted mt-4 leading-relaxed">
                {it.detail}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInsight(it)}
                  className="text-xs font-medium bg-navy text-cream px-3 py-1.5 rounded-md hover:brightness-110"
                >
                  View details
                </button>
                <button className="text-xs text-ink-muted hover:text-navy">
                  Dismiss
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={Boolean(selectedInsight)} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="max-w-2xl rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          {selectedInsight ? (
            <>
              <div className="border-b border-hairline p-6">
                <DialogHeader>
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    <Sparkles className="size-3" /> {selectedInsight.kind}
                  </div>
                  <DialogTitle className="font-display text-2xl text-navy">
                    {selectedInsight.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm text-ink-muted">
                    {selectedInsight.detail}
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="space-y-4 p-6">
                <div className="rounded-xl border border-hairline bg-cream/40 p-4 text-sm leading-7 text-navy">
                  <p className="font-medium">Recommended action</p>
                  <p className="mt-2 text-ink-muted">{selectedInsight.action}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-hairline p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">Priority</p>
                    <p className="mt-2 font-medium text-navy">{selectedInsight.severity}</p>
                  </div>
                  <div className="rounded-xl border border-hairline p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">Suggested follow-up</p>
                    <p className="mt-2 font-medium text-navy">Review with the relevant team this afternoon.</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
