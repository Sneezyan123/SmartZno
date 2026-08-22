import { redirect } from "next/navigation";

export default async function CabinetMaterialsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const mapped =
    tab === "lectures" ? "all" : tab === "streams" || tab === "cards" ? tab : undefined;
  redirect(mapped ? `/cabinet/math?tab=${mapped}` : "/cabinet/math");
}
