"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle, CreditCard, Download, Wallet } from "lucide-react";

import { Card, KpiCard, PageHeader } from "@/components/dashboard/dashboard-shell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveParents } from "@/lib/persistence";
import type { Student, Parent } from "@/lib/mock-data";

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

export function StudentParentDashboard({
  role,
  studentsList,
  parentUser,
  setParentUser,
  parentsList,
  setParentsList,
}: {
  role: string;
  studentsList: Student[];
  parentUser: ExtendedParent | null;
  setParentUser: (p: ExtendedParent | null) => void;
  parentsList: ExtendedParent[];
  setParentsList: (p: ExtendedParent[]) => void;
}) {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const targetStudent = studentsList.find((s) => s.id === "R-1001") || studentsList[0];

  const handlePayOutstanding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentUser || (parentUser.balance || 0) <= 0) return;

    if (!cardNumber || !cardExpiry || !cardCvc || !cardName.trim()) {
      toast.error("Please complete all credit card fields.");
      return;
    }

    setPaymentProcessing(true);

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

      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
      setCardName("");
    }, 2200);
  };

  return (
    <>
      <PageHeader
        title={role === "student" ? `Assalamu alaikum, ${targetStudent?.name || "Zaid"}` : `Parent Hub: ${targetStudent?.name || "Zaid Rahman"}`}
        description={`Assigned Grade: ${targetStudent?.grade || "Grade 2"} · Dual Curriculum Programme`}
        right={
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-mono">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Syllabus Aligned
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <KpiCard
          label="My Performance"
          value={`${targetStudent?.performance || 0}%`}
          progress={targetStudent?.performance || 0}
        />
        <KpiCard label="My Attendance" value={`${targetStudent?.attendance || 0}%`} accent="green" hint="Target: 95%" />
        <KpiCard label="Behaviour State" value={targetStudent?.behavior || "Good"} hint="Based on teacher reviews" accent="gold" />
        {role === "parent" ? (
          <KpiCard
            label="Outstanding Balance"
            value={`$${(parentUser?.balance || 0).toLocaleString()}`}
            hint={parentUser?.tuitionStatus === "Paid" ? "Tuition fully Paid" : "Tuition Fee Pending"}
            accent={parentUser?.tuitionStatus === "Paid" ? "green" : "gold"}
          />
        ) : (
          <KpiCard label="Term reports" value="Term III" hint="Final assessment pending" />
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
                <span
                  className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    parentUser?.tuitionStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
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
