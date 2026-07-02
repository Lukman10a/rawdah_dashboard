import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatbotFab } from "./ChatbotFab";

export function DashboardLayout({ children }: { children: ReactNode }) {
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
      <ChatbotFab />
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
