import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const NOTE_COLLECTIONS = ['essays', 'interviews', 'field-notes', 'systems', 'reports'] as const;
export type NoteCollection = (typeof NOTE_COLLECTIONS)[number];
export type NoteEntry = CollectionEntry<NoteCollection>;

const showDraftsInDev = !import.meta.env.PROD && import.meta.env.SHOW_DRAFTS === 'true';

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function sortByDateDesc<T extends { data: { date: Date } }>(items: T[]) {
  return items.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

function shouldShowDraft(draft: boolean) {
  return draft !== true || showDraftsInDev;
}

export async function getPublishedCollection(collection: NoteCollection) {
  const entries = await getCollection(collection, ({ data }) => shouldShowDraft(data.draft));
  return sortByDateDesc(entries);
}

export async function getAllPublishedNotes() {
  const notesPerCollection = await Promise.all(NOTE_COLLECTIONS.map((name) => getPublishedCollection(name)));
  return sortByDateDesc(notesPerCollection.flat());
}

export function noteUrl(entry: NoteEntry) {
  return `/${entry.collection}/${entry.id}`;
}

export async function getNoteBySlug(collection: NoteCollection, slug: string) {
  const notes = await getCollection(collection, ({ data }) => shouldShowDraft(data.draft));
  return notes.find((note) => note.data.slug === slug || note.id === slug);
}

export async function resolveNoteRef(noteRef: string) {
  const [collection, ...slugParts] = noteRef.split('/');
  const slug = slugParts.join('/');
  if (!collection || !slug) return undefined;
  if (!NOTE_COLLECTIONS.includes(collection as NoteCollection)) return undefined;
  return getNoteBySlug(collection as NoteCollection, slug);
}

export async function resolveIssueNotes(
  includedNotes: Array<{ collection: NoteCollection; slug: string; order?: number }>,
): Promise<NoteEntry[]> {
  const sorted = [...includedNotes].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  const loaded = await Promise.all(
    sorted.map(async ({ collection, slug }) => {
      const entry = await getEntry(collection, slug);
      if (entry && shouldShowDraft(entry.data.draft)) return entry;
      return getNoteBySlug(collection, slug);
    }),
  );
  return loaded.filter((item): item is NoteEntry => Boolean(item));
}
