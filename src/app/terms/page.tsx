import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS } from "@/lib/legal";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description: "The terms for using the BROKERSHUB website and demo during early access.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      intro="The terms for using the BROKERSHUB website and demo. BROKERSHUB is in early access."
      sections={TERMS}
    />
  );
}
