import type { Metadata } from "next";
import { SupervisionView } from "@/components/dash/SupervisionView";

export const metadata: Metadata = { title: "Supervision" };

export default function Page() {
  return <SupervisionView />;
}
