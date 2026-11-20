import type { Metadata } from "next";
import { Overview } from "@/components/dash/Overview";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return <Overview />;
}
