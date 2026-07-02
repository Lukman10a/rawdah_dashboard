import { Card, PageHeader } from "../components/dashboard-shell";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Institute preferences and access control"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-display italic text-lg mb-4">Institute</h3>
          <div className="space-y-3 text-sm">
            <Field label="Name" value="Rawdatul Atfaal" />
            <Field label="Domain" value="rawdahkids.org" />
            <Field label="Timezone" value="UTC+1 · Africa/Lagos" />
            <Field label="Academic year" value="2025 / 1447 AH" />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display italic text-lg mb-4">Payroll rules</h3>
          <div className="space-y-3 text-sm">
            <Field label="Currency" value="USD" />
            <Field label="Pay cycle" value="Monthly · last working day" />
            <Field label="Overtime multiplier" value="1.25× after 40h / week" />
            <Field label="Ramadan schedule" value="Enabled (auto-detect)" />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display italic text-lg mb-4">Roles</h3>
          <div className="space-y-2 text-sm">
            {[
              "Principal",
              "Vice Principal",
              "Registrar",
              "Finance",
              "Teacher",
              "Parent",
            ].map((r) => (
              <div
                key={r}
                className="flex justify-between border-b border-hairline py-2 last:border-0"
              >
                <span>{r}</span>
                <span className="text-ink-muted text-xs font-mono">
                  {r === "Principal"
                    ? "Full access"
                    : r === "Parent"
                      ? "Child-scoped"
                      : "Scoped"}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display italic text-lg mb-4">AI copilots</h3>
          <div className="space-y-3">
            {[
              ["Attendance Pattern Detector", true],
              ["Lesson Plan Auditor", true],
              ["Payroll Forecast Assistant", true],
              ["Parent Communication Drafts", false],
            ].map(([name, on]) => (
              <div
                key={String(name)}
                className="flex items-center justify-between text-sm"
              >
                <span>{name as string}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    on
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-cream text-ink-muted"
                  }`}
                >
                  {on ? "Enabled" : "Off"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-hairline py-2 last:border-0">
      <span className="text-ink-muted">{label}</span>
      <span className="text-navy font-medium">{value}</span>
    </div>
  );
}
