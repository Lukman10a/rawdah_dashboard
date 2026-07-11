"use client";

import { useEffect, useState } from "react";
import RowLink from "@/components/dashboard/RowLink";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredStaff, saveStaff } from "@/lib/persistence";
import type { StaffMember } from "@/lib/mock-data";

export default function StaffPage() {
  const [list, setList] = useState<StaffMember[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setList(getStoredStaff());
  }, []);

  const handleAddStaff = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !role.trim() || !department.trim() || !email.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const nextIdNum = list.length + 1;
    const generatedId = `S-${String(nextIdNum).padStart(3, "0")}`;

    const newMember: StaffMember = {
      id: generatedId,
      name,
      role,
      department,
      status: "Active",
      email,
      joined: new Date().toISOString().split("T")[0],
    };

    const updated = [...list, newMember];
    setList(updated);
    saveStaff(updated);
    setOpen(false);
    toast.success(`Registered ${name} as ${role}.`);

    // Reset inputs
    setName("");
    setRole("");
    setDepartment("");
    setEmail("");
  };

  const filtered = list.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <PageHeader
        title="Staff Directory"
        description="Administrative, welfare and operations personnel"
        right={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110"
          >
            <Plus className="size-4" /> Add staff
          </button>
        }
      />
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-hairline flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display italic text-lg">Staff Roster</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff members..."
              className="pl-9 pr-4 h-9 w-64 rounded-md bg-cream/60 border border-hairline text-sm outline-none focus:ring-2 focus:ring-gold/30 text-navy"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
              <th className="px-6 py-3">Member</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-hairline">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-cream/40 transition-colors">
                <td className="px-6 py-4">
                  <RowLink href={`/staff/${s.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-linear-to-br from-cream to-gold-soft grid place-items-center text-navy text-xs font-bold">
                        {s.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <div>
                        <div className="font-medium text-navy">{s.name}</div>
                        <div className="text-[11px] text-ink-muted">
                          {s.email}
                        </div>
                      </div>
                    </div>
                  </RowLink>
                </td>
                <td className="px-6 py-4">
                  <RowLink href={`/staff/${s.id}`}>{s.role}</RowLink>
                </td>
                <td className="px-6 py-4 text-ink-muted">
                  <RowLink href={`/staff/${s.id}`}>{s.department}</RowLink>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  <RowLink href={`/staff/${s.id}`}>{s.joined}</RowLink>
                </td>
                <td className="px-6 py-4">
                  <RowLink href={`/staff/${s.id}`}>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        s.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </RowLink>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-ink-muted">
                  No staff members match the search query.
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
              <DialogTitle className="font-display text-2xl text-navy">
                Add a staff member
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-ink-muted">
                Create a persistent record for a new administration or support team member.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form className="space-y-4 p-6" onSubmit={handleAddStaff}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Full name</Label>
                <Input
                  id="staff-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amina Yusuf"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-role">Role</Label>
                <Input
                  id="staff-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Registrar"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="staff-department">Department</Label>
                <Input
                  id="staff-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Operations"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@rawdah.edu"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-hairline px-4 py-2 text-sm text-navy"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream"
              >
                Save record
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
