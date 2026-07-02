import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/dashboard/dashboard-shell";
import { TeacherDetailsActions } from "@/components/dashboard/TeacherDetailsActions";
import { computePay, teachers } from "@/lib/mock-data";

export function generateStaticParams() {
  return teachers.map((teacher) => ({ id: teacher.id }));
}

export default function TeacherDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const teacher = teachers.find((item) => item.id === params.id);
  if (!teacher) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={teacher.name}
        description={`${teacher.specialization} • ${teacher.employmentType}`}
        right={
          <div className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream">
            {teacher.status}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
                Instructor details
              </p>
              <h2 className="font-display text-2xl text-navy mt-2">
                {teacher.title} {teacher.name}
              </h2>
              <p className="text-sm text-ink-muted">{teacher.id}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Attendance
                </p>
                <p className="mt-2 font-medium text-navy">
                  {teacher.attendance}%
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-cream/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                  Rating
                </p>
                <p className="mt-2 font-medium text-navy">
                  {teacher.rating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Employment
              </p>
              <p className="mt-2 font-medium text-navy">
                {teacher.employmentType}
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Compensation
              </p>
              <p className="mt-2 font-medium text-navy">
                {teacher.employmentType === "Hourly"
                  ? `$${teacher.hourlyRate.toFixed(2)}/hr`
                  : `$${teacher.salaryMonthly?.toLocaleString() ?? "0"}/mo`}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
              Biography
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {teacher.name} teaches {teacher.specialization} at Rawdah LMS.{" "}
              {teacher.status === "On Leave"
                ? "Currently on leave."
                : "A reliable instructor with strong attendance and excellent student feedback."}
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-medium">
              Payroll summary
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Review current pay, hours, and forecasting for this teacher.
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-hairline bg-cream/90 p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">
                Monthly total
              </div>
              <div className="mt-3 text-2xl font-semibold text-navy">
                $
                {computePay(teacher).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <TeacherDetailsActions
              name={teacher.name}
              payLabel={
                teacher.employmentType === "Hourly"
                  ? "Hourly contract"
                  : "Salaried"
              }
              payAmount={
                teacher.employmentType === "Hourly"
                  ? `$${teacher.hourlyRate.toFixed(2)}/hr`
                  : `$${teacher.salaryMonthly?.toLocaleString() ?? "0"}/mo`
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
