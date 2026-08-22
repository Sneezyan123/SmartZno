import { MocksClient } from "@/components/cabinet/MocksClient";
import { getStudyPlan } from "@/lib/schedule/plan";

export const dynamic = "force-dynamic";

export default function CabinetMocksPage() {
  return <MocksClient plan={getStudyPlan()} />;
}
