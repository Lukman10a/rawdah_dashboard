"use client";

import { useEffect, useState } from "react";
import { Sparkles, CalendarDays, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import { Label } from "@/components/ui/label";
import { attendance30d } from "@/lib/mock-data";
import { getStoredStudents, saveStudents } from "@/lib/persistence";
import type { Student } from "@/lib/mock-data";

export default function AttendancePage() {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, "Present" | "Late" | "Absent">>({});

  // KPIs states
  const [presentCount, setPresentCount] = useState(1176);
  const [lateCount, setLateCount] = useState(34);
  const [absentCount, setAbsentCount] = useState(38);

  useEffect(() => {
    const list = getStoredStudents();
    setStudentsList(list);

    // Get unique grades
    const uniqueGrades = Array.from(new Set(list.map((s) => s.grade))).sort();
    setGrades(uniqueGrades);
    if (uniqueGrades.length > 0) {
      setSelectedGrade(uniqueGrades[0]);
    }
  }, []);

  // Sync attendance sheet when selected grade changes
  useEffect(() => {
    if (!selectedGrade) return;
    const gradeStudents = studentsList.filter((s) => s.grade === selectedGrade);
    const initialSheet: Record<string, "Present" | "Late" | "Absent"> = {};
    gradeStudents.forEach((s) => {
      initialSheet[s.id] = s.attendance > 95 ? "Present" : s.attendance > 92 ? "Late" : "Absent";
    });
    setAttendanceSheet(initialSheet);
  }, [selectedGrade, studentsList]);

  const handleStatusChange = (studentId: string, status: "Present" | "Late" | "Absent") => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitRegistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrade) return;

    // Simulate saving attendance register log
    const sheetValues = Object.values(attendanceSheet);
    const pVal = sheetValues.filter((v) => v === "Present").length;
    const lVal = sheetValues.filter((v) => v === "Late").length;
    const aVal = sheetValues.filter((v) => v === "Absent").length;

    // Recalculate overview metrics slightly
    setPresentCount((prev) => prev + pVal - 5);
    setLateCount((prev) => prev + lVal - 2);
    setAbsentCount((prev) => prev + aVal - 1);

    toast.success(`Attendance registry sheet saved for ${selectedGrade}. (${pVal} Present, ${lVal} Late, ${aVal} Absent)`);
  };

  const filteredStudents = studentsList.filter((s) => s.grade === selectedGrade);

  return (
    <>
      <PageHeader
        title="Attendance Tracker"
        description="Daily register logging with AI-powered pattern detection"
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Today Present"
          value={presentCount.toLocaleString()}
          hint={`${Math.round((presentCount / 1248) * 100)}% present`}
          accent="green"
        />
        <KpiCard label="Late Arrivals" value={String(lateCount)} hint="within 15 min" accent="gold" />
        <KpiCard label="Unreported Absent" value={String(absentCount)} hint="follow-up sent" accent="muted" />
        <KpiCard
          label="Patterns Flagged"
          value="3"
          hint="AI · last 14 days"
          accent="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="font-display italic text-lg">14-day register</h3>
              <p className="text-xs text-ink-muted">Present · Late · Absent</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance30d} margin={{ left: -10, right: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#0a18341a"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#6b7691" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7691" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="present"
                  stackId="a"
                  fill="#0a1834"
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="late" stackId="a" fill="#d4a94a" />
                <Bar
                  dataKey="absent"
                  stackId="a"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-mono mb-2">
            <Sparkles className="size-3" /> Smart Leave detector
          </div>
          <h3 className="font-display italic text-lg mb-4 text-navy">AI Patterns detected</h3>
          <div className="space-y-4">
            <div className="p-3 bg-cream/80 border border-hairline rounded-lg text-xs leading-relaxed text-navy">
              <span className="font-semibold block mb-0.5">Recurring Tuesday Absences</span>
              Grade 4 Fiqh shows a recurring Tuesday absence cluster. cross-referenced with weather.
            </div>
            <div className="p-3 bg-cream/80 border border-hairline rounded-lg text-xs leading-relaxed text-navy">
              <span className="font-semibold block mb-0.5">Zuhr Break Late Arrivals</span>
              Post-break classes in Grade 6 show a pattern of late arrivals.
            </div>
            <div className="p-3 bg-cream/80 border border-hairline rounded-lg text-xs leading-relaxed text-navy">
              <span className="font-semibold block mb-0.5">Monday Sick Leave</span>
              Staff Monday sick-leave is trending 12% higher. Recommend review.
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-hairline pb-4 mb-6">
          <div>
            <h3 className="font-display italic text-xl text-navy">Daily Attendance Register</h3>
            <p className="text-xs text-ink-muted mt-1">Select class grade and record attendance for today</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="grade-select" className="text-xs font-semibold text-ink-muted uppercase">Class Grade:</Label>
            <select
              id="grade-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="h-9 rounded-md border border-hairline bg-cream/60 px-3 text-xs font-semibold text-navy outline-none focus:ring-2 focus:ring-gold/30"
            >
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmitRegistry}>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Guardian</th>
                  <th className="px-6 py-3 text-center">Present</th>
                  <th className="px-6 py-3 text-center">Late</th>
                  <th className="px-6 py-3 text-center">Absent</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-hairline">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-navy">{s.name}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-ink-muted">{s.id}</td>
                    <td className="px-6 py-3.5 text-ink-muted">{s.guardian}</td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="radio"
                        name={`status-${s.id}`}
                        checked={attendanceSheet[s.id] === "Present"}
                        onChange={() => handleStatusChange(s.id, "Present")}
                        className="size-4 accent-navy cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="radio"
                        name={`status-${s.id}`}
                        checked={attendanceSheet[s.id] === "Late"}
                        onChange={() => handleStatusChange(s.id, "Late")}
                        className="size-4 accent-gold cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="radio"
                        name={`status-${s.id}`}
                        checked={attendanceSheet[s.id] === "Absent"}
                        onChange={() => handleStatusChange(s.id, "Absent")}
                        className="size-4 accent-rose-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-ink-muted">
                      No students enrolled in this grade.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-navy hover:brightness-110 text-cream text-sm font-semibold transition cursor-pointer"
            >
              <CalendarDays className="size-4" /> Save Attendance Register
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}
