"use client";

import { useEffect, useState } from "react";
import RowLink from "@/components/dashboard/RowLink";
import { Plus, Star, Search } from "lucide-react";
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
import { computePay } from "@/lib/mock-data";
import { getStoredTeachers, saveTeachers } from "@/lib/persistence";
import type { Teacher } from "@/lib/mock-data";

export default function TeachersPage() {
  const [list, setList] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Hourly" | "Salaried">("All");

  // Form states
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [empType, setEmpType] = useState<"Hourly" | "Salaried">("Hourly");
  const [rateOrSalary, setRateOrSalary] = useState("");

  useEffect(() => {
    setList(getStoredTeachers());
  }, []);

  const hourly = list.filter((t) => t.employmentType === "Hourly");
  const salaried = list.filter((t) => t.employmentType === "Salaried");
  const totalHours = hourly.reduce((s, t) => s + t.hoursLogged, 0);
  const avgRating = list.length
    ? (list.reduce((s, t) => s + t.rating, 0) / list.length).toFixed(2)
    : "0.00";

  const handleAddTeacher = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !specialization.trim() || !rateOrSalary.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const val = parseFloat(rateOrSalary.replace(/[^0-9.]/g, ""));
    if (isNaN(val)) {
      toast.error("Please enter a valid number for Rate or Salary.");
      return;
    }

    const generatedId = `T-${String(list.length + 1).padStart(3, "0")}`;
    const newTeacher: Teacher = {
      id: generatedId,
      name,
      title: empType === "Hourly" ? "Ustadh" : "Ustadha",
      specialization,
      employmentType: empType,
      hourlyRate: empType === "Hourly" ? val : 0,
      hoursLogged: empType === "Hourly" ? 40 : 0, // default hours logged for demo
      salaryMonthly: empType === "Salaried" ? val : undefined,
      attendance: 98,
      rating: 4.8,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@rawdah.edu`,
      phone: "+1 555 0100",
      joined: new Date().toISOString().split("T")[0],
      status: "Active",
      avatarSeed: name.toLowerCase().split(" ")[0],
    };

    const updated = [...list, newTeacher];
    setList(updated);
    saveTeachers(updated);
    setOpen(false);
    toast.success(`Successfully added ${name} to teaching faculty.`);

    // Reset inputs
    setName("");
    setSpecialization("");
    setEmpType("Hourly");
    setRateOrSalary("");
  };

  const filtered = list.filter((t) => {
    // Role filter
    if (activeFilter === "Hourly" && t.employmentType !== "Hourly") return false;
    if (activeFilter === "Salaried" && t.employmentType !== "Salaried") return false;

    // Search query
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.specialization.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <PageHeader
        title="Teaching Faculty"
        description="Instructors, load, ratings and hourly-vs-salaried mix"
        right={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110"
          >
            <Plus className="size-4" /> Add teacher
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="Total Teachers"
          value={String(list.length)}
          hint={`${hourly.length} hourly · ${salaried.length} salaried`}
        />
        <KpiCard
          label="Hours Logged"
          value={totalHours.toFixed(1)}
          hint="this month"
        />
        <KpiCard
          label="Avg Rating"
          value={`${avgRating}/5`}
          accent="gold"
          hint="based on peer & parent feedback"
        />
        <KpiCard label="Retention" value="97%" progress={97} />
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-display italic text-lg">Faculty Roster</h3>
            <div className="flex gap-1.5">
              {(["All", "Hourly", "Salaried"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition cursor-pointer ${
                    activeFilter === f
                      ? "bg-cream border-hairline text-navy font-semibold shadow-xs"
                      : "border-transparent text-ink-muted hover:text-navy"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers..."
              className="pl-9 pr-4 h-9 w-60 rounded-md bg-cream/60 border border-hairline text-sm outline-none focus:ring-2 focus:ring-gold/30 text-navy"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                <th className="px-6 py-3">Teacher</th>
                <th className="px-6 py-3">Specialization</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Rate / Salary</th>
                <th className="px-6 py-3">Hours</th>
                <th className="px-6 py-3">Attendance</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3 text-right">Monthly Pay</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-hairline">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-linear-to-br from-navy-soft to-navy grid place-items-center text-cream text-xs font-bold">
                          {t.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="font-medium text-navy">{t.name}</div>
                          <div className="text-[11px] text-ink-muted">
                            {t.title} · {t.id}
                          </div>
                        </div>
                      </div>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    <RowLink href={`/teachers/${t.id}`}>
                      {t.specialization}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          t.employmentType === "Hourly"
                            ? "bg-gold/15 text-navy"
                            : "bg-navy/5 text-navy"
                        }`}
                      >
                        {t.employmentType}
                      </span>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <RowLink href={`/teachers/${t.id}`}>
                      {t.employmentType === "Hourly"
                        ? `$${t.hourlyRate.toFixed(2)}/hr`
                        : `$${t.salaryMonthly?.toLocaleString()}/mo`}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    <RowLink href={`/teachers/${t.id}`}>
                      {t.employmentType === "Hourly"
                        ? t.hoursLogged.toFixed(1)
                        : "—"}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-navy/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold"
                            style={{ width: `${t.attendance}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">
                          {t.attendance}%
                        </span>
                      </div>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <div className="inline-flex items-center gap-1 text-xs">
                        <Star className="size-3 fill-gold text-gold" />{" "}
                        {t.rating.toFixed(1)}
                      </div>
                    </RowLink>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-navy">
                    <RowLink href={`/teachers/${t.id}`}>
                      $
                      {computePay(t).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </RowLink>
                  </td>
                  <td className="px-6 py-4">
                    <RowLink href={`/teachers/${t.id}`}>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          t.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : t.status === "On Leave"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </RowLink>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-sm text-ink-muted">
                    No faculty members match the selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          <div className="border-b border-hairline p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">Add a teacher</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-ink-muted">
                Create a persistent record for a new faculty profile and teaching assignment.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form className="space-y-4 p-6" onSubmit={handleAddTeacher}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teacher-name">Full name</Label>
                <Input
                  id="teacher-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ustadha Maryam"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-specialization">Specialization</Label>
                <Input
                  id="teacher-specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Arabic Grammar"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teacher-type">Contract type</Label>
                <select
                  id="teacher-type"
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value as any)}
                  className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="Hourly">Hourly Instructor</option>
                  <option value="Salaried">Salaried Faculty</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-rate">
                  {empType === "Hourly" ? "Hourly Rate ($)" : "Monthly Salary ($)"}
                </Label>
                <Input
                  id="teacher-rate"
                  value={rateOrSalary}
                  onChange={(e) => setRateOrSalary(e.target.value)}
                  placeholder={empType === "Hourly" ? "42" : "4500"}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-hairline px-4 py-2 text-sm text-navy">Cancel</button>
              <button type="submit" className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-navy">Save record</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
