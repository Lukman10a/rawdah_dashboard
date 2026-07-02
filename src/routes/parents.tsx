import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "../components/dashboard/DashboardLayout";
import { parents, students, parentUpdates } from "../lib/mock-data";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/parents")({
  component: ParentsPage,
});

function ParentsPage() {
  return (
    <>
      <PageHeader
        title="Parent Portal"
        description="What parents see, plus their engagement and satisfaction"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-hairline">
            <h3 className="font-display italic text-lg">Guardians</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
                <th className="px-6 py-3">Parent</th>
                <th className="px-6 py-3">Children</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Last seen</th>
                <th className="px-6 py-3">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-hairline">
              {parents.map((p) => (
                <tr key={p.id} className="hover:bg-cream/40">
                  <td className="px-6 py-4">
                    <div className="font-medium text-navy">{p.name}</div>
                    <div className="text-[11px] text-ink-muted font-mono">{p.id}</div>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">{p.children.join(", ")}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                      <span className="inline-flex items-center gap-1"><Mail className="size-3" /> {p.email}</span>
                      <span className="inline-flex items-center gap-1"><Phone className="size-3" /> {p.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-muted text-xs">{p.lastSeen}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-navy/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: `${p.satisfaction}%` }} />
                      </div>
                      <span className="font-mono text-xs">{p.satisfaction}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="font-display italic text-lg mb-1">What parents see</h3>
          <p className="text-xs text-ink-muted mb-4">Preview of a child's live update feed</p>
          <div className="rounded-xl bg-navy text-cream p-4 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold/80 font-mono">Child</div>
              <div className="font-medium">{students[0].name} · {students[0].grade}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-[10px] text-cream/60 uppercase tracking-widest">Performance</div>
                <div className="font-display italic text-xl mt-1">{students[0].performance}%</div>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-[10px] text-cream/60 uppercase tracking-widest">Attendance</div>
                <div className="font-display italic text-xl mt-1">{students[0].attendance}%</div>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <div className="text-[10px] text-cream/60 uppercase tracking-widest">Behaviour</div>
                <div className="font-display italic text-lg mt-1">{students[0].behavior}</div>
              </div>
            </div>
            <div className="space-y-2">
              {parentUpdates.map((u) => (
                <div key={u.child} className="text-xs text-cream/80 border-l-2 border-gold pl-3">
                  <div className="text-[10px] uppercase tracking-widest text-gold">{u.type} · {u.when}</div>
                  <div className="mt-0.5">{u.note}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
