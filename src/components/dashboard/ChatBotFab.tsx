import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Forecast payroll for Ramadan",
  "Which teachers are trending late?",
  "Show underperforming Grade 7 students",
  "Audit Grade 4 Fiqh lesson plans",
];

// Deterministic mock responses — no backend.
function mockReply(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("payroll") || t.includes("forecast"))
    return "Projected payroll for next month is $44,050 (+$1,200). Ramadan schedule adds ~$2.4k in hourly overhead; salaried staff unchanged.";
  if (t.includes("late") || t.includes("attendance"))
    return "3 teachers trending late in the last 14 days: Ibrahim Zaid (5), Yusuf Mansour (3), Bilal Ahmed (2). Recommend a workload review for Ibrahim.";
  if (t.includes("grade 7") || t.includes("underperform"))
    return "Grade 7 has 4 students below 75%. Hamza Bello (71%) shows the steepest 4-week drop. I've drafted a parent note — want me to send it?";
  if (t.includes("audit") || t.includes("lesson") || t.includes("curriculum"))
    return "Grade 4 Fiqh W2 is 74% aligned. Two gaps: missing formative assessment and objective mismatch on outcome 3. I can generate a fix-up plan.";
  return "I can help with staff, payroll forecasting, curriculum audits, attendance patterns, and parent communications. Try one of the suggestions.";
}

export function ChatbotFab() {
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
        <div className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl border border-hairline shadow-2xl overflow-hidden flex flex-col">
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
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] bg-paper"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-xs leading-relaxed px-3 py-2 rounded-lg ${
                  m.role === "ai"
                    ? "bg-white border border-hairline text-navy"
                    : "bg-navy text-cream ml-auto"
                }`}
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
