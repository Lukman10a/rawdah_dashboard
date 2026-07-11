"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatbotFab } from "./ChatBotFab";
import { Toaster } from "@/components/ui/sonner";

const isAllowed = (role: string, path: string) => {
  if (role === "admin" || role === "staff") return true;

  // Get base path segment (e.g. "/students/R-1001" -> "/students")
  const base = "/" + path.split("/")[1];

  if (role === "teacher") {
    return ["/", "/students", "/parents", "/attendance", "/curriculum", "/chatbot", "/notifications"].includes(base);
  }
  if (role === "student") {
    return ["/", "/attendance", "/curriculum", "/chatbot", "/notifications"].includes(base);
  }
  if (role === "parent") {
    return ["/", "/parents", "/attendance", "/chatbot", "/notifications"].includes(base);
  }
  return true;
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  }, [pathname]); // Refresh when page navigates to check permissions

  const allowed = isAllowed(role, pathname);

  return (
    <div className="flex min-h-screen bg-paper text-ink font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[min(1380px,100%)] mx-auto space-y-8 animate-in-up">
            {allowed ? (
              children
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md p-8 bg-white border border-hairline rounded-2xl shadow-xl shadow-navy/5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                    Access Denied
                  </div>
                  <h2 className="text-2xl font-display italic text-navy mt-4 mb-2">Scope Restricted</h2>
                  <p className="text-sm text-ink-muted leading-relaxed mb-6">
                    Your active role profile (<strong>{role}</strong>) does not have authorization to view <code>{pathname}</code>.
                  </p>
                  <a
                    href="/"
                    className="inline-block px-5 py-2.5 bg-navy hover:bg-navy/95 text-cream text-xs uppercase tracking-widest font-semibold rounded-md shadow transition"
                  >
                    Return to Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ChatbotFab />
      <Toaster richColors position="bottom-right" />
    </div>
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
