import type { ReactNode } from "react";

export function SiteChrome({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {nav}
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      {footer}
    </>
  );
}
