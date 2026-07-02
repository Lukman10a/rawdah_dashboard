import { createFileRoute } from "@tanstack/react-router";
import { Card, KpiCard, PageHeader } from "../components/dashboard/DashboardLayout";
import { teachers, computePay, payrollBreakdown } from "../lib/mock-data";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/payroll")({
  component: PayrollPage,
});

const PALETTE = ["#0a1834", "#d4a94a", "#3f5378", "#a68238", "#c9b99a"];

function PayrollPage() {
  const hourly = teachers.filter((t) => t.employmentType === "Hourly");
  const salaried = teachers.filter((t) => t.employmentType === "Salaried");
  const total = teachers.reduce((s, t) => s + computePay(t), 0);
  const hourlyTotal = hourly.reduce((s, t) => s + computePay(t), 0);
  const salariedTotal = salaried.reduce((s, t) => s + computePay(t), 0);

  return (
    <>
      <PageHeader
        title="Payroll Engine"
        description="Hourly rate × logged hours + salaried disbursement"
        right={
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-gold text-navy text-sm font-medium hover:brightness-105">
            <Download className="size-4" /> Generate monthly report
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Total Payroll"
          value={`$${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          hint="this month"
          accent="gold"
        />
        <KpiCard label="Hourly Disbursement" value={`$${hourlyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} hint={`${hourly.length} teachers`} />
        <KpiCard label="Salaried Disbursement" value={`$${salariedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} hint={`${salaried.length} teachers`} />
        <KpiCard label="Forecast Next Month" value={`$${(total * 1.028).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} hint="AI · +2.8%" accent="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-hairline">
            <h3 className="font-display italic text-lg">Hourly Payroll Detail</h3>
            <p className="text-xs text-ink-muted">Pay = hourly rate × hours logged</p>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                <th className="px-6 py-3">Teacher</th>
                <th className="px-6 py-3">Rate</th>
                <th className="px-6 py-3">Hours</th>
                <th className="px-6 py-3">Formula</th>
                <th className="px-6 py-3 text-right">Pay</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-hairline">
              {hourly.map((t) => (
                <tr key={t.id} className="hover:bg-cream/40">
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-navy">{t.name}</div>
                    <div className="text-[11px] text-ink-muted">{t.specialization}</div>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs">${t.hourlyRate.toFixed(2)}</td>
                  <td className="px-6 py-3.5 font-mono text-xs">{t.hoursLogged.toFixed(1)}</td>
                  <td className="px-6 py-3.5 font-mono text-[11px] text-ink-muted">
                    ${t.hourlyRate.toFixed(2)} × {t.hoursLogged.toFixed(1)}
                  </td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-navy">
                    ${computePay(t).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-cream/60 border-t border-hairline text-navy font-medium">
                <td className="px-6 py-3" colSpan={4}>Hourly total</td>
                <td className="px-6 py-3 text-right font-mono">
                  ${hourlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-display italic text-lg mb-3">By department</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={payrollBreakdown} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {payrollBreakdown.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {payrollBreakdown.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                    {p.name}
                  </span>
                  <span className="font-mono text-ink-muted">${p.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-navy text-cream border-gold/30">
            <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-mono">
              <Sparkles className="size-3" /> Forecast assistant
            </div>
            <p className="text-sm mt-2 leading-relaxed">
              Ramadan schedule will shift ~24 daytime hours to evening tutorials.
              Estimated payroll delta: <span className="text-gold font-medium">+$2,412</span>.
              Salaried staff unchanged.
            </p>
            <button className="mt-3 text-xs bg-gold text-navy font-medium px-3 py-1.5 rounded-md hover:brightness-105">
              Simulate scenario
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}
