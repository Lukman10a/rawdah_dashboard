import { Plus } from "lucide-react";

import { Card, KpiCard, PageHeader } from "../components/dashboard-shell";
import { students } from "@/lib/mock-data";

export default function StudentsPage() {
  const avgPerf = Math.round(
    students.reduce((s, x) => s + x.performance, 0) / students.length,
  );
  const avgAtt = Math.round(
    students.reduce((s, x) => s + x.attendance, 0) / students.length,
  );

  return (
    <>
      <PageHeader
        title="Students"
        description="Enrolment, performance and behaviour signals"
        right={
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110">
            <Plus className="size-4" /> Enrol student
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Enrolled"
          value="1,248"
          hint="+58 this term"
          accent="green"
        />
        <KpiCard
          label="Avg Performance"
          value={`${avgPerf}%`}
          progress={avgPerf}
        />
        <KpiCard
          label="Avg Attendance"
          value={`${avgAtt}%`}
          accent="muted"
          hint="last 30 days"
        />
        <KpiCard
          label="At-risk"
          value="14"
          hint="AI flagged this month"
          accent="gold"
        />
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Grade</th>
              <th className="px-6 py-3">Programme</th>
              <th className="px-6 py-3">Guardian</th>
              <th className="px-6 py-3">Performance</th>
              <th className="px-6 py-3">Attendance</th>
              <th className="px-6 py-3">Behaviour</th>
              <th className="px-6 py-3">Last report</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-hairline">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-cream/40">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-gold-soft to-gold grid place-items-center text-navy text-xs font-bold">
                      {s.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-navy">{s.name}</div>
                      <div className="text-[11px] text-ink-muted font-mono">
                        {s.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{s.grade}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-navy/5 text-navy">
                    {s.program}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink-muted">{s.guardian}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-navy/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy"
                        style={{ width: `${s.performance}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{s.performance}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{s.attendance}%</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      s.behavior === "Excellent"
                        ? "bg-emerald-50 text-emerald-700"
                        : s.behavior === "Good"
                          ? "bg-cream text-navy"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {s.behavior}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink-muted text-xs">
                  {s.lastReport}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
