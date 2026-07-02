import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../styles.css";

export const metadata: Metadata = {
  title: "Rawdah LMS · Admin Console",
  description:
    "Premium learning management dashboard for Rawdatul Atfaal — staff, teachers, students, hourly payroll and AI-powered academic insights.",
  authors: [{ name: "Rawdah Kids" }],
  openGraph: {
    title: "Rawdah LMS · Admin Console",
    description:
      "Manage staff, teachers, students, hourly payroll and AI-powered academic insights for an Islamic + Western dual-curriculum school.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rawdah LMS · Admin Console",
    description:
      "School Dashboard Pro is a comprehensive LMS dashboard for managing school staff, student performance, and parent communications.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
