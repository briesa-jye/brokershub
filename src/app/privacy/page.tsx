import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY } from "@/lib/legal";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description: "How BROKERSHUB handles personal information collected through its website and forms.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      intro="What we collect through the BROKERSHUB website, why, and the choices you have."
      sections={PRIVACY}
    />
  );
}
