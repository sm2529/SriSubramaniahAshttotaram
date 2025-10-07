export const CHUNK_SIZE = 10;

export function getLessonCount(total: number): number {
  return Math.ceil(total / CHUNK_SIZE);
}

export function getLessonRange(lesson: number, total: number): { start: number; end: number } {
  const start = (lesson - 1) * CHUNK_SIZE;
  const end = Math.min(lesson * CHUNK_SIZE, total);
  return { start, end };
}

export function getLessonLabel(lesson: number, total: number): string {
  const { start, end } = getLessonRange(lesson, total);
  // Display as 1-based ids for clarity
  return `${start + 1}–${end}`;
}
