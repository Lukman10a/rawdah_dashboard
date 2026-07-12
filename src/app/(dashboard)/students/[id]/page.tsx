"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Heart, ShieldAlert, Phone, Plus, Edit3 } from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { StudentDetailsActions } from "@/components/dashboard/StudentDetailsActions";
import { getStoredStudents, saveStudents } from "@/lib/persistence";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ExtendedStudent = {
  id: string;
  name: string;
  grade: string;
  program: "Islamic" | "Western" | "Dual";
  guardian: string;
  performance: number;
  attendance: number;
  behavior: string;
  lastReport: string;
  avatarSeed?: string;
  bloodGroup?: string;
  allergies?: string;
  medications?: string;
  emergencyContact?: string;
};

export default function StudentDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [student, setStudent] = useState<ExtendedStudent | null>(null);
  const [role, setRole] = useState("admin");
  const [openMedicalModal, setOpenMedicalModal] = useState(false);

  // Medical form states
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  useEffect(() => {
    // Load role
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rawdah_role="))
      ?.split("=")[1];
    if (r) {
      setRole(r);
    }

    const list = getStoredStudents() as ExtendedStudent[];
    setStudents(list);

    // Find student
    const match = list.find((s) => s.id.toLowerCase() === id.toLowerCase());
    if (match) {
      setStudent(match);
      // Pre-fill form
      setBloodGroup(match.bloodGroup || "O+");
      setAllergies(match.allergies || "None reported");
      setMedications(match.medications || "None");
      setEmergencyContact(match.emergencyContact || `${match.guardian}: +1 555 0199`);
    }
  }, [id]);

  if (students.length > 0 && !student) {
    return notFound();
  }

  if (!student) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-muted">
        Loading profile details...
      </div>
    );
  }

  const handleSaveMedical = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedList = students.map((s) => {
      if (s.id === student.id) {
        return {
          ...s,
          bloodGroup,
          allergies,
          medications,
          emergencyContact,
        };
      }
      return s;
    });

    setStudents(updatedList);
    saveStudents(updatedList as any);
    setStudent({
      ...student,
      bloodGroup,
      allergies,
      medications,
      emergencyContact,
    });
    setOpenMedicalModal(false);
    toast.success(`Medical records for ${student.name} updated successfully.`);
  };

  const isStaffOrAdmin = ["admin", "staff"].includes(role);

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.name}
        description={`${student.grade} • ${student.program} programme`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
                  Student profile
                </p>
                <h2 className="font-display text-2xl text-navy mt-2">
                  {student.name}
                </h2>
                <p className="text-sm text-ink-muted">
                  Guardian: {student.guardian}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                    Performance
                  </p>
                  <p className="mt-2 font-medium text-navy">
                    {student.performance}%
                  </p>
                </div>
                <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                    Attendance
                  </p>
                  <p className="mt-2 font-medium text-navy">
                    {student.attendance}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Behaviour
                </p>
                <p className="mt-2 font-medium text-navy">{student.behavior}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Last report
                </p>
                <p className="mt-2 font-medium text-navy">{student.lastReport}</p>
              </div>
            </div>
          </Card>

          {/* Student Medical Record Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-rose-500 fill-rose-500/10" />
                <h3 className="font-display italic text-lg text-navy">Medical Information</h3>
              </div>
              {isStaffOrAdmin && (
                <button
                  type="button"
                  onClick={() => setOpenMedicalModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-hairline bg-white hover:bg-cream text-xs font-semibold text-navy transition cursor-pointer"
                >
                  <Edit3 className="size-3.5" /> Edit Health
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-hairline p-4 bg-cream/30">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Blood Group</span>
                <span className="font-display italic text-xl mt-1 block text-navy">{student.bloodGroup || "O+"}</span>
              </div>
              <div className="rounded-xl border border-hairline p-4 bg-cream/30">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Allergies</span>
                <span className="font-medium text-sm mt-1.5 block text-navy">{student.allergies || "None reported"}</span>
              </div>
              <div className="rounded-xl border border-hairline p-4 bg-cream/30">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Chronic Meds</span>
                <span className="font-medium text-sm mt-1.5 block text-navy">{student.medications || "None"}</span>
              </div>
              <div className="rounded-xl border border-hairline p-4 bg-cream/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Emergency Contact</span>
                  <span className="font-semibold text-xs mt-1 block text-navy leading-tight">{student.emergencyContact || `${student.guardian}: +1 555 0199`}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-ink-muted mt-2">
                  <Phone className="size-3 text-gold" /> Quick dial
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
              Academic quick actions
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Review student performance, share notes with the guardian, or
              schedule a support session.
            </p>
          </div>
          <StudentDetailsActions
            name={student.name}
            guardian={student.guardian}
          />
        </Card>
      </div>

      <Dialog open={openMedicalModal} onOpenChange={setOpenMedicalModal}>
        <DialogContent className="max-w-md rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          <div className="border-b border-hairline p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">Update Health profile: {student.name}</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-ink-muted">
                Maintain accurate health history and parent emergency contact markers.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form className="space-y-4 p-6" onSubmit={handleSaveMedical}>
            <div className="space-y-2">
              <Label htmlFor="blood-group">Blood Group</Label>
              <select
                id="blood-group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Input
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Peanut allergy, Penicillin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Active Medications</Label>
              <Input
                id="medications"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. Asthma Inhaler (PRN)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-contact">Emergency Contact Detail</Label>
              <Input
                id="emergency-contact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name: +1 555 0122"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpenMedicalModal(false)}
                className="rounded-md border border-hairline px-4 py-2 text-sm text-navy"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Save Health Record
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
