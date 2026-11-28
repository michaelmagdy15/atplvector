export const META_STORAGE_KEY = 'atplvector-lesson-meta';
export const PROGRESS_EVENT = 'atplvector-progress-updated';

export interface LessonMetaState {
  doneIds: string[];
  bookmarkIds: string[];
}

export function readLessonMeta(): LessonMetaState {
  if (typeof window === 'undefined') {
    return { doneIds: [], bookmarkIds: [] };
  }
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        doneIds: Array.isArray(parsed.doneIds) ? parsed.doneIds : [],
        bookmarkIds: Array.isArray(parsed.bookmarkIds) ? parsed.bookmarkIds : [],
      };
    }
  } catch {
    // ignore storage errors
  }
  return { doneIds: [], bookmarkIds: [] };
}

export function writeLessonMeta(next: LessonMetaState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: next }));
  } catch {
    // ignore storage errors
  }
}

export function toggleLessonDone(id: string): boolean {
  const meta = readLessonMeta();
  const exists = meta.doneIds.includes(id);
  const doneIds = exists ? meta.doneIds.filter((x) => x !== id) : [...meta.doneIds, id];
  writeLessonMeta({ ...meta, doneIds });
  return !exists;
}

export function toggleLessonBookmark(id: string): boolean {
  const meta = readLessonMeta();
  const exists = meta.bookmarkIds.includes(id);
  const bookmarkIds = exists
    ? meta.bookmarkIds.filter((x) => x !== id)
    : [...meta.bookmarkIds, id];
  writeLessonMeta({ ...meta, bookmarkIds });
  return !exists;
}
