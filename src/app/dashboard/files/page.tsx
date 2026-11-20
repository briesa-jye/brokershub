import type { Metadata } from "next";
import { FilesView } from "@/components/dash/FilesView";

export const metadata: Metadata = { title: "Loan files" };

export default function Page() {
  return <FilesView />;
}
