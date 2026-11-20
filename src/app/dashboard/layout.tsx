import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DemoProvider } from "@/components/dash/DemoProvider";
import { DashShell } from "@/components/dash/DashShell";

export const metadata: Metadata = {
  title: "Demo dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <DashShell>{children}</DashShell>
    </DemoProvider>
  );
}
