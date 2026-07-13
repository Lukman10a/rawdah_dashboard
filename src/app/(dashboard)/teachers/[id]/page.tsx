"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Award, BookOpen, Calendar, Edit3 } from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { TeacherDetailsActions } from "@/components/dashboard/TeacherDetailsActions";
import { computePay } from "@/lib/mock-data";
import { getStoredTeachers, saveTeachers } from "@/lib/persistence";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ExtendedTeacher = {
  id: string;
  name: string;
  title: string;
  specialization: string;
  employmentType: "Hourly" | "Salaried";
  hourlyRate: number;
  hoursLogged: number;
  salaryMonthly?: number;
  attendance: number;
  rating: number;
  email: string;
  phone: string;
  joined: string;
  status: string;
  avatarSeed?: string;
  degrees?: string;
  certifications?: string;
  hireDate?: string;
};

export default function TeacherDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [teachers, setTeachers] = useState<ExtendedTeacher[]>([]);
  const [teacher, setTeacher] = useState<ExtendedTeacher | null>(null);
  const [role, setRole] = useState("admin");
  const [openQualsModal, setOpenQualsModal] = useState(false);

  // Form states
  const [degrees, setDegrees] = useState("");
  const [certifications, setCertifications] = useState("");
  const [hireDate, setHireDate] = useState("");

  useEffect(() => {
    // Load role
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rawdah_role="))
      ?.split("=")[1];
    if (r) {
      setRole(r);
    }

    const list = getStoredTeachers() as ExtendedTeacher[];
    setTeachers(list);

    // Find teacher
    const match = list.find((t) => t.id.toLowerCase() === id.toLowerCase());
    if (match) {
      setTeacher(match);
      // Pre-fill form
      setDegrees(match.degrees || "Master of Arts in Islamic Education");
      setCertifications(match.certifications || "Licensed Qur'an Recitation Specialist, Certified Tajweed Instructor");
      setHireDate(match.hireDate || match.joined || "2024-09-01");
    }
  }, [id]);

  if (teachers.length > 0 && !teacher) {
    return notFound();
  }

  if (!teacher) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-muted">
        Loading instructor profile...
      </div>
    );
  }

  const handleSaveQualifications = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedList = teachers.map((t) => {
      if (t.id === teacher.id) {
        return {
          ...t,
          degrees,
          certifications,
          hireDate,
        };
      }
      return t;
    });

    setTeachers(updatedList);
    saveTeachers(updatedList as any);
    setTeacher({
      ...teacher,
      degrees,
      certifications,
      hireDate,
    });
    setOpenQualsModal(false);
    toast.success(`Qualifications for ${teacher.name} updated successfully.`);
  };

  const isStaffOrAdmin = ["admin", "staff"].includes(role);

  return (
    <div className="space-y-6">
      <PageHeader
        title={teacher.name}
        description={`${teacher.specialization} • ${teacher.employmentType}`}
        right={
          <div className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream">
            {teacher.status}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
                  Instructor details
                </p>
                <h2 className="font-display text-2xl text-navy mt-2">
                  {teacher.title} {teacher.name}
                </h2>
                <p className="text-sm text-ink-muted">{teacher.id}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                    Attendance
                  </p>
                  <p className="mt-2 font-medium text-navy">
                    {teacher.attendance}%
                  </p>
                </div>
                <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                    Rating
                  </p>
                  <p className="mt-2 font-medium text-navy">
                    {teacher.rating.toFixed(1)}/5
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Employment
                </p>
                <p className="mt-2 font-medium text-navy">
                  {teacher.employmentType}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Compensation
                </p>
                <p className="mt-2 font-medium text-navy">
                  {teacher.employmentType === "Hourly"
                    ? `$${teacher.hourlyRate.toFixed(2)}/hr`
                    : `$${teacher.salaryMonthly?.toLocaleString() ?? "0"}/mo`}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Biography
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {teacher.name} teaches {teacher.specialization} at Rawdah.{" "}
                {teacher.status === "On Leave"
                  ? "Currently on leave."
                  : "A reliable instructor with strong attendance and excellent student feedback."}
              </p>
            </div>
          </Card>

          {/* Professional Qualifications Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-gold" />
                <h3 className="font-display italic text-lg text-navy">Professional Qualifications</h3>
              </div>
              {isStaffOrAdmin && (
                <button
                  type="button"
                  onClick={() => setOpenQualsModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-hairline bg-white hover:bg-cream text-xs font-semibold text-navy transition cursor-pointer"
                >
                  <Edit3 className="size-3.5" /> Edit Qualifications
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Academic Degrees</span>
                <span className="font-medium text-sm text-navy mt-1 block">{teacher.degrees || "Master of Arts in Islamic Education"}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Certifications & Licenses</span>
                <span className="font-medium text-sm text-navy mt-1 block">{teacher.certifications || "Licensed Qur'an Recitation Specialist, Certified Tajweed Instructor"}</span>
              </div>
              <div className="flex gap-8 border-t border-hairline pt-4 mt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Hiring Date</span>
                  <span className="font-semibold text-xs text-navy mt-1 block">{teacher.hireDate || teacher.joined || "2024-09-01"}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
              Payroll summary
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Review current pay, hours, and forecasting for this teacher.
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-hairline bg-cream/90 p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Monthly total
              </div>
              <div className="mt-3 text-2xl font-semibold text-navy">
                $
                {computePay(teacher as any).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <TeacherDetailsActions
              name={teacher.name}
              payLabel={
                teacher.employmentType === "Hourly"
                  ? "Hourly contract"
                  : "Salaried"
              }
              payAmount={
                teacher.employmentType === "Hourly"
                  ? `$${teacher.hourlyRate.toFixed(2)}/hr`
                  : `$${teacher.salaryMonthly?.toLocaleString() ?? "0"}/mo`
              }
            />
          </div>
        </Card>
      </div>

      <Dialog open={openQualsModal} onOpenChange={setOpenQualsModal}>
        <DialogContent className="max-w-md rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          <div className="border-b border-hairline p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">Edit Qualifications: {teacher.name}</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-ink-muted">
                Maintain accurate records of staff degrees, license numbers, and appointment dates.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form className="space-y-4 p-6" onSubmit={handleSaveQualifications}>
            <div className="space-y-2">
              <Label htmlFor="degrees-input">Academic Degrees</Label>
              <Input
                id="degrees-input"
                value={degrees}
                onChange={(e) => setDegrees(e.target.value)}
                placeholder="e.g. Master of Arts in Islamic Jurisprudence"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certs-input">Certifications</Label>
              <Input
                id="certs-input"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="e.g. Licensed Qur'an Recitation Specialist"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hired-date">Appointment / Hire Date</Label>
              <Input
                id="hired-date"
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpenQualsModal(false)}
                className="rounded-md border border-hairline px-4 py-2 text-sm text-navy"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-cream hover:bg-navy/90"
              >
                Save Qualifications
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
