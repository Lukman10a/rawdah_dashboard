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
import { Mail, UserCheck } from "lucide-react";

export function StaffDetailsActions({
  name,
  currentStatus,
}: {
  name: string;
  currentStatus: "Active" | "On Leave";
}) {
  const [message, setMessage] = useState("");
  const [statusChoice, setStatusChoice] = useState<"Active" | "On Leave">(
    currentStatus,
  );

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please add a quick message before sending.");
      return;
    }
    toast.success(`Message sent to ${name}.`);
    setMessage("");
  };

  const handleStatusUpdate = () => {
    toast.success(`${name} status updated to ${statusChoice}.`);
  };

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-navy hover:brightness-105 transition">
            <Mail className="size-4 inline-block mr-2" />
            Message staff
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send message to {name}</DialogTitle>
            <DialogDescription>
              Draft a quick note for the staff member and send it instantly.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="mt-4 w-full rounded-3xl border border-hairline bg-cream/80 p-4 text-sm text-ink outline-none ring-offset-background transition focus:ring-2 focus:ring-gold/30"
            placeholder="Write your message..."
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
                Send message
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-cream transition">
            <UserCheck className="size-4 inline-block mr-2" />
            Update status
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update availability</DialogTitle>
            <DialogDescription>
              Change the staff member's availability state for planning and
              payroll.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-3">
            {(["Active", "On Leave"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusChoice(option)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  statusChoice === option
                    ? "border-gold bg-gold/10 text-navy"
                    : "border-hairline bg-white text-ink"
                }`}
              >
                <div className="font-semibold">{option}</div>
                <div className="text-xs text-ink-muted">
                  {option === "Active"
                    ? "Available for classes, meetings and admin tasks."
                    : "Temporarily unavailable for scheduling or payroll updates."}
                </div>
              </button>
            ))}
          </div>
          <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <button className="rounded-lg border border-hairline bg-white px-4 py-2 text-sm text-ink-muted hover:bg-cream transition">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleStatusUpdate}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream hover:brightness-110 transition"
              >
                Save status
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
