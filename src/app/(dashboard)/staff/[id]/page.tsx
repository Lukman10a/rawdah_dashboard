import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { StaffDetailsActions } from "@/components/dashboard/StaffDetailsActions";
import { staff } from "@/lib/mock-data";

// export function generateStaticParams() {
//   return staff.map((member) => ({ id: member.id }));
// }

export default async function StaffDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  function findMemberById(id: string) {
    const exact = staff.find((m) => m.id === id);
    if (exact) return exact;
    const ci = staff.find(
      (m) =>
        typeof m.id === "string" && m.id.toLowerCase() === id.toLowerCase(),
    );
    if (ci) return ci;
    const normalized = id.replace(/^s-?/i, "");
    return (
      staff.find(
        (m) =>
          typeof m.id === "string" && m.id.replace(/^s-?/i, "") === normalized,
      ) ||
      staff.find(
        (m) =>
          typeof m.id === "string" &&
          m.id.replace(/^s-?/i, "").toLowerCase() === normalized.toLowerCase(),
      )
    );
  }

  const member = findMemberById(id);
  if (!member) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={member.name}
        description={`${member.role} • ${member.department}`}
        right={
          <div className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream">
            {member.status}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted font-medium">
                Profile
              </p>
              <h2 className="font-display text-2xl text-navy mt-2">
                {member.name}
              </h2>
              <p className="text-sm text-ink-muted">
                {member.role} in {member.department}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Email
                </p>
                <p className="mt-2 font-medium text-navy">{member.email}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Joined
                </p>
                <p className="mt-2 font-medium text-navy">{member.joined}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Department
              </p>
              <p className="mt-2 font-medium text-navy">{member.department}</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Status
              </p>
              <p className="mt-2 font-medium text-navy">{member.status}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
              Action items
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Send messages, update availability, and keep staff records
              current.
            </p>
          </div>
          <StaffDetailsActions
            name={member.name}
            currentStatus={member.status}
          />
        </Card>
      </div>
    </div>
  );
}
