"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BookOpenCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  UserPlus,
  Send,
  CreditCard,
  Download,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  KpiCard,
  PageHeader,
} from "@/components/dashboard/dashboard-shell";
import {
  aiInsights,
  computePay,
  enrollmentSeries,
  notifications,
  parentUpdates,
} from "@/lib/mock-data";
import {
  getStoredTeachers,
  saveTeachers,
  getStoredStudents,
  getStoredParents,
  saveParents,
} from "@/lib/persistence";
import type { Teacher, Student, Parent } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

const insightIcon = {
  "Attendance Pattern": Sparkles,
  "Leave Pattern": Sparkles,
  Curriculum: BookOpenCheck,
  "Payroll Forecast": Wallet,
  "Student Risk": TrendingUp,
} as const;

export default function DashboardPage() {
  const [role, setRole] = useState("admin");
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [parentsList, setParentsList] = useState<ExtendedParent[]>([]);

  // Active parent details for parent dashboard session
  const [parentUser, setParentUser] = useState<ExtendedParent | null>(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  // Timesheet Form States
  const [logDate, setLogDate] = useState("");
  const [logHours, setLogHours] = useState("4");
  const [logTopic, setLogTopic] = useState("");

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

    // Default to the first parent profile (Amina Bello) as active session user
    if (mapped.length > 0) {
      setParentUser(mapped[0]);
    }
  }, []);

  // Preset Teacher: Ustadh Omar (T-001) for timesheet logging updates
  const teacherUser = teachersList.find((t) => t.id === "T-001") || teachersList[0];

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

  const handlePayOutstanding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentUser || (parentUser.balance || 0) <= 0) return;

    if (!cardNumber || !cardExpiry || !cardCvc || !cardName.trim()) {
      toast.error("Please complete all credit card fields.");
      return;
    }

    setPaymentProcessing(true);

    // Simulate online gateway latency
    setTimeout(() => {
      setPaymentProcessing(false);
      setOpenPaymentModal(false);

      const payAmount = parentUser.balance || 0;
      const newReceipt: Receipt = {
        receiptId: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split("T")[0],
        amount: payAmount,
        method: "Credit Card (Mock Gateway)",
        invoiceRef: `INV-2026-${Math.floor(200 + Math.random() * 800)}`,
      };

      const updatedParents = parentsList.map((p) => {
        if (p.id === parentUser.id) {
          return {
            ...p,
            balance: 0,
            tuitionStatus: "Paid" as const,
            receipts: [newReceipt, ...(p.receipts || [])],
          };
        }
        return p;
      });

      setParentsList(updatedParents);
      saveParents(updatedParents);
      setParentUser({
        ...parentUser,
        balance: 0,
        tuitionStatus: "Paid",
        receipts: [newReceipt, ...(parentUser.receipts || [])],
      });

      toast.success(`Transaction Approved! Mock Payment of $${payAmount.toLocaleString()} processed successfully.`);

      // Reset form
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
      setCardName("");
    }, 2200);
  };

  // --- 1. ADMIN & STAFF DASHBOARD VIEW ---
  if (role === "admin" || role === "staff") {
    const monthlyPayroll = teachersList.reduce((s, t) => s + computePay(t), 0);
    const activeTeachers = teachersList.filter((t) => t.status === "Active").length;

    return (
      <>
        <PageHeader
          title="Institutional Overview"
          description="Real-time intelligence for Rawdatul Atfaal · Term III"
          right={
            <div className="flex items-center gap-2 text-xs text-ink-muted font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Live sync
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            label="Total Students"
            value="1,248"
            hint="+4.2% vs last term"
            accent="green"
          />
          <KpiCard
            label="Active Teachers"
            value={String(activeTeachers)}
            hint="98% attendance"
            accent="muted"
          />
          <KpiCard
            label="Monthly Payroll"
            value={`$${monthlyPayroll.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            hint="Forecast: +$1.2k"
            accent="gold"
          />
          <KpiCard label="Attendance Rate" value="94.2%" progress={94} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="font-display italic text-lg">
                  Enrollment & Performance
                </h3>
                <p className="text-xs text-ink-muted">
                  Six lunar months, whole institute
                </p>
              </div>
              <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-navy" /> Enrollment
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-gold" /> Performance
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={enrollmentSeries}
                  margin={{ left: -10, right: 10, top: 5 }}
                >
                  <defs>
                    <linearGradient id="fillNavy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a1834" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#0a1834" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4a94a" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#d4a94a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#0a18341a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#6b7691" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7691" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid rgba(10,24,52,0.1)",
                      fontSize: 12,
                      fontFamily: "Inter",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrollment"
                    stroke="#0a1834"
                    strokeWidth={2}
                    fill="url(#fillNavy)"
                  />
                  <Area
                    type="monotone"
                    dataKey="performance"
                    stroke="#d4a94a"
                    strokeWidth={2}
                    fill="url(#fillGold)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Intelligence Center
            </h3>

            {aiInsights.slice(0, 3).map((it, i) => {
              const Icon =
                insightIcon[it.kind as keyof typeof insightIcon] ?? Sparkles;
              const dark = i === 0;

              return (
                <div
                  key={it.id}
                  className={`p-4 rounded-xl border transition-all ${
                    dark
                      ? "bg-navy text-cream border-gold/30 hover:shadow-xl hover:shadow-gold/5"
                      : "bg-white border-hairline"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[10px] font-mono ${dark ? "text-gold" : "text-ink-muted"}`}
                    >
                      {String(i + 1).padStart(2, "0")} · {it.kind}
                    </span>
                    <div
                      className={`size-6 rounded-full grid place-items-center ${dark ? "bg-gold/20" : "bg-cream"}`}
                    >
                      <Icon
                        className={`size-3 ${dark ? "text-gold" : "text-navy"}`}
                      />
                    </div>
                  </div>
                  <p
                    className={`font-medium mt-3 text-sm ${dark ? "text-cream" : "text-navy"}`}
                  >
                    {it.title}
                  </p>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${dark ? "text-cream/70" : "text-ink-muted"}`}
                  >
                    {it.detail}
                  </p>
                </div>
              );
            })}
            <Link
              href="/ai-insights"
              className="inline-flex items-center gap-1 text-xs text-navy font-medium hover:text-gold"
            >
              View all insights <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="p-6 border-b border-hairline flex justify-between items-center">
              <div>
                <h3 className="font-display italic text-lg">
                  Teaching Faculty Payroll
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Hourly instructors · current month
                </p>
              </div>
              <Link
                href="/payroll"
                className="text-xs text-navy/70 hover:text-navy underline underline-offset-4"
              >
                Open payroll
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                    <th className="px-6 py-3">Faculty</th>
                    <th className="px-6 py-3">Specialization</th>
                    <th className="px-6 py-3">Rate</th>
                    <th className="px-6 py-3">Hours</th>
                    <th className="px-6 py-3 text-right">Monthly Pay</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-hairline">
                  {teachersList
                    .filter((t) => t.employmentType === "Hourly")
                    .slice(0, 6)
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-cream/30">
                        <td className="px-6 py-4">
                          <div className="font-medium text-navy">{t.name}</div>
                          <div className="text-[11px] text-ink-muted font-mono">
                            {t.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-ink-muted">
                          {t.specialization}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          ${t.hourlyRate}/hr
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {t.hoursLogged}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-navy">
                          ${computePay(t).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display italic text-lg">Parent Updates</h3>
                <p className="text-xs text-ink-muted">Recent guardian messages</p>
              </div>
            </div>
            <div className="space-y-3">
              {parentUpdates.slice(0, 4).map((u, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-cream/50 border border-hairline"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-navy">{u.child}</p>
                      <p className="text-[11px] text-ink-muted">{u.note}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold">
                      {u.type}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] font-mono text-ink-muted">
                    {u.when}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-ink-muted mb-3">
                Notifications
              </h4>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((n, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="size-2 rounded-full bg-gold mt-1.5 shrink-0" />
                    <div>
                      <p className="text-navy text-sm">{n.title}</p>
                      <p className="text-ink-muted text-xs">{n.desc}</p>
                      <p className="text-ink-muted text-[10px] font-mono mt-0.5">
                        {n.when}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // --- 2. TEACHER DASHBOARD VIEW ---
  if (role === "teacher") {
    return (
      <>
        <PageHeader
          title={`Ahlan, ${teacherUser?.title || "Ustadh"} ${teacherUser?.name.split(" ").slice(-1)[0] || "Omar"}`}
          description={`Instructor Load Management · Specialist in ${teacherUser?.specialization || "Qur'anic Sciences"}`}
          right={
            <div className="flex items-center gap-2 text-xs text-gold font-mono">
              <span className="size-2 rounded-full bg-gold animate-pulse" />{" "}
              Timetable Active
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <KpiCard
            label="My Students"
            value="42"
            hint="Grade 2 & Grade 5 pupils"
            accent="green"
          />
          <KpiCard
            label="Teaching Load"
            value="6 classes"
            hint="Tajweed & Fiqh blocks"
          />
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
            <p className="text-xs text-ink-muted mb-4">
              Submit teaching hours to update your payroll file.
            </p>
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

  // --- 3. STUDENT & PARENT ACADEMIC OVERVIEW VIEW ---
  if (role === "student" || role === "parent") {
    // Locate Zaid Rahman student record
    const targetStudent = studentsList.find((s) => s.id === "R-1001") || studentsList[0];

    return (
      <>
        <PageHeader
          title={role === "student" ? `Assalamu alaikum, ${targetStudent?.name || "Zaid"}` : `Parent Hub: ${targetStudent?.name || "Zaid Rahman"}`}
          description={`Assigned Grade: ${targetStudent?.grade || "Grade 2"} · Dual Curriculum Programme`}
          right={
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Syllabus Aligned
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <KpiCard
            label="My Performance"
            value={`${targetStudent?.performance || 0}%`}
            progress={targetStudent?.performance || 0}
          />
          <KpiCard
            label="My Attendance"
            value={`${targetStudent?.attendance || 0}%`}
            accent="green"
            hint="Target: 95%"
          />
          <KpiCard
            label="Behaviour State"
            value={targetStudent?.behavior || "Good"}
            hint="Based on teacher reviews"
            accent="gold"
          />
          {role === "parent" ? (
            <KpiCard
              label="Outstanding Balance"
              value={`$${(parentUser?.balance || 0).toLocaleString()}`}
              hint={parentUser?.tuitionStatus === "Paid" ? "Tuition fully Paid" : "Tuition Fee Pending"}
              accent={parentUser?.tuitionStatus === "Paid" ? "green" : "gold"}
            />
          ) : (
            <KpiCard
              label="Term reports"
              value="Term III"
              hint="Final assessment pending"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="font-display italic text-lg">My Subject Performance</h3>
                <p className="text-xs text-ink-muted">Individual Grade Scores</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { subject: "Tajweed", score: 94 },
                    { subject: "Mathematics", score: 88 },
                    { subject: "Science", score: 91 },
                    { subject: "Fiqh", score: 92 },
                    { subject: "English", score: 86 },
                  ]}
                  margin={{ left: -10, right: 10, top: 5 }}
                >
                  <defs>
                    <linearGradient id="fillNavyClass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a1834" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#0a1834" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0a18341a" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7691" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#6b7691" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="#0a1834" strokeWidth={2} fill="url(#fillNavyClass)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {role === "parent" ? (
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display italic text-lg text-navy mb-2 flex items-center gap-1.5">
                  <Wallet className="size-5 text-gold" /> Tuition Billing Portal
                </h3>
                <p className="text-xs text-ink-muted mb-4">
                  Review invoice statements, receipts log, and complete school fees payment.
                </p>
                <div className="p-4 rounded-xl border border-hairline bg-cream/35 mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-ink-muted">Current Invoice balance</span>
                  <span className="text-2xl font-semibold text-navy block mt-1">${(parentUser?.balance || 0).toLocaleString()}</span>
                  <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${parentUser?.tuitionStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {parentUser?.tuitionStatus}
                  </span>
                </div>
              </div>
              <div>
                {(parentUser?.balance || 0) > 0 ? (
                  <button
                    type="button"
                    onClick={() => setOpenPaymentModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-md bg-navy text-gold hover:brightness-110 text-xs font-semibold transition cursor-pointer"
                  >
                    <CreditCard className="size-4" /> Pay Balance Online
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 text-center font-medium">
                    🎉 Tuition balance is fully cleared.
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="font-display italic text-lg mb-4 text-navy">Academic Praise Feed</h3>
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs leading-relaxed text-emerald-800">
                  <span className="font-semibold block mb-0.5">Recitation Award Flagged</span>
                  Assigned star award for excellent recitation in Qur'anic Tajweed.
                </div>
                <div className="p-3 bg-cream/80 border border-hairline rounded-lg text-xs leading-relaxed text-navy">
                  <span className="font-semibold block mb-0.5">Math Homework Clear</span>
                  Completed Advanced Mathematics foundation week 4 tasks with 94% score.
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Parent Billing Receipts Log on parent dashboard */}
        {role === "parent" && parentUser && (
          <Card className="p-6">
            <h3 className="font-display italic text-lg mb-4 text-navy flex items-center gap-1.5">
              <CheckCircle className="size-4 text-emerald-600" /> My Fee Receipts Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                    <th className="px-6 py-2.5">Receipt ID</th>
                    <th className="px-6 py-2.5">Invoice Ref</th>
                    <th className="px-6 py-2.5">Date Paid</th>
                    <th className="px-6 py-2.5">Payment Method</th>
                    <th className="px-6 py-2.5">Amount</th>
                    <th className="px-6 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {parentUser.receipts?.map((r) => (
                    <tr key={r.receiptId} className="hover:bg-cream/30">
                      <td className="px-6 py-3 font-semibold text-navy">{r.receiptId}</td>
                      <td className="px-6 py-3 text-ink-muted">{r.invoiceRef}</td>
                      <td className="px-6 py-3 font-mono text-xs">{r.date}</td>
                      <td className="px-6 py-3 text-ink-muted">{r.method}</td>
                      <td className="px-6 py-3 font-mono font-bold text-navy">${r.amount.toLocaleString()}</td>
                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => toast.success(`Mock PDF downloaded for ${r.receiptId}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cream hover:bg-gold/15 text-navy font-semibold text-xs border border-hairline cursor-pointer"
                        >
                          <Download className="size-3" /> Receipt PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!parentUser.receipts || parentUser.receipts.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-ink-muted">
                        No billing transaction receipts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Mock Credit Card Payment Dialog */}
        <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
          <DialogContent className="max-w-md rounded-2xl border border-hairline bg-white p-0 shadow-2xl overflow-hidden">
            <div className="border-b border-hairline p-6 bg-white">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-navy flex items-center gap-2">
                  <CreditCard className="size-6 text-gold" /> Payment Checkout
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-ink-muted">
                  Rawdah SMS checkout portal. Enter dummy card credentials to clear fees balance.
                </DialogDescription>
              </DialogHeader>
            </div>
            <form className="space-y-4 p-6 bg-white" onSubmit={handlePayOutstanding}>
              <div className="space-y-1">
                <Label htmlFor="checkout-name">Cardholder Name</Label>
                <Input
                  id="checkout-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="h-10"
                  disabled={paymentProcessing}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="checkout-number">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
                  <Input
                    id="checkout-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="pl-9 h-10"
                    disabled={paymentProcessing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-expiry">Expiry Date</Label>
                  <Input
                    id="checkout-expiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="h-10"
                    disabled={paymentProcessing}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-cvc">CVC / CVV</Label>
                  <Input
                    id="checkout-cvc"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="h-10"
                    disabled={paymentProcessing}
                  />
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs leading-relaxed text-amber-700 flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>This checkout is a secure mockup for frontend demonstration. Do not enter real credit card numbers.</span>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenPaymentModal(false)}
                  className="rounded-md border border-hairline px-4 py-2 text-sm text-navy cursor-pointer"
                  disabled={paymentProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-navy hover:brightness-110 px-5 py-2 text-sm font-semibold text-cream cursor-pointer disabled:opacity-50"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                      Processing gateway...
                    </span>
                  ) : (
                    `Pay $${(parentUser?.balance || 0).toLocaleString()}`
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}
