"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 text-lg text-ink-soft">That page could not load. Try again, and if it keeps happening, let us know.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-ink px-7 py-3.5 font-semibold text-bg transition-colors hover:bg-ink/85"
      >
        Try again
      </button>
    </section>
  );
}
