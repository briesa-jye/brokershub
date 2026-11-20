import Link from "next/link";
import { DEMO_HREF } from "@/lib/site";

/** Placeholder until accounts exist. Replace with the real form. */
export function AuthStub({ mode }: { mode: "Sign in" | "Sign up" }) {
  return (
    <section className="mx-auto max-w-xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">{mode}</p>
      <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1] tracking-tight">
        Accounts open soon.
      </h1>
      <p className="mt-6 text-lg text-ink-soft">
        BROKERSHUB is in early access. Email us and we will get you set up as
        soon as accounts open.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={DEMO_HREF}
          className="rounded-full bg-ink px-7 py-3.5 font-semibold text-bg hover:bg-ink/85"
        >
          Get in touch
        </a>
        <Link href="/" className="rounded-full border border-ink/30 px-7 py-3.5 font-semibold hover:bg-tint">
          Back home
        </Link>
      </div>
    </section>
  );
}
