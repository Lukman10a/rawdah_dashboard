"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, Send } from "lucide-react";

import { Card, KpiCard, PageHeader } from "@/components/dashboard/dashboard-shell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { computePay } from "@/lib/mock-data";
import { saveTeachers } from "@/lib/persistence";
import type { Teacher } from "@/lib/mock-data";

export function TeacherDashboard({
  teacherUser,
  teachersList,
  setTeachersList,
}: {
  teacherUser: Teacher;
  teachersList: Teacher[];
  setTeachersList: (t: Teacher[]) => void;
}) {
  // Timesheet Form States
  const [logDate, setLogDate] = useState("");
  const [logHours, setLogHours] = useState("4");
  const [logTopic, setLogTopic] = useState("");

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDate || !logTopic.trim() || !logHours) {
      toast.error("Please fill in the log details.");
      return;
    }

    const hours = parseFloat(logHours);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter a valid hours count.");
      return;
    }

    // Update T-001 hoursLogged in localStorage
    const updated = teachersList.map((t) => {
      if (t.id === (teacherUser?.id || "T-001")) {
        return {
          ...t,
          hoursLogged: t.hoursLogged + hours,
        };
      }
      return t;
    });

    setTeachersList(updated);
    saveTeachers(updated);
    toast.success(`Logged ${hours} hours for "${logTopic}" on ${logDate}. Paid amount updated.`);

    // Reset inputs
    setLogDate("");
    setLogTopic("");
  };

  return (
    <>
      <PageHeader
        title={`Ahlan, ${teacherUser?.title || "Ustadh"} ${teacherUser?.name.split(" ").slice(-1)[0] || "Omar"}`}
        description={`Instructor Load Management · Specialist in ${teacherUser?.specialization || "Qur'anic Sciences"}`}
        right={
          <div className="flex items-center gap-2 text-xs text-gold font-mono">
            <span className="size-2 rounded-full bg-gold animate-pulse" /> Timetable Active
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard label="My Students" value="42" hint="Grade 2 & Grade 5 pupils" accent="green" />
        <KpiCard label="Teaching Load" value="6 classes" hint="Tajweed & Fiqh blocks" />
        <KpiCard
          label="Hours Logged"
          value={`${teacherUser?.hoursLogged || 0} hrs`}
          hint={`Current Rate: $${teacherUser?.hourlyRate || 0}/hr`}
          accent="gold"
        />
        <KpiCard
          label="Pending Invoices"
          value={`$${computePay(teacherUser).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          hint="Accrued payment logs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-display italic text-lg">My Class Performance Progress</h3>
              <p className="text-xs text-ink-muted">Term Exam Averages (Percentage)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: "Muharram", score: 82 },
                  { month: "Safar", score: 85 },
                  { month: "Rabi' I", score: 84 },
                  { month: "Rabi' II", score: 88 },
                  { month: "Jumada I", score: 90 },
                  { month: "Jumada II", score: 92 },
                ]}
                margin={{ left: -10, right: 10, top: 5 }}
              >
                <defs>
                  <linearGradient id="fillGoldClass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a94a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d4a94a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0a18341a" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7691" }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#6b7691" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid rgba(10,24,52,0.1)", fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#d4a94a" strokeWidth={2} fill="url(#fillGoldClass)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display italic text-lg mb-2 text-navy flex items-center gap-2">
            <Clock className="size-4 text-gold" /> Log Worked Hours
          </h3>
          <p className="text-xs text-ink-muted mb-4">Submit teaching hours to update your payroll file.</p>
          <form onSubmit={handleLogHours} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="log-date" className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Date:</Label>
              <Input
                id="log-date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="log-hours" className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Hours Logged:</Label>
              <select
                id="log-hours"
                value={logHours}
                onChange={(e) => setLogHours(e.target.value)}
                className="h-9 w-full rounded-md border border-hairline bg-cream/60 px-3 text-xs text-navy outline-none"
              >
                <option value="2">2.0 hrs</option>
                <option value="3">3.0 hrs</option>
                <option value="4">4.0 hrs</option>
                <option value="5">5.0 hrs</option>
                <option value="6">6.0 hrs</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="log-topic" className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Lesson Description:</Label>
              <Input
                id="log-topic"
                value={logTopic}
                onChange={(e) => setLogTopic(e.target.value)}
                placeholder="e.g. Surah Al-Mulk verse 1-5 Tajweed"
                className="h-9 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md bg-navy text-gold hover:brightness-110 text-xs font-semibold transition cursor-pointer mt-2"
            >
              <Send className="size-3" /> Log Timesheet
            </button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display italic text-lg mb-4 text-navy">My Teaching Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                <th className="px-6 py-2.5">Class Block</th>
                <th className="px-6 py-2.5">Subject</th>
                <th className="px-6 py-2.5">Timings</th>
                <th className="px-6 py-2.5">Room</th>
                <th className="px-6 py-2.5 text-right">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              <tr className="hover:bg-cream/30">
                <td className="px-6 py-3 font-semibold text-navy">Grade 2A</td>
                <td className="px-6 py-3 text-ink-muted">Qur'an Tajweed Foundation</td>
                <td className="px-6 py-3 font-mono text-xs">Mon, Wed · 08:30 - 10:00</td>
                <td className="px-6 py-3 text-ink-muted">Hall 3</td>
                <td className="px-6 py-3 text-right font-mono">18</td>
              </tr>
              <tr className="hover:bg-cream/30">
                <td className="px-6 py-3 font-semibold text-navy">Grade 5B</td>
                <td className="px-6 py-3 text-ink-muted">Tajweed Recitation & Memorization</td>
                <td className="px-6 py-3 font-mono text-xs">Tue, Thu · 10:30 - 12:00</td>
                <td className="px-6 py-3 text-ink-muted">Room 10</td>
                <td className="px-6 py-3 text-right font-mono">24</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
