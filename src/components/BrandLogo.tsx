import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "nav" | "footer";
};

export function BrandLogo({ size = "nav" }: Props) {
  const compact = size === "nav";

  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={
          compact
            ? "relative h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/20"
            : "relative h-12 w-12 overflow-hidden rounded-xl ring-1 ring-white/20"
        }
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="48px"
          className="object-cover object-[center_18%]"
          priority={compact}
        />
      </span>
      <span className="leading-tight">
        <span className="block font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight text-white md:text-base">
          SmartZno
        </span>
        <span className="hidden text-[11px] text-white/50 sm:block">підготовка до НМТ</span>
      </span>
    </Link>
  );
}
