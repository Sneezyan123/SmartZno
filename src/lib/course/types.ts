export type LessonStatus = "ready" | "skeleton";

export type TheoryBlockType =
  | "heading"
  | "paragraph"
  | "formula"
  | "example"
  | "tip"
  | "list";

export type TheoryBlock = {
  type: TheoryBlockType;
  content: string;
  items?: string[];
};

export type QuizCard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
};

export type HomeworkLevel = "A" | "B" | "C";

export type HomeworkSingle = {
  id: string;
  type: "single";
  prompt: string;
  options: { key: "А" | "Б" | "В" | "Г" | "Д"; text: string }[];
  answer: "А" | "Б" | "В" | "Г" | "Д";
  explanation: string;
  level?: HomeworkLevel;
  reviewLessonId?: string;
};

export type HomeworkMatch = {
  id: string;
  type: "match";
  prompt: string;
  left: { key: string; text: string }[];
  right: { key: string; text: string }[];
  answer: Record<string, string>;
  explanation: string;
  level?: HomeworkLevel;
  reviewLessonId?: string;
};

export type HomeworkOpen = {
  id: string;
  type: "open";
  prompt: string;
  answer: string;
  explanation: string;
  level?: HomeworkLevel;
  reviewLessonId?: string;
};

export type HomeworkItem = HomeworkSingle | HomeworkMatch | HomeworkOpen;

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  order: number;
  status: LessonStatus;
  objectives: string[];
  nmtTags: string[];
  subtopics?: string[];
  theory: TheoryBlock[];
  quizCards: QuizCard[];
  homework: HomeworkItem[];
  videoUrl?: string | null;
  liveTopic?: string;
};

export type CurriculumModule = {
  id: string;
  title: string;
  description: string;
  nmtSection: string;
  order: number;
  lessonIds: string[];
};

export type Curriculum = {
  id: string;
  title: string;
  subject: string;
  year: number;
  programSource: string;
  description: string;
  nmtFormat: {
    tasks: number;
    minutes: number;
    maxScore: number;
    forms: string[];
  };
  modules: CurriculumModule[];
};

export type CourseTrackWeek = {
  week: number;
  lessons: string[];
  liveFocus: string | null;
  hwDeadlines: number;
  cardsSlot: boolean;
  mock: string | null;
};

export type CourseTrack = {
  id: string;
  name: string;
  shortName: string;
  grade: number;
  months: number;
  livesPerWeek: number;
  hwDeadlinesPerWeek: number;
  cardsSlotsPerWeek: number;
  lessonsPerWeek: number;
  goal: string;
  demoLessons: string[];
  sequence: string[];
  weeks: CourseTrackWeek[];
  maxLtv?: boolean;
  coreMrr?: boolean;
  intensive?: boolean;
  retake?: boolean;
};

export type CourseTracksFile = {
  version: number;
  levels: { id: HomeworkLevel; name: string; target: string; score: string }[];
  defaultTrackId: string;
  tracks: CourseTrack[];
};

export type CourseOpsFile = {
  version: number;
  live: {
    durationMin: number;
    structure: string[];
    recordingAvailableHours: number;
    hwDoesNotExpireSameDay: boolean;
  };
  curator: {
    role: string;
    slaHours: number;
    silenceDays: number;
    weeklyRhythm: { weekday: number; task: string }[];
    commentTemplates: Record<string, string>;
  };
  parent: {
    channel: string;
    fields: string[];
    digestTemplate: string;
  };
  churn: {
    noHwDays: number;
    firstAction: string;
    scenarios: {
      id: string;
      when: string;
      action: string;
      studentText: string;
      parentText: string;
    }[];
  };
  cohort: { doorsClose: boolean; lateStart: string; playlistKillsLtv: boolean };
};

export type PlacementQuestion = {
  id: string;
  prompt: string;
  options: { key: "А" | "Б" | "В" | "Г" | "Д"; text: string }[];
  answer: "А" | "Б" | "В" | "Г" | "Д";
  topic: string;
  mapsToLesson: string;
};

export type PlacementFile = {
  questions: PlacementQuestion[];
};
