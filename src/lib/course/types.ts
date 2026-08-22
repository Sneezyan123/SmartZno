export type LessonStatus = "ready" | "skeleton";

export type CourseSlug = "math" | "history";

export type OptionKey = "А" | "Б" | "В" | "Г" | "Д" | "Е" | "Є" | "Ж";

export type TheoryBlockType =
  | "heading"
  | "paragraph"
  | "formula"
  | "example"
  | "tip"
  | "list"
  | "story"
  | "portrait"
  | "people"
  | "artifact"
  | "timeline"
  | "checkpoint"
  | "compare"
  | "reveal"
  | "scene"
  | "flip-cards"
  | "tiles"
  | "pins"
  | "steps"
  | "cheatsheet";

export type TheoryFigure = {
  name: string;
  years?: string;
  role: string;
  why: string;
  image?: string;
  credit?: string;
};

export type TheoryPeriod = {
  title: string;
  years: string;
  text: string;
  tag?: string;
  era?: string;
};

export type TheoryCheckpoint = {
  prompt: string;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
  explanation: string;
};

export type TheoryFlip = {
  front: string;
  back: string;
  emoji?: string;
  sticker?: "tr" | "tl" | "br" | "bl";
  teaser?: string;
};

export type TheoryTile = {
  title: string;
  text: string;
};

export type TheoryPin = {
  title: string;
  subtitle?: string;
  text: string;
};

export type TheoryStep = {
  title: string;
  content: string;
  image?: string;
  caption?: string;
};

export type CheatSheetTerm = {
  term: string;
  def: string;
};

export type CheatSheetPeriod = {
  title: string;
  years?: string;
  era?: string;
  children?: CheatSheetPeriod[];
};

export type CheatSheetData = {
  brand?: string;
  title: string;
  subtitle?: string;
  chronologyTitle?: string;
  chronology?: string[];
  termsTitle?: string;
  terms?: CheatSheetTerm[];
  periodsTitle?: string;
  periods?: CheatSheetPeriod[];
};

export type TheoryBlock = {
  type: TheoryBlockType;
  content: string;
  items?: string[];
  image?: string;
  caption?: string;
  credit?: string;
  kicker?: string;
  era?: string;
  years?: string;
  figure?: TheoryFigure;
  figures?: TheoryFigure[];
  periods?: TheoryPeriod[];
  checkpoint?: TheoryCheckpoint;
  columns?: { title: string; items: string[] }[];
  flips?: TheoryFlip[];
  tiles?: TheoryTile[];
  pins?: TheoryPin[];
  steps?: TheoryStep[];
  sheet?: CheatSheetData;
};

export type QuizCard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
};

export type HomeworkSingle = {
  id: string;
  type: "single";
  prompt: string;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
  explanation: string;
  image?: string;
  imageCaption?: string;
};

export type HomeworkMatch = {
  id: string;
  type: "match";
  prompt: string;
  left: { key: string; text: string }[];
  right: { key: string; text: string }[];
  answer: Record<string, string>;
  explanation: string;
};

export type HomeworkOpen = {
  id: string;
  type: "open";
  prompt: string;
  answer: string;
  explanation: string;
};

export type HomeworkSequence = {
  id: string;
  type: "sequence";
  prompt: string;
  items: { key: string; text: string }[];
  answer: string[];
  explanation: string;
};

export type HomeworkMulti = {
  id: string;
  type: "multi";
  prompt: string;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey[];
  explanation: string;
  image?: string;
  imageCaption?: string;
};

export type HomeworkItem =
  | HomeworkSingle
  | HomeworkMatch
  | HomeworkOpen
  | HomeworkSequence
  | HomeworkMulti;

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
  notes?: TheoryBlock[];
  quizCards: QuizCard[];
  homework: HomeworkItem[];
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

export type CourseMeta = {
  slug: CourseSlug;
  contentDir: string;
  headline: string;
  nav: {
    theory: string;
    notes?: string;
    cards: string;
    homework: string;
  };
};
