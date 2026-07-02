import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display italic text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-navy">Page not found</h2>
        <p className="mt-2 text-sm text-ink-muted">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream hover:brightness-110"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-navy">Something didn't load</h1>
        <p className="mt-2 text-sm text-ink-muted">Try again or head back to the dashboard.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-cream hover:brightness-110"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-hairline bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-cream">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rawdah LMS · Admin Console" },
      {
        name: "description",
        content:
          "Premium learning management dashboard for Rawdatul Atfaal — staff, teachers, students, hourly payroll and AI-powered academic insights.",
      },
      { name: "author", content: "Rawdah Kids" },
      { property: "og:title", content: "Rawdah LMS · Admin Console" },
      {
        property: "og:description",
        content:
          "Manage staff, teachers, students, hourly payroll and AI-powered academic insights for an Islamic + Western dual-curriculum school.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rawdah LMS · Admin Console" },
      { name: "description", content: "School Dashboard Pro is a comprehensive LMS dashboard for managing school staff, student performance, and parent communications." },
      { property: "og:description", content: "School Dashboard Pro is a comprehensive LMS dashboard for managing school staff, student performance, and parent communications." },
      { name: "twitter:description", content: "School Dashboard Pro is a comprehensive LMS dashboard for managing school staff, student performance, and parent communications." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/213aa221-2bdd-474a-a364-b5f3eb0542e5/id-preview-c9d5ddc7--00f908e1-8b62-45fe-af20-b897f874bbbf.lovable.app-1783003432455.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/213aa221-2bdd-474a-a364-b5f3eb0542e5/id-preview-c9d5ddc7--00f908e1-8b62-45fe-af20-b897f874bbbf.lovable.app-1783003432455.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </QueryClientProvider>
  );
}
