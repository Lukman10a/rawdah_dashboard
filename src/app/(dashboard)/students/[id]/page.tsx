import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { StudentDetailsActions } from "@/components/dashboard/StudentDetailsActions";
import { students } from "@/lib/mock-data";

export function generateStaticParams() {
  return students.map((student) => ({ id: student.id }));
}

export default function StudentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const student = students.find((item) => item.id === params.id);
  if (!student) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.name}
        description={`${student.grade} • ${student.program} programme`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
                Student profile
              </p>
              <h2 className="font-display text-2xl text-navy mt-2">
                {student.name}
              </h2>
              <p className="text-sm text-ink-muted">
                Guardian: {student.guardian}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Performance
                </p>
                <p className="mt-2 font-medium text-navy">
                  {student.performance}%
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Attendance
                </p>
                <p className="mt-2 font-medium text-navy">
                  {student.attendance}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Behaviour
              </p>
              <p className="mt-2 font-medium text-navy">{student.behavior}</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Last report
              </p>
              <p className="mt-2 font-medium text-navy">{student.lastReport}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
              Academic quick actions
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Review student performance, share notes with the guardian, or
              schedule a support session.
            </p>
          </div>
          <StudentDetailsActions name={student.name} guardian={student.guardian} />
        </Card>
      </div>
    </div>
  );
}
