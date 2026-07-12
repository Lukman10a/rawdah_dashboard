"use client";

import { Check, X } from "lucide-react";
import { Card } from "@/components/dashboard/dashboard-shell";
import type { AdmissionRequest } from "@/lib/persistence";

export function AdmissionsTable({
  admissions,
  onAction,
}: {
  admissions: AdmissionRequest[];
  onAction: (id: string, action: "Approve" | "Decline") => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-hairline">
        <h3 className="font-display italic text-lg">Pending Applications</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
              <th className="px-6 py-3">Applicant</th>
              <th className="px-6 py-3">Grade</th>
              <th className="px-6 py-3">Programme</th>
              <th className="px-6 py-3">Guardian</th>
              <th className="px-6 py-3">Applied Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-hairline">
            {admissions.map((a) => (
              <tr key={a.id} className="hover:bg-cream/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-navy">{a.name}</div>
                  <div className="text-[11px] text-ink-muted font-mono">{a.id}</div>
                </td>
                <td className="px-6 py-4 text-navy font-medium">{a.grade}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-navy/5 text-navy">
                    {a.program}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-navy">{a.guardianName}</div>
                  <div className="text-[11px] text-ink-muted">{a.guardianEmail}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{a.appliedDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      a.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : a.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {a.status === "Pending" ? (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onAction(a.id, "Approve")}
                        className="h-8 w-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 grid place-items-center transition cursor-pointer"
                        title="Approve & Enroll"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction(a.id, "Decline")}
                        className="h-8 w-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 grid place-items-center transition cursor-pointer"
                        title="Decline Application"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-muted font-medium">Archived</span>
                  )}
                </td>
              </tr>
            ))}
            {admissions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-ink-muted">
                  No student applications in queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
