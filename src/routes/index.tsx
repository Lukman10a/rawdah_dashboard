import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { ArrowUpRight, TrendingUp, Sparkles, BookOpenCheck, Wallet } from "lucide-react";
import { Card, KpiCard, PageHeader } from "../components/dashboard/DashboardLayout";
import {
  teachers,
  computePay,
  enrollmentSeries,
  aiInsights,
  notifications,
  parentUpdates,
} from "../lib/mock-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const insightIcon = {
  "Attendance Pattern": Sparkles,
  "Leave Pattern": Sparkles,
  Curriculum: BookOpenCheck,
  "Payroll Forecast": Wallet,
  "Student Risk": TrendingUp,
} as const;

function Dashboard() {
  const monthlyPayroll = teachers.reduce((s, t) => s + computePay(t), 0);
  const activeTeachers = teachers.filter((t) => t.status === "Active").length;

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
        {/* Chart */}
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

        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Intelligence Center
          </h3>

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
                  <span
                    className={`text-[10px] font-mono ${dark ? "text-gold" : "text-ink-muted"}`}
                  >
                    {String(i + 1).padStart(2, "0")} · {it.kind}
                  </span>
                  <div
                    className={`size-6 rounded-full grid place-items-center ${
                      dark ? "bg-gold/20" : "bg-cream"
                    }`}
                  >
                    <Icon className={`size-3 ${dark ? "text-gold" : "text-navy"}`} />
                  </div>
                </div>
                <p className={`font-medium mt-3 text-sm ${dark ? "text-cream" : "text-navy"}`}>
                  {it.title}
                </p>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    dark ? "text-cream/70" : "text-ink-muted"
                  }`}
                >
                  {it.detail}
                </p>
              </div>
            );
          })}
          <Link
            to="/ai-insights"
            className="inline-flex items-center gap-1 text-xs text-navy font-medium hover:text-gold"
          >
            View all insights <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Teachers Payroll Table + Parent updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-hairline flex justify-between items-center">
            <div>
              <h3 className="font-display italic text-lg">Teaching Faculty Payroll</h3>
              <p className="text-xs text-ink-muted mt-0.5">Hourly instructors · current month</p>
            </div>
            <Link to="/payroll" className="text-xs text-navy/70 hover:text-navy underline underline-offset-4">
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
                {teachers
                  .filter((t) => t.employmentType === "Hourly")
                  .slice(0, 6)
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-cream/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-navy">{t.name}</div>
                        <div className="text-[11px] text-ink-muted">{t.title} · {t.id}</div>
                      </td>
                      <td className="px-6 py-3.5 text-ink-muted">{t.specialization}</td>
                      <td className="px-6 py-3.5 font-mono text-xs">${t.hourlyRate.toFixed(2)}</td>
                      <td className="px-6 py-3.5 font-mono text-xs">{t.hoursLogged.toFixed(1)}</td>
                      <td className="px-6 py-3.5 text-right font-mono font-bold text-navy">
                        ${computePay(t).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display italic text-lg">Parent Feed</h3>
              <Link to="/parents" className="text-[11px] text-ink-muted hover:text-navy">View all</Link>
            </div>
            <div className="space-y-4">
              {parentUpdates.map((p) => (
                <div key={p.child} className="flex gap-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-cream to-gold-soft grid place-items-center text-navy text-xs font-bold shrink-0">
                    {p.child[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-navy">
                      {p.child}{" "}
                      <span className="text-ink-muted font-normal">· {p.when}</span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{p.note}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-mono uppercase tracking-widest text-gold">
                      {p.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display italic text-lg mb-3">Notifications</h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.title} className="flex justify-between gap-3 text-xs">
                  <div>
                    <div className="font-medium text-navy">{n.title}</div>
                    <div className="text-ink-muted">{n.desc}</div>
                  </div>
                  <div className="text-ink-muted font-mono shrink-0">{n.when}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display italic text-lg mb-3">Weekly Performance</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentSeries}>
                  <Line type="monotone" dataKey="performance" stroke="#d4a94a" strokeWidth={2} dot={false} />
                  <XAxis dataKey="month" hide />
                  <YAxis hide domain={[80, 95]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
