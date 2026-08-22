import type { ReactNode } from "react";
import { CabinetShell } from "@/components/cabinet/CabinetShell";

export default function CabinetAppLayout({ children }: { children: ReactNode }) {
  return <CabinetShell>{children}</CabinetShell>;
}
