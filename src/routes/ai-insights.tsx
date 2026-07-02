import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "../components/dashboard/DashboardLayout";
import { aiInsights } from "../lib/mock-data";
import { Sparkles, BookOpenCheck, Wallet, TrendingUp, CalendarCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/ai-insights")({
  component: AiInsightsPage,
});

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

function AiInsightsPage() {
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
                    <div className="font-display italic text-lg text-navy mt-0.5">{it.title}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    sevBadge[it.severity as keyof typeof sevBadge]
                  }`}
                >
                  {it.severity}
                </span>
              </div>
              <p className="text-sm text-ink-muted mt-4 leading-relaxed">{it.detail}</p>
              <div className="mt-5 flex items-center gap-3">
                <button className="text-xs font-medium bg-navy text-cream px-3 py-1.5 rounded-md hover:brightness-110">
                  {it.action}
                </button>
                <button className="text-xs text-ink-muted hover:text-navy">Dismiss</button>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
