"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Academic",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/staff", label: "Staff", icon: Users },
      { href: "/teachers", label: "Teachers", icon: GraduationCap },
      { href: "/students", label: "Students", icon: UserSquare2 },
      { href: "/parents", label: "Parents", icon: HeartHandshake },
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
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname() || "/";

  return (
    <aside className="w-64 shrink-0 bg-navy text-cream flex flex-col sticky top-0 h-screen border-r border-gold/20">
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
        {groups.map((group) => (
          <div key={group.title}>
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream/40 px-3 py-2">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
            IS
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-cream">Ustadh Ibrahim S.</p>
            <p className="text-cream/50">Principal · Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
