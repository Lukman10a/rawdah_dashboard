"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserSquare2,
  HeartHandshake,
  CalendarCheck,
  Wallet,
  BookOpenCheck,
  Sparkles,
  Bot,
  BellRing,
  Settings,
  X,
  UserPlus,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const getFilteredGroups = (role: string) => {
  const allGroups = [
    {
      title: "Academic",
      items: [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/staff", label: "Staff", icon: Users },
        { href: "/teachers", label: "Teachers", icon: GraduationCap },
        { href: "/students", label: "Students", icon: UserSquare2 },
        { href: "/parents", label: "Parents", icon: HeartHandshake },
        ...(role === "staff" || role === "admin"
          ? [{ href: "/admissions", label: "Admissions", icon: UserPlus }]
          : []),
      ],
    },
    {
      title: "Operations",
      items: [
        { href: "/attendance", label: "Attendance", icon: CalendarCheck },
        { href: "/payroll", label: "Payroll", icon: Wallet },
        { href: "/curriculum", label: "Curriculum", icon: BookOpenCheck },
      ],
    },
    {
      title: "Intelligence",
      items: [
        { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
        { href: "/chatbot", label: "Chatbot", icon: Bot },
        { href: "/notifications", label: "Notifications", icon: BellRing },
        ...(role === "staff" || role === "admin"
          ? [{ href: "/announcements", label: "Announcements", icon: Megaphone }]
          : []),
        { href: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  if (role === "admin" || role === "staff") {
    return allGroups;
  }

  if (role === "teacher") {
    return [
      {
        title: "Academic",
        items: [
          { href: "/", label: "Dashboard", icon: LayoutDashboard },
          { href: "/students", label: "My Students", icon: UserSquare2 },
          { href: "/parents", label: "Parent Contacts", icon: HeartHandshake },
        ],
      },
      {
        title: "Operations",
        items: [
          { href: "/attendance", label: "Class Register", icon: CalendarCheck },
          { href: "/curriculum", label: "My Curriculum", icon: BookOpenCheck },
        ],
      },
      {
        title: "Intelligence",
        items: [
          { href: "/chatbot", label: "Chatbot", icon: Bot },
          { href: "/notifications", label: "Notifications", icon: BellRing },
        ],
      },
    ];
  }

  if (role === "student") {
    return [
      {
        title: "Academic",
        items: [
          { href: "/", label: "Dashboard", icon: LayoutDashboard },
        ],
      },
      {
        title: "Operations",
        items: [
          { href: "/attendance", label: "My Attendance", icon: CalendarCheck },
          { href: "/curriculum", label: "My Syllabus", icon: BookOpenCheck },
        ],
      },
      {
        title: "Intelligence",
        items: [
          { href: "/chatbot", label: "AI Study Copilot", icon: Bot },
          { href: "/notifications", label: "Announcements", icon: BellRing },
        ],
      },
    ];
  }

  if (role === "parent") {
    return [
      {
        title: "Academic",
        items: [
          { href: "/", label: "Child Overview", icon: LayoutDashboard },
          { href: "/parents", label: "My Portal", icon: HeartHandshake },
        ],
      },
      {
        title: "Operations",
        items: [
          { href: "/attendance", label: "Child Attendance", icon: CalendarCheck },
        ],
      },
      {
        title: "Intelligence",
        items: [
          { href: "/chatbot", label: "Parent Assistant", icon: Bot },
          { href: "/notifications", label: "Announcements", icon: BellRing },
        ],
      },
    ];
  }

  return allGroups;
};

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() || "/";
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

  const filteredGroups = getFilteredGroups(role);

  return (
    <>
      <aside className="hidden md:flex md:w-64 shrink-0 bg-navy text-cream flex-col sticky top-0 h-screen border-r border-gold/20">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-9 bg-gold rounded-sm grid place-items-center text-navy font-display font-bold text-lg">
              R
            </div>
            <div className="leading-tight">
              <div className="font-display italic text-lg tracking-tight">
                Rawdah LMS
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream/50">
                Rawdatul Atfaal
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
          {filteredGroups.map((group) => (
            <div key={group.title}>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream/40 px-3 py-2">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? "bg-white/10 text-gold"
                          : "text-cream/80 hover:bg-white/5 hover:text-cream"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="size-9 rounded-full bg-linear-to-br from-gold to-gold-soft grid place-items-center text-navy font-bold text-xs">
              {role === "admin"
                ? "IS"
                : role === "staff"
                  ? "AY"
                  : role === "teacher"
                    ? "OA"
                    : role === "student"
                      ? "ZR"
                      : "FZ"}
            </div>
            <div className="text-xs leading-tight">
              <p className="font-medium text-cream">
                {role === "admin"
                  ? "Ustadh Ibrahim S."
                  : role === "staff"
                    ? "Amina Yusuf"
                    : role === "teacher"
                      ? "Ustadh Omar"
                      : role === "student"
                        ? "Zaid Rahman"
                        : "Fatima Zahra"}
              </p>
              <p className="text-cream/50 text-[10px]">
                {role === "admin"
                  ? "Principal · Admin"
                  : role === "staff"
                    ? "Registrar · Staff"
                    : role === "teacher"
                      ? "Faculty"
                      : role === "student"
                        ? "Student"
                        : "Parent / Guardian"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? "block" : "hidden"}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <aside className="relative z-10 w-[min(18rem,calc(100vw-2rem))] h-full bg-navy text-cream flex flex-col border-r border-gold/20 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3"
            >
              <div className="size-9 bg-gold rounded-sm grid place-items-center text-navy font-display font-bold text-lg">
                R
              </div>
              <div className="leading-tight">
                <div className="font-display italic text-lg tracking-tight">
                  Rawdah LMS
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cream/50">
                  Rawdatul Atfaal
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-cream/80 hover:bg-white/10 hover:text-cream"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cream/40 px-3 py-2">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href ||
                          pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          active
                            ? "bg-white/10 text-gold"
                            : "text-cream/80 hover:bg-white/5 hover:text-cream"
                        }`}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="size-9 rounded-full bg-linear-to-br from-gold to-gold-soft grid place-items-center text-navy font-bold text-xs">
                {role === "admin"
                  ? "IS"
                  : role === "staff"
                    ? "AY"
                    : role === "teacher"
                      ? "OA"
                      : role === "student"
                        ? "ZR"
                        : "FZ"}
              </div>
              <div className="text-xs leading-tight">
                <p className="font-medium text-cream">
                  {role === "admin"
                    ? "Ustadh Ibrahim S."
                    : role === "staff"
                      ? "Amina Yusuf"
                      : role === "teacher"
                        ? "Ustadh Omar"
                        : role === "student"
                          ? "Zaid Rahman"
                          : "Fatima Zahra"}
                </p>
                <p className="text-cream/50 text-[10px]">
                  {role === "admin"
                    ? "Principal · Admin"
                    : role === "staff"
                      ? "Registrar · Staff"
                      : role === "teacher"
                        ? "Faculty"
                        : role === "student"
                          ? "Student"
                          : "Parent / Guardian"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
