import type { Metadata } from "next";
import { ComplaintsView } from "@/components/dash/ComplaintsView";

export const metadata: Metadata = { title: "Complaints" };

export default function Page() {
  return <ComplaintsView />;
}
