import { redirect } from "next/navigation";

/** No real accounts yet: signing in opens the demo dashboard. */
export default function Page() {
  redirect("/dashboard");
}
