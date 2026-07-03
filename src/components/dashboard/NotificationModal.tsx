"use client";

import { BellRing, Clock3, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  detail: string;
  category?: string;
  time?: string;
  status?: string;
};

export function NotificationModal({
  open,
  onOpenChange,
  title,
  detail,
  category = "Administrative",
  time = "Just now",
  status = "Needs review",
}: NotificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl border border-hairline bg-white p-0 shadow-2xl">
        <div className="border-b border-hairline p-6">
          <DialogHeader>
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              <BellRing className="size-3" /> {category}
            </div>
            <DialogTitle className="font-display text-2xl text-navy">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-ink-muted">
              A polished detail preview for the selected communication item.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-hairline bg-cream/40 p-4 text-sm leading-7 text-navy">
            {detail}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                <Clock3 className="size-3" /> Received
              </div>
              <div className="mt-2 text-sm font-medium text-navy">{time}</div>
            </div>
            <div className="rounded-xl border border-hairline p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                <Sparkles className="size-3" /> Status
              </div>
              <div className="mt-2 text-sm font-medium text-navy">{status}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
