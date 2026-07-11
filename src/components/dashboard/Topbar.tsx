"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Academic Overview",
    subtitle: "Live intelligence across the institute",
  },
  "/staff": {
    title: "Staff Directory",
    subtitle: "Administrative and support personnel",
  },
  "/teachers": {
    title: "Teaching Faculty",
    subtitle: "Instructors, load and payroll",
  },
  "/students": {
    title: "Students",
    subtitle: "Enrolment, performance and behaviour",
  },
  "/parents": {
    title: "Parent Portal",
    subtitle: "Guardian engagement and updates",
  },
  "/attendance": {
    title: "Attendance",
    subtitle: "Daily register and AI patterns",
  },
  "/payroll": {
    title: "Payroll Engine",
    subtitle: "Hourly rates, hours logged, disbursement",
  },
  "/curriculum": {
    title: "Curriculum Auditor",
    subtitle: "AI-powered lesson plan alignment",
  },
  "/ai-insights": {
    title: "AI Insights",
    subtitle: "Attendance, curriculum, payroll intelligence",
  },
  "/chatbot": {
    title: "Conversational Assistant",
    subtitle: "Payroll and forecasting copilot",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Institute preferences and roles",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Alerts, history and delivery controls",
  },
  "/notifications/alerts": {
    title: "Notifications",
    subtitle: "Alert centre and high-priority updates",
  },
  "/notifications/history": {
    title: "Notifications",
    subtitle: "Resolved and archived activity",
  },
  "/notifications/preferences": {
    title: "Notifications",
    subtitle: "Channel preferences and delivery rules",
  },
};

import { useEffect, useState } from "react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const meta = titles[pathname] ?? titles["/"];
  const [role, setRole] = useState<string>("admin");

  useEffect(() => {
    const r = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rawdah_role="))
      ?.split("=")[1];
    if (r) {
      setRole(r);
    }
  }, []);

  const handleRoleChange = (newRole: string) => {
    document.cookie = `rawdah_role=${newRole}; path=/; max-age=604800`;
    setRole(newRole);
    window.location.reload();
  };

  const handleSignOut = () => {
    document.cookie = "rawdah_auth=; path=/; max-age=0";
    document.cookie = "rawdah_role=; path=/; max-age=0";
    router.push("/auth");
  };

  return (
    <header className="h-16 border-b border-hairline bg-white/70 backdrop-blur px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid place-items-center md:hidden size-10 rounded-md bg-navy text-gold border border-hairline hover:bg-cream/10"
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display italic text-xl leading-none truncate">
              {meta.title}
            </h1>
            <span className="text-[9px] font-semibold tracking-widest uppercase bg-gold/15 text-navy px-1.5 py-0.5 rounded-sm">
              {role}
            </span>
          </div>
          <p className="text-[11px] text-ink-muted mt-1 truncate">
            {meta.subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
          <input
            placeholder="Search staff, students, records…"
            className="pl-9 pr-4 h-9 w-60 rounded-md bg-cream/60 border border-hairline text-sm outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest hidden lg:inline">Testing:</span>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="h-9 rounded-md border border-hairline bg-cream/80 px-2 text-xs font-semibold text-navy outline-none focus:ring-2 focus:ring-gold/25"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <Link
          href="/notifications"
          className="relative size-9 grid place-items-center rounded-md hover:bg-cream border border-hairline"
          aria-label="Open notifications"
        >
          <Bell className="size-4 text-navy" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-gold" />
        </Link>
        <div className="h-5 w-px bg-hairline" />
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm font-medium px-3 sm:px-4 h-9 border border-hairline bg-white text-navy rounded-md hover:bg-cream transition"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
