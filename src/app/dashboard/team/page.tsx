import type { Metadata } from "next";
import { TeamView } from "@/components/dash/TeamView";

export const metadata: Metadata = { title: "Team and CPD" };

export default function Page() {
  return <TeamView />;
}
