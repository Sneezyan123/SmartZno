/** Українські форми числа: 1 картка / 2 картки / 5 карток. */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export const uk = {
  tasks: (n: number) => `${n} ${plural(n, "завдання", "завдання", "завдань")}`,
  cards: (n: number) => `${n} ${plural(n, "картка", "картки", "карток")}`,
  points: (n: number) => `${n} ${plural(n, "бал", "бали", "балів")}`,
  topics: (n: number) => `${n} ${plural(n, "тема", "теми", "тем")}`,
  items: (n: number) => `${n} ${plural(n, "пункт", "пункти", "пунктів")}`,
  sets: (n: number) => `${n} ${plural(n, "набір", "набори", "наборів")}`,
  lessons: (n: number) => `${n} ${plural(n, "урок", "уроки", "уроків")}`,
  mocks: (n: number) => `${n} ${plural(n, "пробний", "пробні", "пробних")}`,
  steps: (n: number) => `${n} ${plural(n, "крок", "кроки", "кроків")}`,
  days: (n: number) => `${n} ${plural(n, "день", "дні", "днів")}`,
  weeks: (n: number) => `${n} ${plural(n, "тиждень", "тижні", "тижнів")}`,
};
