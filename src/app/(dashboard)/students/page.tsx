"use client";

import { useEffect, useState } from "react";
import RowLink from "@/components/dashboard/RowLink";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredStudents, saveStudents } from "@/lib/persistence";
import type { Student } from "@/lib/mock-data";

export default function StudentsPage() {
  const [list, setList] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState<"All" | "Islamic" | "Western" | "Dual">("All");
  const [role, setRole] = useState("admin");

  // Form states
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [program, setProgram] = useState<"Islamic" | "Western" | "Dual">("Dual");
  const [guardian, setGuardian] = useState("");

  useEffect(() => {
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rawdah_role="))
      ?.split("=")[1];
    if (r) {
      setRole(r);
    }
    setList(getStoredStudents());
  }, []);

  const avgPerf = list.length
    ? Math.round(list.reduce((s, x) => s + x.performance, 0) / list.length)
    : 0;
  const avgAtt = list.length
    ? Math.round(list.reduce((s, x) => s + x.attendance, 0) / list.length)
    : 0;

  const handleEnrolStudent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !grade.trim() || !guardian.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const generatedId = `R-${String(1000 + list.length + 1)}`;
    const newStudent: Student = {
      id: generatedId,
      name,
      grade,
      program,
      guardian,
      performance: 85, // starting default performance
      attendance: 95,  // starting default attendance
      behavior: "Good",
      lastReport: "Just enrolled",
      avatarSeed: name.toLowerCase().split(" ")[0],
    };

    const updated = [...list, newStudent];
    setList(updated);
    saveStudents(updated);
    setOpen(false);
    toast.success(`Successfully enrolled ${name} in ${grade}.`);

    // Reset inputs
    setName("");
    setGrade("");
    setProgram("Dual");
    setGuardian("");
  };

  const filtered = list.filter((s) => {
    // If Teacher, limit to their classrooms (Grade 2 and Grade 5)
    if (role === "teacher" && !["Grade 2", "Grade 5"].includes(s.grade)) {
      return false;
    }

    // Program filter
    if (programFilter !== "All" && s.program !== programFilter) return false;

    // Search query
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.grade.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query) ||
      s.guardian.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <PageHeader
        title={role === "teacher" ? "My Students" : "Students"}
        description={role === "teacher" ? "Registries for Grade 2 and Grade 5 classrooms" : "Enrolment, performance and behaviour signals"}
        right={
          role === "staff" || role === "admin" ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110"
            >
              <Plus className="size-4" /> Enrol student
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Enrolled"
          value={String(role === "teacher" ? filtered.length : "1,248")}
          hint={role === "teacher" ? "classroom roster" : "+58 this term"}
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
          value={role === "teacher" ? String(filtered.filter((s) => s.performance < 75).length) : "14"}
          hint="needs academic support"
          accent="gold"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-display italic text-lg">Student Registry</h3>
            <div className="flex gap-1.5">
              {(["All", "Dual", "Islamic", "Western"] as const).map((prog) => (
                <button
                  key={prog}
                  onClick={() => setProgramFilter(prog)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition cursor-pointer ${
                    programFilter === prog
                      ? "bg-cream border-hairline text-navy font-semibold shadow-xs"
                      : "border-transparent text-ink-muted hover:text-navy"
                  }`}
                >
                  {prog}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="pl-9 pr-4 h-9 w-60 rounded-md bg-cream/60 border border-hairline text-sm outline-none focus:ring-2 focus:ring-gold/30 text-navy"
            />
          </div>
        </div>

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
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-cream/40 transition-colors">
                <td className="px-6 py-4">
                  <RowLink href={`/students/${s.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-linear-to-br from-gold-soft to-gold grid place-items-center text-navy text-xs font-bold">
                        {s.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-navy">{s.name}</div>
                        <div className="text-[11px] text-ink-muted font-mono">
                          {s.id}
                        </div>
                      </div>
                    </div>
                  </RowLink>
                </td>
                <td className="px-6 py-4">
                  <RowLink href={`/students/${s.id}`}>{s.grade}</RowLink>
                </td>
                <td className="px-6 py-4">
                  <RowLink href={`/students/${s.id}`}>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-navy/5 text-navy">
                      {s.program}
                    </span>
                  </RowLink>
                </td>
                <td className="px-6 py-4 text-ink-muted">
                  <RowLink href={`/students/${s.id}`}>{s.guardian}</RowLink>
                </td>
                <td className="px-6 py-4">
                  <RowLink href={`/students/${s.id}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-navy/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-navy"
                          style={{ width: `${s.performance}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">
                        {s.performance}%
                      </span>
                    </div>
                  </RowLink>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  <RowLink href={`/students/${s.id}`}>{s.attendance}%</RowLink>
                </td>
                <td className="px-6 py-4">
                  <RowLink href={`/students/${s.id}`}>
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
                  </RowLink>
                </td>
                <td className="px-6 py-4 text-ink-muted text-xs">
                  <RowLink href={`/students/${s.id}`}>{s.lastReport}</RowLink>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-ink-muted">
                  No students match the selection criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          <div className="border-b border-hairline p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">Enrol a student</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-ink-muted">
                Create a persistent record for a new student profile and guardian link.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form className="space-y-4 p-6" onSubmit={handleEnrolStudent}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student name</Label>
                <Input
                  id="student-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hamza Bello"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-grade">Grade</Label>
                <Input
                  id="student-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Grade 7"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="student-program">Programme</Label>
                <select
                  id="student-program"
                  value={program}
                  onChange={(e) => setProgram(e.target.value as any)}
                  className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="Dual">Dual (Islamic & Western)</option>
                  <option value="Islamic">Islamic Core</option>
                  <option value="Western">Western Core</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-guardian">Guardian name</Label>
                <Input
                  id="student-guardian"
                  value={guardian}
                  onChange={(e) => setGuardian(e.target.value)}
                  placeholder="Amina Bello"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-hairline px-4 py-2 text-sm text-navy">Cancel</button>
              <button type="submit" className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream">Save record</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
