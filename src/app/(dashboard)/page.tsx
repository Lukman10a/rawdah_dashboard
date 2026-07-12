"use client";

import { useEffect, useState } from "react";
import { getStoredTeachers, getStoredStudents, getStoredParents, saveParents } from "@/lib/persistence";
import type { Teacher, Student, Parent } from "@/lib/mock-data";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentParentDashboard } from "@/components/dashboard/StudentParentDashboard";

type Receipt = {
  receiptId: string;
  date: string;
  amount: number;
  method: string;
  invoiceRef: string;
};

type ExtendedParent = Parent & {
  tuitionStatus?: "Paid" | "Pending" | "Overdue";
  balance?: number;
  receipts?: Receipt[];
};

export default function DashboardPage() {
  const [role, setRole] = useState("admin");
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [parentsList, setParentsList] = useState<ExtendedParent[]>([]);
  const [parentUser, setParentUser] = useState<ExtendedParent | null>(null);

  useEffect(() => {
    // Retrieve role cookie
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rawdah_role="))
      ?.split("=")[1];
    if (r) {
      setRole(r);
    }

    setTeachersList(getStoredTeachers());
    setStudentsList(getStoredStudents());

    // Load parents list
    const pList = getStoredParents() as ExtendedParent[];
    const mapped = pList.map((p, i) => ({
      ...p,
      tuitionStatus: p.tuitionStatus || (i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue"),
      balance: p.balance !== undefined ? p.balance : (i % 3 === 0 ? 0 : i % 3 === 1 ? 1250 : 2500),
      receipts: p.receipts || [
        {
          receiptId: `REC-${10234 + i}`,
          date: "2026-06-15",
          amount: 1250,
          method: "Bank Transfer",
          invoiceRef: `INV-2026-${100 + i}`,
        },
        {
          receiptId: `REC-${9812 + i}`,
          date: "2026-03-10",
          amount: 1250,
          method: "Card Payment",
          invoiceRef: `INV-2026-${50 + i}`,
        }
      ]
    }));
    setParentsList(mapped);
    saveParents(mapped);

    if (mapped.length > 0) {
      setParentUser(mapped[0]);
    }
  }, []);

  const teacherUser = teachersList.find((t) => t.id === "T-001") || teachersList[0];

  if (role === "admin" || role === "staff") {
    return <AdminDashboard teachersList={teachersList} />;
  }

  if (role === "teacher") {
    return (
      <TeacherDashboard
        teacherUser={teacherUser}
        teachersList={teachersList}
        setTeachersList={setTeachersList}
      />
    );
  }

  if (role === "student" || role === "parent") {
    return (
      <StudentParentDashboard
        role={role}
        studentsList={studentsList}
        parentUser={parentUser}
        setParentUser={setParentUser}
        parentsList={parentsList}
        setParentsList={setParentsList}
      />
    );
  }

  return null;
}
