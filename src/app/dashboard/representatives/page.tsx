import type { Metadata } from "next";
import { RepsView } from "@/components/dash/RepsView";

export const metadata: Metadata = { title: "Representatives" };

export default function Page() {
  return <RepsView />;
}
