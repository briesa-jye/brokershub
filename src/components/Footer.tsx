import Link from "next/link";
import { Logo } from "./Logo";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-7" />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            Compliance for Australian mortgage and finance brokers, built to
            grow into how the brokerage runs day to day.
          </p>
        </div>
        <div>
          <p className="eyebrow">Product</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/#platform" className="hover:underline">Platform</Link></li>
            <li><Link href="/#audit" className="hover:underline">Audit pack</Link></li>
            <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
            <li><Link href="/#faq" className="hover:underline">Questions</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-ink-soft sm:px-8">
          BROKERSHUB supports your compliance diligence. It does not give legal
          advice or guarantee compliance; your credit licensee remains
          responsible for sign-off. &copy; {new Date().getFullYear()} Brokers Hub.
        </p>
      </div>
    </footer>
  );
}
