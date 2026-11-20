/** Hub mark plus wordmark. The mark: one line to a hub, three files branching off it. */
export function Logo({ className = "h-7 sm:h-8" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.svg" alt="" className="h-full w-auto" />
      <span className="font-display text-[1.35rem] font-extrabold leading-none tracking-tight sm:text-2xl">
        BROKERS<span className="text-ink/55">HUB</span>
      </span>
    </span>
  );
}
