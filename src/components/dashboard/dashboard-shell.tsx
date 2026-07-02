"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bot,
  BookOpenCheck,
  CalendarCheck,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  Sparkles,
  UserSquare2,
  Users,
  Wallet,
  X,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };
type Msg = { role: "user" | "ai"; text: string };

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

const suggestions = [
  "Forecast payroll for Ramadan",
  "Which teachers are trending late?",
  "Show underperforming Grade 7 students",
  "Audit Grade 4 Fiqh lesson plans",
];

function mockReply(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("payroll") || t.includes("forecast")) {
    return "Projected payroll for next month is $44,050 (+$1,200). Ramadan schedule adds ~$2.4k in hourly overhead; salaried staff unchanged.";
  }
  if (t.includes("late") || t.includes("attendance")) {
    return "3 teachers trending late in the last 14 days: Ibrahim Zaid (5), Yusuf Mansour (3), Bilal Ahmed (2). Recommend a workload review for Ibrahim.";
  }
  if (t.includes("grade 7") || t.includes("underperform")) {
    return "Grade 7 has 4 students below 75%. Hamza Bello (71%) shows the steepest 4-week drop. I've drafted a parent note — want me to send it?";
  }
  if (t.includes("audit") || t.includes("lesson") || t.includes("curriculum")) {
    return "Grade 4 Fiqh W2 is 74% aligned. Two gaps: missing formative assessment and objective mismatch on outcome 3. I can generate a fix-up plan.";
  }
  return "I can help with staff, payroll forecasting, curriculum audits, attendance patterns, and parent communications. Try one of the suggestions.";
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper text-ink font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="flex-1 p-8">
          <div className="max-w-350 mx-auto space-y-8 animate-in-up">
            {children}
          </div>
        </div>
      </main>
      <ChatBotFab />
    </div>
  );
}

function Sidebar() {
  const pathname = usePathname();

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

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
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

function Topbar() {
  const pathname = usePathname();
  const meta = titles[pathname] ?? titles["/"];

  return (
    <header className="h-16 border-b border-hairline bg-white/70 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="font-display italic text-xl leading-none">
          {meta.title}
        </h1>
        <p className="text-[11px] text-ink-muted mt-1">{meta.subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
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
        <button className="text-sm font-medium px-4 h-9 bg-gold text-navy rounded-md hover:brightness-105 transition">
          New Session
        </button>
      </div>
    </header>
  );
}

function ChatBotFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Assalamu alaikum, Ustadh. I'm the Rawdah AI copilot. Ask me about payroll, curriculum, attendance or students.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: mockReply(q) }]);
    }, 550);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-95 max-w-[calc(100vw-3rem)] bg-white rounded-2xl border border-hairline shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-navy text-cream px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-gold" />
              <div className="leading-tight">
                <div className="text-sm font-medium">Rawdah AI Copilot</div>
                <div className="text-[10px] text-cream/60">
                  Payroll · Curriculum · Insights
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-80">
              <X className="size-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-95 bg-paper"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-xs leading-relaxed px-3 py-2 rounded-lg ${m.role === "ai" ? "bg-white border border-hairline text-navy" : "bg-navy text-cream ml-auto"}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="px-3 pt-2 pb-3 border-t border-hairline bg-white">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[10px] px-2 py-1 rounded-full bg-cream border border-hairline text-navy/70 hover:text-navy hover:border-gold/40"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the copilot…"
                className="flex-1 h-9 rounded-md border border-hairline bg-cream/60 px-3 text-sm outline-none focus:ring-2 focus:ring-gold/30"
              />
              <button
                type="submit"
                className="h-9 w-9 grid place-items-center rounded-md bg-navy text-gold hover:brightness-110"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 size-14 bg-navy text-gold rounded-full grid place-items-center shadow-2xl ring-4 ring-gold/10 hover:scale-105 active:scale-95 transition"
        aria-label="Open AI copilot"
      >
        <Sparkles className="size-6" />
      </button>
    </>
  );
}

export function PageHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="font-display italic text-2xl text-navy">{title}</h2>
        {description && (
          <p className="text-sm text-ink-muted mt-1">{description}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-hairline ${className}`}>
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  accent,
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "gold" | "green" | "muted";
  progress?: number;
}) {
  const hintColor =
    accent === "gold"
      ? "text-gold"
      : accent === "green"
        ? "text-emerald-600"
        : "text-ink-muted";

  return (
    <Card className="p-5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-semibold">
        {label}
      </p>
      <p className="text-3xl font-display italic mt-1 text-navy">{value}</p>
      {progress !== undefined ? (
        <div className="w-full h-1 bg-navy/5 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
        </div>
      ) : hint ? (
        <p className={`text-xs font-mono mt-2 ${hintColor}`}>{hint}</p>
      ) : null}
    </Card>
  );
}
