import Link from "next/link";
import RowLink from "@/components/dashboard/RowLink";
import { Plus, Star } from "lucide-react";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import { computePay, teachers } from "@/lib/mock-data";

export default function TeachersPage() {
  const hourly = teachers.filter((t) => t.employmentType === "Hourly");
  const salaried = teachers.filter((t) => t.employmentType === "Salaried");
  const totalHours = hourly.reduce((s, t) => s + t.hoursLogged, 0);
  const avgRating = (
    teachers.reduce((s, t) => s + t.rating, 0) / teachers.length
  ).toFixed(2);

  return (
    <>
      <PageHeader
        title="Teaching Faculty"
        description="Instructors, load, ratings and hourly-vs-salaried mix"
        right={
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110">
            <Plus className="size-4" /> Add teacher
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Total Teachers"
          value={String(teachers.length)}
          hint={`${hourly.length} hourly · ${salaried.length} salaried`}
        />
        <KpiCard
          label="Hours Logged"
          value={totalHours.toFixed(1)}
          hint="this month"
        />
        <KpiCard
          label="Avg Rating"
          value={`${avgRating}/5`}
          accent="gold"
          hint="based on peer & parent feedback"
        />
        <KpiCard label="Retention" value="97%" progress={97} />
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline flex justify-between items-center">
          <h3 className="font-display italic text-lg">Faculty Roster</h3>
          <div className="flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-cream border border-hairline">
              All
            </span>
            <span className="text-[10px] px-2 py-1 rounded-full text-ink-muted">
              Hourly
            </span>
            <span className="text-[10px] px-2 py-1 rounded-full text-ink-muted">
              Salaried
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                <th className="px-6 py-3">Teacher</th>
                <th className="px-6 py-3">Specialization</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Rate / Salary</th>
                <th className="px-6 py-3">Hours</th>
                <th className="px-6 py-3">Attendance</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3 text-right">Monthly Pay</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-hairline">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-linear-to-br from-navy-soft to-navy grid place-items-center text-cream text-xs font-bold">
                          {t.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="font-medium text-navy">{t.name}</div>
                          <div className="text-[11px] text-ink-muted">
                            {t.title} · {t.id}
                          </div>
                        </div>
                      </div>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    <RowLink href={`/teachers/${t.id}`}>
                      {t.specialization}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          t.employmentType === "Hourly"
                            ? "bg-gold/15 text-navy"
                            : "bg-navy/5 text-navy"
                        }`}
                      >
                        {t.employmentType}
                      </span>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <RowLink href={`/teachers/${t.id}`}>
                      {t.employmentType === "Hourly"
                        ? `$${t.hourlyRate.toFixed(2)}/hr`
                        : `$${t.salaryMonthly?.toLocaleString()}/mo`}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <RowLink href={`/teachers/${t.id}`}>
                      {t.employmentType === "Hourly"
                        ? t.hoursLogged.toFixed(1)
                        : "—"}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-navy/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold"
                            style={{ width: `${t.attendance}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">
                          {t.attendance}%
                        </span>
                      </div>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <div className="inline-flex items-center gap-1 text-xs">
                        <Star className="size-3 fill-gold text-gold" />{" "}
                        {t.rating.toFixed(1)}
                      </div>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-navy">
                    <RowLink href={`/teachers/${t.id}`}>
                      $
                      {computePay(t).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          t.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : t.status === "On Leave"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </RowLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
