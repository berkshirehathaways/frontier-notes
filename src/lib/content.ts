import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { NOTE_COLLECTIONS, type NoteCollection } from './content-model';

export { NOTE_COLLECTIONS, type NoteCollection };
export type NoteEntry = CollectionEntry<NoteCollection>;
export type IssueEntry = CollectionEntry<'issues'>;

export interface IssueMembership {
  title: string;
  numberLabel: string;
  label: string;
  href?: string;
}

const showDrafts = import.meta.env.SHOW_DRAFTS === 'true';
const isVercelPreview = process.env.VERCEL_ENV === 'preview';
const showDraftsInPreview = showDrafts && (!import.meta.env.PROD || isVercelPreview);

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
  return draft !== true || showDraftsInPreview;
}

export async function getPublishedCollection(collection: NoteCollection) {
  const entries = await getCollection(collection, ({ data }) => shouldShowDraft(data.draft));
  return sortByDateDesc(entries);
}

/** order가 지정된 글이 먼저(오름차순), 나머지는 발행일 역순. 큐레이션 목록용. */
export function sortByCuratedOrder<T extends { data: { date: Date; order?: number } }>(items: T[]) {
  return [...items].sort((a, b) => {
    const orderA = a.data.order ?? Infinity;
    const orderB = b.data.order ?? Infinity;
    if (orderA !== orderB) return orderA - orderB;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

/**
 * 공개 가능한 이슈만 발행일 역순으로 반환.
 * status가 있으면 published만, 없으면 hidden:false 기준 (하위 호환).
 */
export async function getVisibleIssues() {
  const issues = await getCollection('issues', ({ data }) => {
    if (showDraftsInPreview && data.status === 'draft') return true;
    return data.status !== undefined ? data.status === 'published' : !data.hidden;
  });
  return issues.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

let issueMembershipMapPromise: Promise<Map<string, IssueMembership>> | undefined;

function issueMembershipLabel(issue: IssueEntry): IssueMembership {
  const numberLabel = issue.data.number ? `Issue ${issue.data.number}` : 'Issue';
  return {
    title: issue.data.title,
    numberLabel,
    label: `${numberLabel} · ${issue.data.title}`,
    href: issue.data.publicPath,
  };
}

function noteRefKey(collection: NoteCollection, slug: string) {
  return `${collection}/${slug}`;
}

export async function getIssueMembershipMap() {
  issueMembershipMapPromise ??= (async () => {
    const issues = await getVisibleIssues();
    const map = new Map<string, IssueMembership>();

    for (const issue of issues) {
      const label = issueMembershipLabel(issue);
      for (const note of issue.data.includedNotes) {
        map.set(noteRefKey(note.collection, note.slug), label);
      }
    }

    return map;
  })();

  return issueMembershipMapPromise;
}

export async function getIssueMembership(entry: NoteEntry) {
  const issueMap = await getIssueMembershipMap();
  return issueMap.get(noteRefKey(entry.collection, entry.data.slug)) ?? issueMap.get(noteRefKey(entry.collection, entry.id));
}

export async function getAllPublishedNotes() {
  const notesPerCollection = await Promise.all(NOTE_COLLECTIONS.map((name) => getPublishedCollection(name)));
  return sortByDateDesc(notesPerCollection.flat());
}

export function noteUrl(entry: NoteEntry) {
  return `/${entry.collection}/${entry.data.slug}`;
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
