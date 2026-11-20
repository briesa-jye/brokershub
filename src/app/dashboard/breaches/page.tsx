import type { Metadata } from "next";
import { BreachesView } from "@/components/dash/BreachesView";

export const metadata: Metadata = { title: "Breaches" };

export default function Page() {
  return <BreachesView />;
}
