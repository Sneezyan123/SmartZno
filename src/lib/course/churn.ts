import type { CourseOpsFile } from "./types";
import { lastActivityAt, type CourseProgress } from "./progress";
import type { CourseProfile } from "./profile";

export function daysSince(iso?: string | null) {
  if (!iso) return Infinity;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export function detectChurn(
  ops: CourseOpsFile,
  progress: CourseProgress,
  profile: CourseProfile,
  hasDueMock = false,
) {
  const lastHw = profile.lastHwAt ?? lastActivityAt(progress);
  const silent = daysSince(lastHw);
  if (silent >= ops.churn.noHwDays) {
    return ops.churn.scenarios.find((s) => s.id === "no-hw-14") ?? ops.churn.scenarios[1];
  }
  if (silent >= (ops.curator.silenceDays ?? 7)) {
    return ops.churn.scenarios.find((s) => s.id === "silent-7") ?? ops.churn.scenarios[0];
  }
  if (hasDueMock) {
    return ops.churn.scenarios.find((s) => s.id === "missed-mock") ?? null;
  }
  return null;
}
