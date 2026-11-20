import type { Metadata } from "next";
import { AuditView } from "@/components/dash/AuditView";

export const metadata: Metadata = { title: "Audit pack" };

export default function Page() {
  return <AuditView />;
}
