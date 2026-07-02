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
import { Mail, CalendarDays } from "lucide-react";

export function StudentDetailsActions({
  name,
  guardian,
}: {
  name: string;
  guardian: string;
}) {
  const [note, setNote] = useState("");
  const [sessionNote, setSessionNote] = useState("");

  const handleSendNote = () => {
    if (!note.trim()) {
      toast.error("Please enter a note before sending.");
      return;
    }
    toast.success(`Note sent to ${guardian}.`);
    setNote("");
  };

  const handleSchedule = () => {
    if (!sessionNote.trim()) {
      toast.error("Add a brief session goal before scheduling.");
      return;
    }
    toast.success(`Support session scheduled for ${name}.`);
    setSessionNote("");
  };

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-navy hover:brightness-105 transition">
            <Mail className="size-4 inline-block mr-2" />
            Send guardian note
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send note to {guardian}</DialogTitle>
            <DialogDescription>
              Share a quick update about {name} with the guardian.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={5}
            className="mt-4 w-full rounded-3xl border border-hairline bg-cream/80 p-4 text-sm text-ink outline-none ring-offset-background transition focus:ring-2 focus:ring-gold/30"
            placeholder="Add a short note for the guardian..."
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
                onClick={handleSendNote}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream hover:brightness-110 transition"
              >
                Send note
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-cream transition">
            <CalendarDays className="size-4 inline-block mr-2" />
            Schedule support
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a support session</DialogTitle>
            <DialogDescription>
              Plan a follow-up session for {name} and capture the goal.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={sessionNote}
            onChange={(event) => setSessionNote(event.target.value)}
            rows={5}
            className="mt-4 w-full rounded-3xl border border-hairline bg-cream/80 p-4 text-sm text-ink outline-none ring-offset-background transition focus:ring-2 focus:ring-gold/30"
            placeholder="What is the goal of this session?"
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
                onClick={handleSchedule}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream hover:brightness-110 transition"
              >
                Schedule
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
