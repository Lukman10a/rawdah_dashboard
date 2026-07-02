import { PlayCircle, Sparkles } from "lucide-react";

import { Card, KpiCard, PageHeader } from "../components/dashboard-shell";
import { lessonAudits } from "@/lib/mock-data";

function statusColor(s: string) {
  if (s === "Aligned") return "bg-emerald-50 text-emerald-700";
  if (s === "Review") return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

export default function CurriculumPage() {
  const avg = Math.round(
    lessonAudits.reduce((s, x) => s + x.alignment, 0) / lessonAudits.length,
  );

  return (
    <>
      <PageHeader
        title="Curriculum Auditor"
        description="AI-powered lesson plan alignment against Rawdah standards"
        right={
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110">
            <PlayCircle className="size-4" /> Run full audit
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard label="Avg Alignment" value={`${avg}%`} progress={avg} />
        <KpiCard
          label="Plans Audited"
          value={String(lessonAudits.length)}
          hint="this week"
        />
        <KpiCard
          label="Critical Flags"
          value={String(
            lessonAudits.filter((a) => a.status === "Off-track").length,
          )}
          accent="gold"
          hint="need review"
        />
        <KpiCard
          label="Coverage Streak"
          value="12w"
          hint="consecutive weeks"
          accent="green"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <div>
            <h3 className="font-display italic text-lg">Recent audits</h3>
            <p className="text-xs text-ink-muted">
              Alignment against national + Rawdah standards
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-mono">
            <Sparkles className="size-3" /> AI live
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
              <th className="px-6 py-3">Grade</th>
              <th className="px-6 py-3">Lesson</th>
              <th className="px-6 py-3">Instructor</th>
              <th className="px-6 py-3">Alignment</th>
              <th className="px-6 py-3">AI notes</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-hairline">
            {lessonAudits.map((a) => (
              <tr key={a.id} className="hover:bg-cream/40">
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-navy/5 text-navy text-[11px] font-mono">
                    {a.grade}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-navy">{a.subject}</td>
                <td className="px-6 py-4 text-ink-muted">{a.teacher}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-navy/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${a.alignment > 90 ? "bg-emerald-500" : a.alignment > 75 ? "bg-gold" : "bg-rose-500"}`}
                        style={{ width: `${a.alignment}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{a.alignment}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-ink-muted">
                  {a.gaps.length === 0
                    ? "No gaps detected."
                    : a.gaps.join(" · ")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor(a.status)}`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
