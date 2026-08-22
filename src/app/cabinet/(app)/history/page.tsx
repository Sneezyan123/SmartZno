import { CourseMaterialsClient } from "@/components/cabinet/CourseMaterialsClient";
import { getStudyPlan } from "@/lib/schedule/plan";

export const dynamic = "force-dynamic";

const TABS = ["all", "streams", "cards"] as const;
type Tab = (typeof TABS)[number];

export default async function CabinetHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: Tab = TABS.includes(tab as Tab) ? (tab as Tab) : "all";

  return <CourseMaterialsClient plan={getStudyPlan()} course="history" initialTab={initialTab} />;
}
