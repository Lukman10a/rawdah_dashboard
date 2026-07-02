"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

import { Card, PageHeader } from "../components/dashboard-shell";

type Msg = { role: "user" | "ai"; text: string };

const starters = [
  "Forecast next month's payroll if I add 2 Arabic tutors at $42/hr, 60 hours each.",
  "Which teachers are most at risk of burnout right now?",
  "Summarize this week's curriculum audit in 3 bullets.",
  "Draft a parent update for Hamza Bello's guardian.",
];

function reply(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("add") && t.includes("tutor")) {
    const extra = 2 * 42 * 60;
    return `Adding 2 Arabic tutors at $42/hr × 60h = $${extra.toLocaleString()} extra per month. Total projected payroll rises from $42,850 to ~$47,890 (+11.8%). Would you like me to draft the offer letters?`;
  }
  if (t.includes("burnout") || t.includes("risk"))
    return "Top 3 burnout signals: Ustadha Aisha Malik (104h + 4 late nights), Ibrahim Zaid (85h, on medical leave now), Yusuf Mansour (90h + 3 weekend shifts). I recommend redistributing 6h of Aisha's Fiqh load to Maryam Idris.";
  if (t.includes("audit") || t.includes("curriculum"))
    return "This week: 6 plans audited, avg 84% alignment. 1 critical (Grade 7 Tajweed — 2 outcomes missing), 1 review (Grade 4 Fiqh — assessment missing), 4 aligned.";
  if (t.includes("parent") || t.includes("hamza"))
    return "Draft: 'Assalamu alaikum Mrs. Bello, Hamza has shown a 9-point performance dip over the last 4 weeks, coinciding with increased late arrivals. May we schedule a 15-minute call this week to align on focus areas? – Rawdah Academic Office.'";
  return "I can help with payroll forecasting, staff workload, curriculum audits, and parent communications. Try one of the starters on the right.";
}

export default function ChatbotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Assalamu alaikum. I'm the Rawdah Conversational Copilot — trained on your payroll rules, attendance history and curriculum standards. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs]);

  const send = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(
      () => setMsgs((m) => [...m, { role: "ai", text: reply(text) }]),
      600,
    );
  };

  return (
    <>
      <PageHeader
        title="Conversational Copilot"
        description="Payroll, forecasting and academic assistant"
        right={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-mono">
            <Sparkles className="size-3" /> Online
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex flex-col min-h-135">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] text-sm leading-relaxed px-4 py-3 rounded-xl ${
                  m.role === "ai"
                    ? "bg-cream border border-hairline text-navy"
                    : "bg-navy text-cream ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-hairline p-4 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about payroll, curriculum, or a student…"
              className="flex-1 h-10 rounded-md border border-hairline bg-cream/60 px-3 text-sm outline-none focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-navy text-gold flex items-center gap-2 hover:brightness-110"
            >
              <Send className="size-4" /> Send
            </button>
          </form>
        </Card>

        <Card className="p-5 h-fit">
          <h3 className="font-display italic text-lg mb-2">Try a starter</h3>
          <p className="text-xs text-ink-muted mb-4">
            Copilot uses live mock data from your institute.
          </p>
          <div className="space-y-2">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-md border border-hairline bg-white hover:border-gold/40 hover:bg-cream/50 text-navy"
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
