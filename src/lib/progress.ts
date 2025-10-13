const KEY = 'ashtottara_progress_v1';

export type Progress = {
  mastered: Record<number, boolean>;
  seen: Record<number, number>; // timestamp epoch ms
  bookmarked: Record<number, boolean>;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}

export function getProgress(): Progress {
  if (typeof window === 'undefined') return { mastered: {}, seen: {}, bookmarked: {} };
  const parsed = safeParse<Partial<Progress>>(localStorage.getItem(KEY), {});
  return {
    mastered: parsed.mastered ?? {},
    seen: parsed.seen ?? {},
    bookmarked: parsed.bookmarked ?? {},
  };
}

export function setProgress(p: Progress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function markSeen(id: number) {
  const p = getProgress();
  p.seen[id] = Date.now();
  setProgress(p);
}

export function markMastered(id: number) {
  const p = getProgress();
  p.mastered[id] = true;
  p.seen[id] = Date.now();
  setProgress(p);
}

export function toggleBookmark(id: number) {
  const p = getProgress();
  if (p.bookmarked[id]) {
    delete p.bookmarked[id];
  } else {
    p.bookmarked[id] = true;
  }
  setProgress(p);
}

export function setBookmark(id: number, value: boolean) {
  const p = getProgress();
  if (value) {
    p.bookmarked[id] = true;
  } else {
    delete p.bookmarked[id];
  }
  setProgress(p);
}

export function isMastered(id: number): boolean {
  const p = getProgress();
  return !!p.mastered[id];
}

export function countMastered(ids: number[]): number {
  const p = getProgress();
  return ids.reduce((acc, id) => acc + (p.mastered[id] ? 1 : 0), 0);
}

export function countSeen(ids: number[]): number {
  const p = getProgress();
  return ids.reduce((acc, id) => acc + (p.seen[id] ? 1 : 0), 0);
}

export function isSeen(id: number): boolean {
  const p = getProgress();
  return !!p.seen[id];
}

export function getNameState(id: number): 'new' | 'seen' | 'mastered' {
  const p = getProgress();
  if (p.mastered[id]) return 'mastered';
  if (p.seen[id]) return 'seen';
  return 'new';
}

export function isBookmarked(id: number): boolean {
  const p = getProgress();
  return !!p.bookmarked[id];
}

export function getBookmarkedIds(): number[] {
  const p = getProgress();
  return Object.keys(p.bookmarked).map((key) => Number(key)).filter((id) => !Number.isNaN(id));
}
