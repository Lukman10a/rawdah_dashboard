"use client";

import { useEffect, useState } from "react";
import { Megaphone, Send, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { Label } from "@/components/ui/label";
import { getStoredNotifications, saveNotifications } from "@/lib/persistence";

type Announcement = {
  title: string;
  desc: string;
  audience: string;
  publishedAt: string;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      title: "Ramadan timetable shift",
      desc: "Day classes will shorten by 15 mins. Evening lessons will be rescheduled to 8 PM.",
      audience: "All Parents & Teachers",
      publishedAt: "2 days ago",
    },
    {
      title: "Tuition collection cycle open",
      desc: "Term III fee payment cycle starts this week. Guardians should check billing sheets.",
      audience: "All Parents",
      publishedAt: "4 days ago",
    },
  ]);

  // Form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audience, setAudience] = useState("All Parents & Teachers");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Please fill in the title and content.");
      return;
    }

    // Save locally to dashboard announcements history
    const newAnn: Announcement = {
      title,
      desc,
      audience,
      publishedAt: "Just now",
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Push into global rawdah_notifications localStorage
    const currentNotifications = getStoredNotifications();
    const newNotification = {
      title,
      desc,
      when: "1m ago",
    };
    const updatedNotifications = [newNotification, ...currentNotifications];
    saveNotifications(updatedNotifications);

    toast.success(`Announcement "${title}" published to ${audience}.`);

    // Reset inputs
    setTitle("");
    setDesc("");
  };

  return (
    <>
      <PageHeader
        title="Announcements Hub"
        description="Draft and publish school announcements, notices, and reminders to teachers or guardians"
        right={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-mono">
            <Sparkles className="size-3" /> Communication center
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-display italic text-lg mb-4 text-navy border-b border-hairline pb-2 flex items-center gap-2">
            <Megaphone className="size-4 text-gold" /> Compose Notice
          </h3>
          <form className="space-y-4" onSubmit={handlePublish}>
            <div className="space-y-2">
              <Label htmlFor="notice-title">Announcement Title</Label>
              <input
                id="notice-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eid break timetable announcement"
                className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-audience">Target Audience</Label>
              <select
                id="notice-audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="h-10 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="All Parents & Teachers">All Parents & Teachers</option>
                <option value="All Parents">All Parents / Guardians</option>
                <option value="All Teachers">All Faculty / Instructors</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-content">Message Content</Label>
              <textarea
                id="notice-content"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={6}
                placeholder="Write the announcement description..."
                className="w-full rounded-xl border border-hairline bg-cream/60 p-4 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-navy hover:brightness-110 text-gold text-sm font-semibold transition cursor-pointer"
              >
                <Send className="size-4" /> Publish Announcement
              </button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display italic text-lg mb-4 text-navy flex items-center gap-2">
              <AlertCircle className="size-4 text-gold" /> Publishing Feed
            </h3>
            <p className="text-xs text-ink-muted mb-4">
              Recently broadcast notices appearing on parent & teacher portal dashboards.
            </p>
            <div className="space-y-4">
              {announcements.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-cream/50 border border-hairline rounded-lg text-xs leading-relaxed text-navy"
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-semibold block">{item.title}</span>
                    <span className="text-[10px] text-ink-muted font-mono">{item.publishedAt}</span>
                  </div>
                  <p className="text-ink-muted">{item.desc}</p>
                  <div className="mt-2 text-[9px] uppercase tracking-wider text-gold font-semibold font-mono">
                    Audience: {item.audience}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
