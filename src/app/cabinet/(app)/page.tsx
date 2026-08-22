import { DashboardClient } from "@/components/cabinet/DashboardClient";
import { getStudyPlan } from "@/lib/schedule/plan";

export const dynamic = "force-dynamic";

export default function CabinetTodayPage() {
  return <DashboardClient plan={getStudyPlan()} />;
}
