"use client";

import { useEffect, useState } from "react";
import { Check, X, Sparkles, UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import {
  getStoredAdmissions,
  saveAdmissions,
  getStoredStudents,
  saveStudents,
  AdmissionRequest,
} from "@/lib/persistence";
import type { Student } from "@/lib/mock-data";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);

  useEffect(() => {
    setAdmissions(getStoredAdmissions());
  }, []);

  const total = admissions.length;
  const pending = admissions.filter((a) => a.status === "Pending").length;
  const approved = admissions.filter((a) => a.status === "Approved").length;
  const declined = admissions.filter((a) => a.status === "Declined").length;

  const handleAction = (id: string, action: "Approve" | "Decline") => {
    const updated = admissions.map((item) => {
      if (item.id === id) {
        return { ...item, status: action === "Approve" ? ("Approved" as const) : ("Declined" as const) };
      }
      return item;
    });

    setAdmissions(updated);
    saveAdmissions(updated);

    const targetRequest = admissions.find((item) => item.id === id);
    if (!targetRequest) return;

    if (action === "Approve") {
      // Add student to the student list
      const studentsList = getStoredStudents();
      const generatedId = `R-${String(1000 + studentsList.length + 1)}`;
      const newStudent: Student = {
        id: generatedId,
        name: targetRequest.name,
        grade: targetRequest.grade,
        program: targetRequest.program,
        guardian: targetRequest.guardianName,
        performance: 90, // default starting
        attendance: 100, // default starting
        behavior: "Excellent",
        lastReport: "Admitted via Admissions Portal",
        avatarSeed: targetRequest.name.toLowerCase().split(" ")[0],
      };

      const updatedStudents = [...studentsList, newStudent];
      saveStudents(updatedStudents);
      toast.success(`${targetRequest.name} has been enrolled in ${targetRequest.grade}.`);
    } else {
      toast.error(`Admission request for ${targetRequest.name} declined.`);
    }
  };

  return (
    <>
      <PageHeader
        title="Admissions Desk"
        description="Review student applications, verify guardian profiles, and enroll pupils"
        right={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-mono">
            <Sparkles className="size-3" /> Registrar online
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard label="Total Applications" value={String(total)} hint="this cycle" />
        <KpiCard label="Pending Review" value={String(pending)} accent="gold" hint="needs action" />
        <KpiCard label="Approved Admissions" value={String(approved)} accent="green" hint="enrolled" />
        <KpiCard label="Declined Applications" value={String(declined)} accent="muted" hint="archived" />
      </div>

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
                          onClick={() => handleAction(a.id, "Approve")}
                          className="h-8 w-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 grid place-items-center transition cursor-pointer"
                          title="Approve & Enroll"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(a.id, "Decline")}
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
    </>
  );
}
