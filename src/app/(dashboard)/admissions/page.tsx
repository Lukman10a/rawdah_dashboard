"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/dashboard-shell";
import {
  getStoredAdmissions,
  saveAdmissions,
  getStoredStudents,
  saveStudents,
  AdmissionRequest,
} from "@/lib/persistence";
import type { Student } from "@/lib/mock-data";
import { AdmissionsStats } from "@/components/dashboard/admissions/AdmissionsStats";
import { AdmissionsTable } from "@/components/dashboard/admissions/AdmissionsTable";

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
        return {
          ...item,
          status: action === "Approve" ? ("Approved" as const) : ("Declined" as const),
        };
      }
      return item;
    });

    setAdmissions(updated);
    saveAdmissions(updated);

    const targetRequest = admissions.find((item) => item.id === id);
    if (!targetRequest) return;

    if (action === "Approve") {
      const studentsList = getStoredStudents();
      const generatedId = `R-${String(1000 + studentsList.length + 1)}`;
      const newStudent: Student = {
        id: generatedId,
        name: targetRequest.name,
        grade: targetRequest.grade,
        program: targetRequest.program,
        guardian: targetRequest.guardianName,
        performance: 90,
        attendance: 100,
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

      <AdmissionsStats
        total={total}
        pending={pending}
        approved={approved}
        declined={declined}
      />

      <AdmissionsTable
        admissions={admissions}
        onAction={handleAction}
      />
    </>
  );
}
