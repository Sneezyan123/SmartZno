import { getLessonTitles, getOpsFile } from "@/lib/course";
import { ParentDigestClient } from "@/components/course/ParentDigestClient";

export default function ParentPage() {
  return <ParentDigestClient ops={getOpsFile()} titles={getLessonTitles()} />;
}
