"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, CreditCard, DollarSign } from "lucide-react";
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
import { getStoredParents, saveParents } from "@/lib/persistence";
import { parentUpdates, students } from "@/lib/mock-data";

type ExtendedParent = {
  id: string;
  name: string;
  children: string[];
  email: string;
  phone: string;
  lastSeen: string;
  satisfaction: number;
  tuitionStatus?: "Paid" | "Pending" | "Overdue";
  balance?: number;
};

export default function ParentsPage() {
  const [parents, setParents] = useState<ExtendedParent[]>([]);
  const [selectedParent, setSelectedParent] = useState<ExtendedParent | null>(null);
  const [open, setOpen] = useState(false);

  // Modal form states
  const [status, setStatus] = useState<"Paid" | "Pending" | "Overdue">("Pending");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const list = getStoredParents();
    // Initialize default tuition status/balances if not existing
    const mapped = list.map((p, i) => {
      const ext = p as ExtendedParent;
      return {
        ...ext,
        tuitionStatus: ext.tuitionStatus || (i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue"),
        balance: ext.balance !== undefined ? ext.balance : (i % 3 === 0 ? 0 : i % 3 === 1 ? 1250 : 2500),
      };
    });
    setParents(mapped);
    saveParents(mapped);
  }, []);

  const handleEditBilling = (parent: ExtendedParent) => {
    setSelectedParent(parent);
    setStatus(parent.tuitionStatus || "Pending");
    setBalance(String(parent.balance || 0));
    setOpen(true);
  };

  const handleSaveBilling = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedParent) return;

    const val = parseFloat(balance.replace(/[^0-9.]/g, ""));
    if (isNaN(val)) {
      toast.error("Please enter a valid balance amount.");
      return;
    }

    const updated = parents.map((p) => {
      if (p.id === selectedParent.id) {
        return {
          ...p,
          tuitionStatus: status,
          balance: val,
        };
      }
      return p;
    });

    setParents(updated);
    saveParents(updated);
    setOpen(false);
    toast.success(`Billing for ${selectedParent.name} updated successfully.`);
  };

  return (
    <>
      <PageHeader
        title="Parent Portal"
        description="Guardian engagement, satisfaction levels, and tuition fees billing status"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-hairline">
            <h3 className="font-display italic text-lg">Guardians</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                <th className="px-6 py-3">Parent</th>
                <th className="px-6 py-3">Children</th>
                <th className="px-6 py-3">Tuition Status</th>
                <th className="px-6 py-3">Balance</th>
                <th className="px-6 py-3">Satisfaction</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-hairline">
              {parents.map((p) => (
                <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-navy">{p.name}</div>
                    <div className="text-[11px] text-ink-muted font-mono">{p.id}</div>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">
                    {p.children.join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                        p.tuitionStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.tuitionStatus === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {p.tuitionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-navy font-semibold">
                    ${p.balance?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-navy/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold"
                          style={{ width: `${p.satisfaction}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{p.satisfaction}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleEditBilling(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-hairline bg-white hover:bg-cream text-xs font-semibold text-navy transition cursor-pointer"
                    >
                      <CreditCard className="size-3.5" /> Billing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="font-display italic text-lg mb-1">What parents see</h3>
          <p className="text-xs text-ink-muted mb-4">
            Preview of a child's live update feed
          </p>
          <div className="rounded-xl bg-navy text-cream p-4 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold/80 font-mono">
                Child
              </div>
              <div className="font-medium">
                {students[0].name} · {students[0].grade}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-[10px] text-cream/60 uppercase tracking-widest">
                  Performance
                </div>
                <div className="font-display italic text-xl mt-1">
                  {students[0].performance}%
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-[10px] text-cream/60 uppercase tracking-widest">
                  Attendance
                </div>
                <div className="font-display italic text-xl mt-1">
                  {students[0].attendance}%
                </div>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-[10px] text-cream/60 uppercase tracking-widest">
                  Behaviour
                </div>
                <div className="font-display italic text-lg mt-1">
                  {students[0].behavior}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {parentUpdates.map((u) => (
                <div
                  key={u.child}
                  className="text-xs text-cream/80 border-l-2 border-gold pl-3"
                >
                  <div className="text-[10px] uppercase tracking-widest text-gold">
                    {u.type} · {u.when}
                  </div>
                  <div className="mt-0.5">{u.note}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
          {selectedParent && (
            <>
              <div className="border-b border-hairline p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-navy">
                    Manage billing: {selectedParent.name}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm text-ink-muted">
                    Update tuition fee collection status and outstanding invoice balance.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <form className="space-y-4 p-6" onSubmit={handleSaveBilling}>
                <div className="space-y-2">
                  <Label htmlFor="billing-status">Tuition Fee Status</Label>
                  <select
                    id="billing-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                  >
                    <option value="Paid">Paid (Balance Clear)</option>
                    <option value="Pending">Pending Payment</option>
                    <option value="Overdue">Overdue Notice</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-balance">Outstanding Balance ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
                    <Input
                      id="billing-balance"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="e.g. 1200"
                      className="pl-9 h-10"
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
                    className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-cream"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
