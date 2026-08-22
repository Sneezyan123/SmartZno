import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Lightweight section wrapper (no client JS / IntersectionObserver). */
export function Reveal({ children, className = "" }: Props) {
  return <div className={className || undefined}>{children}</div>;
}
