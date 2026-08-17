import { getLessonTitles, getOpsFile, getTracksFile } from "@/lib/course";
import { WeekPlanClient } from "@/components/course/WeekPlanClient";

export default function WeekPlanPage() {
  const tracks = getTracksFile();
  const ops = getOpsFile();
  return <WeekPlanClient tracks={tracks} ops={ops} titles={getLessonTitles()} />;
}
