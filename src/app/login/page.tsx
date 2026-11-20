import type { Metadata } from "next";
import { AuthStub } from "@/components/AuthStub";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function Page() {
  return <AuthStub mode="Sign in" />;
}
