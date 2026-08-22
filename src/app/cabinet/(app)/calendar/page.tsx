import { CalendarClient } from "@/components/cabinet/CalendarClient";
import { getStudyPlan } from "@/lib/schedule/plan";

export const dynamic = "force-dynamic";

export default function CabinetCalendarPage() {
  return <CalendarClient plan={getStudyPlan()} />;
}
