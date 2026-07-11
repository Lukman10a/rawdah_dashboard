"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CalendarDays, Plus } from "lucide-react";
import { getStoredStudents, saveStudents } from "@/lib/persistence";

export function StudentDetailsActions({
  name,
  guardian,
}: {
  name: string;
  guardian: string;
}) {
  const [note, setNote] = useState("");
  const [sessionNote, setSessionNote] = useState("");
  const [role, setRole] = useState("admin");

  // Grade states
  const [subject, setSubject] = useState("Qur'anic Tajweed");
  const [scoreVal, setScoreVal] = useState("90");

  useEffect(() => {
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rawdah_role="))
      ?.split("=")[1];
    if (r) {
      setRole(r);
    }
  }, []);

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

  const handleEnterGrade = () => {
    const score = parseFloat(scoreVal);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error("Please enter a valid exam score between 0 and 100.");
      return;
    }

    // Load students, find match, modify performance rate, and write back
    const studentsList = getStoredStudents();
    const updated = studentsList.map((s) => {
      if (s.name === name) {
        return {
          ...s,
          performance: Math.round(score),
          lastReport: `Scored ${Math.round(score)}% in ${subject} exam`,
        };
      }
      return s;
    });

    saveStudents(updated);
    toast.success(`Exam grade of ${score}% recorded for ${name} in ${subject}.`);
  };

  const isTeacherOrAdmin = ["admin", "staff", "teacher"].includes(role);

  return (
    <div className="space-y-3">
      {isTeacherOrAdmin && (
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:brightness-110 transition cursor-pointer">
              <Plus className="size-4 inline-block mr-2" />
              Enter Exam Grade
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record exam results: {name}</DialogTitle>
              <DialogDescription>
                Input grade marks to update this student's running report profile.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="grade-subject">Subject Course</Label>
                <select
                  id="grade-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none"
                >
                  <option value="Qur'anic Tajweed">Qur'anic Tajweed</option>
                  <option value="Fiqh Essentials">Fiqh Essentials</option>
                  <option value="Advanced Mathematics">Advanced Mathematics</option>
                  <option value="General Science">General Science</option>
                  <option value="English Literature">English Literature</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="grade-score">Exam Score (0 - 100)</Label>
                <Input
                  id="grade-score"
                  value={scoreVal}
                  onChange={(e) => setScoreVal(e.target.value)}
                  placeholder="e.g. 95"
                  className="h-10"
                />
              </div>
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
                  onClick={handleEnterGrade}
                  className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy hover:brightness-105 transition"
                >
                  Save Grade
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-navy hover:brightness-105 transition cursor-pointer">
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
          <button className="w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-cream transition cursor-pointer">
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
