import { getCurriculum, getLessonSummaries, getOpsFile, getTracksFile } from "@/lib/course";
import { CourseOverview } from "@/components/course/CourseOverview";

export default function MathCoursePage() {
  const curriculum = getCurriculum();
  const lessons = getLessonSummaries();
  const ops = getOpsFile();
  const tracks = getTracksFile();
  const core = tracks.tracks.find((t) => t.id === tracks.defaultTrackId) ?? tracks.tracks[0];
  const monthlyMockId = [...core.weeks].reverse().find((w) => w.mock)?.mock ?? "m7-01";
  const lessonsById = Object.fromEntries(lessons.map((l) => [l.id, l]));

  return (
    <CourseOverview
      curriculum={curriculum}
      lessonsById={lessonsById}
      ops={ops}
      tracks={tracks}
      monthlyMockId={monthlyMockId}
    />
  );
}
