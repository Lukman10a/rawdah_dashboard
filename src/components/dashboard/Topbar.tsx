"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

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
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname() || "/";
  const meta = titles[pathname] ?? titles["/"];

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
          <h1 className="font-display italic text-xl leading-none truncate">
            {meta.title}
          </h1>
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
            className="pl-9 pr-4 h-9 w-72 rounded-md bg-cream/60 border border-hairline text-sm outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <button className="relative size-9 grid place-items-center rounded-md hover:bg-cream border border-hairline">
          <Bell className="size-4 text-navy" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-gold" />
        </button>
        <div className="h-5 w-px bg-hairline" />
        <button className="text-sm font-medium px-3 sm:px-4 h-9 bg-gold text-navy rounded-md hover:brightness-105 transition">
          New Session
        </button>
      </div>
    </header>
  );
}
