"use client";

import { KpiCard } from "@/components/dashboard/dashboard-shell";

export function AdmissionsStats({
  total,
  pending,
  approved,
  declined,
}: {
  total: number;
  pending: number;
  approved: number;
  declined: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <KpiCard label="Total Applications" value={String(total)} hint="this cycle" />
      <KpiCard label="Pending Review" value={String(pending)} accent="gold" hint="needs action" />
      <KpiCard label="Approved Admissions" value={String(approved)} accent="green" hint="enrolled" />
      <KpiCard label="Declined Applications" value={String(declined)} accent="muted" hint="archived" />
    </div>
  );
}
