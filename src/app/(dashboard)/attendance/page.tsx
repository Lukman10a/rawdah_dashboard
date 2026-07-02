"use client";

import { Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import { attendance30d } from "@/lib/mock-data";

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance"
        description="Daily register with AI pattern detection"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Today Present"
          value="1,176"
          hint="94.2%"
          accent="green"
        />
        <KpiCard label="Late" value="34" hint="within 15 min" accent="gold" />
        <KpiCard label="Absent" value="38" hint="8 unreported" accent="muted" />
        <KpiCard
          label="Patterns Flagged"
          value="3"
          hint="AI · last 14 days"
          accent="gold"
        />
      </div>

      <Card className="p-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="font-display italic text-lg">14-day register</h3>
            <p className="text-xs text-ink-muted">Present · Late · Absent</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendance30d} margin={{ left: -10, right: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#0a18341a"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6b7691" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7691" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="present"
                stackId="a"
                fill="#0a1834"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="late" stackId="a" fill="#d4a94a" />
              <Bar
                dataKey="absent"
                stackId="a"
                fill="#cbd5e1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 bg-navy text-cream border-gold/30">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-full bg-gold/20 grid place-items-center shrink-0">
            <Sparkles className="size-5 text-gold" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold font-mono">
              Smart Leave & Attendance Detector
            </div>
            <h3 className="font-display italic text-xl mt-1">
              3 patterns detected
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-cream/85">
              <li>
                • Recurring Tuesday absences in Grade 4 Fiqh — 6 weeks running.
              </li>
              <li>• Late-arrival cluster after Zuhr break in Grade 6.</li>
              <li>
                • Staff sick-leave concentration on Mondays (Jan–Mar). Recommend
                a wellness review.
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </>
  );
}
