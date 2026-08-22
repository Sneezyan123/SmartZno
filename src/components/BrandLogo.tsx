import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "nav" | "footer";
};

export function BrandLogo({ size = "nav" }: Props) {
  const compact = size === "nav";

  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="SmartZno"
        width={compact ? 44 : 64}
        height={compact ? 44 : 64}
        className={
          compact
            ? "h-11 w-11 rounded-xl object-cover ring-1 ring-white/15"
            : "h-16 w-16 rounded-2xl object-cover ring-1 ring-white/15"
        }
        priority={compact}
      />
      <span className="leading-tight">
        <span
          className="block font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-white md:text-lg"
        >
          SmartZno
        </span>
        <span className="hidden text-[11px] text-white/50 sm:block">
          підготовка до НМТ
        </span>
      </span>
    </Link>
  );
}
