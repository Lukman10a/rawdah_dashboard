"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CreditCard, Mail, Eye } from "lucide-react";

export function TeacherDetailsActions({
  name,
  payLabel,
  payAmount,
}: {
  name: string;
  payLabel: string;
  payAmount: string;
}) {
  const [message, setMessage] = useState("");

  const handleReview = () => {
    toast.success(`Payroll review opened for ${name}.`);
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please add a note before sending.");
      return;
    }
    toast.success(`Acknowledgement sent to ${name}.`);
    setMessage("");
  };

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-navy hover:brightness-105 transition">
            <CreditCard className="size-4 inline-block mr-2" />
            Review pay details
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name} payroll summary</DialogTitle>
            <DialogDescription>
              Inspect current earnings, attendance and what drives monthly pay.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 rounded-3xl border border-hairline bg-cream/80 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-ink-muted">Payroll line</p>
              <p className="font-semibold text-navy">{payLabel}</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-ink-muted">Current amount</p>
              <p className="font-semibold text-navy">{payAmount}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-sm text-ink-muted">
              This summary uses the latest attendance and hourly data from the current cycle. Changes automatically update the payroll forecast.
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <button className="rounded-lg border border-hairline bg-white px-4 py-2 text-sm text-ink-muted hover:bg-cream transition">
                Close
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleReview}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream hover:brightness-110 transition"
              >
                Confirm review
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-cream transition">
            <Mail className="size-4 inline-block mr-2" />
            Send acknowledgement
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send note to {name}</DialogTitle>
            <DialogDescription>
              Share a quick acknowledgement or request with the instructor.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="mt-4 w-full rounded-3xl border border-hairline bg-cream/80 p-4 text-sm text-ink outline-none ring-offset-background transition focus:ring-2 focus:ring-gold/30"
            placeholder="Write your acknowledgement..."
          />
          <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <button className="rounded-lg border border-hairline bg-white px-4 py-2 text-sm text-ink-muted hover:bg-cream transition">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleSend}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream hover:brightness-110 transition"
              >
                Send acknowledgement
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
