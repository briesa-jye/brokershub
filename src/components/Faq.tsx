import { Icon } from "./Icons";

export function FaqList({ faqs }: { faqs: [string, string][] }) {
  return (
    <div className="border-t border-ink">
      {faqs.map(([q, a]) => (
        <details key={q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
            {q}
            <Icon
              name="plus"
              className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-2xl pb-6 text-ink-soft">{a}</p>
        </details>
      ))}
    </div>
  );
}
