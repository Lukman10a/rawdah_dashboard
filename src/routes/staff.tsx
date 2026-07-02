import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "../components/dashboard/DashboardLayout";
import { staff } from "../lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/staff")({
  component: StaffPage,
});

function StaffPage() {
  return (
    <>
      <PageHeader
        title="Staff Directory"
        description="Administrative, welfare and operations personnel"
        right={
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-navy text-cream text-sm font-medium hover:brightness-110">
            <Plus className="size-4" /> Add staff
          </button>
        }
      />
      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/60 text-[10px] uppercase tracking-widest text-ink-muted font-bold border-b border-hairline">
              <th className="px-6 py-3">Member</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-hairline">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-cream/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-cream to-gold-soft grid place-items-center text-navy text-xs font-bold">
                      {s.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <div className="font-medium text-navy">{s.name}</div>
                      <div className="text-[11px] text-ink-muted">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{s.role}</td>
                <td className="px-6 py-4 text-ink-muted">{s.department}</td>
                <td className="px-6 py-4 font-mono text-xs">{s.joined}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      s.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
