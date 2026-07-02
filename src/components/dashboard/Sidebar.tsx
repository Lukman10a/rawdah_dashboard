import { Link, useRouterState } from "@tanstack/react-router";
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

type NavItem = { to: string; label: string; icon: LucideIcon };

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Academic",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/staff", label: "Staff", icon: Users },
      { to: "/teachers", label: "Teachers", icon: GraduationCap },
      { to: "/students", label: "Students", icon: UserSquare2 },
      { to: "/parents", label: "Parents", icon: HeartHandshake },
    ],
  },
  {
    title: "Operations",
    items: [
      { to: "/attendance", label: "Attendance", icon: CalendarCheck },
      { to: "/payroll", label: "Payroll", icon: Wallet },
      { to: "/curriculum", label: "Curriculum", icon: BookOpenCheck },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
      { to: "/chatbot", label: "Chatbot", icon: Bot },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="w-64 shrink-0 bg-navy text-cream flex flex-col sticky top-0 h-screen border-r border-gold/20">
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
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

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream/40 px-3 py-2">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
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
