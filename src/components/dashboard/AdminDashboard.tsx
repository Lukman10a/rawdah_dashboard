"use client";

import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, BookOpenCheck, Sparkles, TrendingUp, Wallet } from "lucide-react";

import { Card, KpiCard, PageHeader } from "@/components/dashboard/dashboard-shell";
import { aiInsights, computePay, enrollmentSeries, notifications, parentUpdates } from "@/lib/mock-data";
import type { Teacher } from "@/lib/mock-data";

const insightIcon = {
  "Attendance Pattern": Sparkles,
  "Leave Pattern": Sparkles,
  Curriculum: BookOpenCheck,
  "Payroll Forecast": Wallet,
  "Student Risk": TrendingUp,
} as const;

export function AdminDashboard({ teachersList }: { teachersList: Teacher[] }) {
  const monthlyPayroll = teachersList.reduce((s, t) => s + computePay(t), 0);
  const activeTeachers = teachersList.filter((t) => t.status === "Active").length;

  return (
    <>
      <PageHeader
        title="Institutional Overview"
        description="Real-time intelligence for Rawdatul Atfaal · Term III"
        right={
          <div className="flex items-center gap-2 text-xs text-ink-muted font-mono">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Live sync
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Total Students" value="1,248" hint="+4.2% vs last term" accent="green" />
        <KpiCard label="Active Teachers" value={String(activeTeachers)} hint="98% attendance" accent="muted" />
        <KpiCard
          label="Monthly Payroll"
          value={`$${monthlyPayroll.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          hint="Forecast: +$1.2k"
          accent="gold"
        />
        <KpiCard label="Attendance Rate" value="94.2%" progress={94} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-display italic text-lg">Enrollment & Performance</h3>
              <p className="text-xs text-ink-muted">Six lunar months, whole institute</p>
            </div>
            <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted">
              <span className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-navy" /> Enrollment
              </span>
              <span className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-gold" /> Performance
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentSeries} margin={{ left: -10, right: 10, top: 5 }}>
                <defs>
                  <linearGradient id="fillNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a1834" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0a1834" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a94a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d4a94a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a18341a" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7691" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7691" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid rgba(10,24,52,0.1)",
                    fontSize: 12,
                    fontFamily: "Inter",
                  }}
                />
                <Area type="monotone" dataKey="enrollment" stroke="#0a1834" strokeWidth={2} fill="url(#fillNavy)" />
                <Area type="monotone" dataKey="performance" stroke="#d4a94a" strokeWidth={2} fill="url(#fillGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Intelligence Center</h3>

          {aiInsights.slice(0, 3).map((it, i) => {
            const Icon = insightIcon[it.kind as keyof typeof insightIcon] ?? Sparkles;
            const dark = i === 0;

            return (
              <div
                key={it.id}
                className={`p-4 rounded-xl border transition-all ${
                  dark
                    ? "bg-navy text-cream border-gold/30 hover:shadow-xl hover:shadow-gold/5"
                    : "bg-white border-hairline"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-mono ${dark ? "text-gold" : "text-ink-muted"}`}>
                    {String(i + 1).padStart(2, "0")} · {it.kind}
                  </span>
                  <div className={`size-6 rounded-full grid place-items-center ${dark ? "bg-gold/20" : "bg-cream"}`}>
                    <Icon className={`size-3 ${dark ? "text-gold" : "text-navy"}`} />
                  </div>
                </div>
                <p className={`font-medium mt-3 text-sm ${dark ? "text-cream" : "text-navy"}`}>{it.title}</p>
                <p className={`text-xs mt-1 leading-relaxed ${dark ? "text-cream/70" : "text-ink-muted"}`}>{it.detail}</p>
              </div>
            );
          })}
          <Link
            href="/ai-insights"
            className="inline-flex items-center gap-1 text-xs text-navy font-medium hover:text-gold"
          >
            View all insights <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-hairline flex justify-between items-center">
            <div>
              <h3 className="font-display italic text-lg">Teaching Faculty Payroll</h3>
              <p className="text-xs text-ink-muted mt-0.5">Hourly instructors · current month</p>
            </div>
            <Link href="/payroll" className="text-xs text-navy/70 hover:text-navy underline underline-offset-4">
              Open payroll
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                  <th className="px-6 py-3">Faculty</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Rate</th>
                  <th className="px-6 py-3">Hours</th>
                  <th className="px-6 py-3 text-right">Monthly Pay</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-hairline">
                {teachersList
                  .filter((t) => t.employmentType === "Hourly")
                  .slice(0, 6)
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-cream/30">
                      <td className="px-6 py-4">
                        <div className="font-medium text-navy">{t.name}</div>
                        <div className="text-[11px] text-ink-muted font-mono">{t.id}</div>
                      </td>
                      <td className="px-6 py-4 text-ink-muted">{t.specialization}</td>
                      <td className="px-6 py-4 font-mono text-xs">${t.hourlyRate}/hr</td>
                      <td className="px-6 py-4 font-mono text-xs">{t.hoursLogged}</td>
                      <td className="px-6 py-4 text-right font-medium text-navy">${computePay(t).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display italic text-lg">Parent Updates</h3>
              <p className="text-xs text-ink-muted">Recent guardian messages</p>
            </div>
          </div>
          <div className="space-y-3">
            {parentUpdates.slice(0, 4).map((u, i) => (
              <div key={i} className="p-3 rounded-lg bg-cream/50 border border-hairline">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm text-navy">{u.child}</p>
                    <p className="text-[11px] text-ink-muted">{u.note}</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold">{u.type}</span>
                </div>
                <p className="mt-2 text-[10px] font-mono text-ink-muted">{u.when}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-ink-muted mb-3">Notifications</h4>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((n, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="size-2 rounded-full bg-gold mt-1.5 shrink-0" />
                  <div>
                    <p className="text-navy text-sm">{n.title}</p>
                    <p className="text-ink-muted text-xs">{n.desc}</p>
                    <p className="text-ink-muted text-[10px] font-mono mt-0.5">{n.when}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
