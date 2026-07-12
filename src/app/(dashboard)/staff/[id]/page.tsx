"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Award, Edit3 } from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { StaffDetailsActions } from "@/components/dashboard/StaffDetailsActions";
import { getStoredStaff, saveStaff } from "@/lib/persistence";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ExtendedStaff = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  joined: string;
  status: string;
  avatarSeed?: string;
  degrees?: string;
  certifications?: string;
  hireDate?: string;
};

export default function StaffDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [staffList, setStaffList] = useState<ExtendedStaff[]>([]);
  const [member, setMember] = useState<ExtendedStaff | null>(null);
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

    const list = getStoredStaff() as ExtendedStaff[];
    setStaffList(list);

    // Find member
    const match = list.find((m) => m.id.toLowerCase() === id.toLowerCase());
    if (match) {
      setMember(match);
      // Pre-fill form
      setDegrees(match.degrees || "Bachelor of Business Administration");
      setCertifications(match.certifications || "Certified School Business Official (CSBO)");
      setHireDate(match.hireDate || match.joined || "2024-10-01");
    }
  }, [id]);

  if (staffList.length > 0 && !member) {
    return notFound();
  }

  if (!member) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-muted">
        Loading staff profile...
      </div>
    );
  }

  const handleSaveQualifications = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedList = staffList.map((m) => {
      if (m.id === member.id) {
        return {
          ...m,
          degrees,
          certifications,
          hireDate,
        };
      }
      return m;
    });

    setStaffList(updatedList);
    saveStaff(updatedList as any);
    setMember({
      ...member,
      degrees,
      certifications,
      hireDate,
    });
    setOpenQualsModal(false);
    toast.success(`Qualifications for ${member.name} updated successfully.`);
  };

  const isStaffOrAdmin = ["admin", "staff"].includes(role);

  return (
    <div className="space-y-6">
      <PageHeader
        title={member.name}
        description={`${member.role} • ${member.department}`}
        right={
          <div className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream">
            {member.status}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted font-medium">
                  Profile
                </p>
                <h2 className="font-display text-2xl text-navy mt-2">
                  {member.name}
                </h2>
                <p className="text-sm text-ink-muted">
                  {member.role} in {member.department}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                    Email
                  </p>
                  <p className="mt-2 font-medium text-navy">{member.email}</p>
                </div>
                <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                    Joined
                  </p>
                  <p className="mt-2 font-medium text-navy">{member.joined}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Department
                </p>
                <p className="mt-2 font-medium text-navy">{member.department}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-white p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Status
                </p>
                <p className="mt-2 font-medium text-navy">{member.status}</p>
              </div>
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
                <span className="font-medium text-sm text-navy mt-1 block">{member.degrees || "Bachelor of Business Administration"}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Certifications & Licenses</span>
                <span className="font-medium text-sm text-navy mt-1 block">{member.certifications || "Certified School Business Official (CSBO)"}</span>
              </div>
              <div className="flex gap-8 border-t border-hairline pt-4 mt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink-muted font-mono block">Hiring Date</span>
                  <span className="font-semibold text-xs text-navy mt-1 block">{member.hireDate || member.joined || "2024-10-01"}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
              Administrative quick actions
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Review current profile settings, modify status alerts, or write department memos.
            </p>
          </div>
          <StaffDetailsActions name={member.name} currentStatus={member.status as any} />
        </Card>
      </div>

      <Dialog open={openQualsModal} onOpenChange={setOpenQualsModal}>
        <DialogContent className="max-w-md rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          <div className="border-b border-hairline p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">Edit Qualifications: {member.name}</DialogTitle>
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
                placeholder="e.g. B.Sc. in Accounting & School Administration"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certs-input">Certifications</Label>
              <Input
                id="certs-input"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="e.g. Certified School Business Official (CSBO)"
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
