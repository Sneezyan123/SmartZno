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

export type HomeworkSingle = {
  id: string;
  type: "single";
  prompt: string;
  options: { key: "А" | "Б" | "В" | "Г" | "Д"; text: string }[];
  answer: "А" | "Б" | "В" | "Г" | "Д";
  explanation: string;
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
