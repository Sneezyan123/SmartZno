import { getLessonTitles, getPlacementFile } from "@/lib/course";
import { PlacementClient } from "@/components/course/PlacementClient";

export default function PlacementPage() {
  return <PlacementClient placement={getPlacementFile()} titles={getLessonTitles()} />;
}
