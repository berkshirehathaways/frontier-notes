export const NOTE_COLLECTIONS = ['essays', 'interviews', 'field-notes', 'systems', 'reports'] as const;
export type NoteCollection = (typeof NOTE_COLLECTIONS)[number];

export const NOTE_TYPE_VALUES = ['essay', 'interview', 'field-note', 'system', 'report'] as const;
export type NoteType = (typeof NOTE_TYPE_VALUES)[number];

export const NOTE_COLLECTION_DEFS = [
  {
    key: 'essays',
    label: 'Essays',
    noteType: 'essay',
    loaderBase: './src/content/essays',
    adminPath: 'src/content/essays/*',
    columns: ['type', 'issue', 'date', 'featured', 'draft'],
  },
  {
    key: 'interviews',
    label: 'Interviews',
    noteType: 'interview',
    loaderBase: './src/content/interviews',
    adminPath: 'src/content/interviews/*',
    columns: ['type', 'issue', 'date', 'draft'],
  },
  {
    key: 'field-notes',
    label: 'Field Notes',
    noteType: 'field-note',
    loaderBase: './src/content/field-notes',
    adminPath: 'src/content/field-notes/*',
    columns: ['type', 'issue', 'date', 'draft'],
  },
  {
    key: 'systems',
    label: 'Systems',
    noteType: 'system',
    loaderBase: './src/content/systems',
    adminPath: 'src/content/systems/*',
    columns: ['type', 'issue', 'date', 'draft'],
  },
  {
    key: 'reports',
    label: 'Reports',
    noteType: 'report',
    loaderBase: './src/content/reports',
    adminPath: 'src/content/reports/*',
    columns: ['type', 'issue', 'date', 'draft'],
  },
] as const satisfies ReadonlyArray<{
  key: NoteCollection;
  label: string;
  noteType: NoteType;
  loaderBase: `./src/content/${string}`;
  adminPath: `src/content/${string}/*`;
  columns: readonly string[];
}>;

export const NOTE_TYPE_OPTIONS = [
  { label: 'Essay', value: 'essay' },
  { label: 'Interview', value: 'interview' },
  { label: 'Field Note', value: 'field-note' },
  { label: 'System', value: 'system' },
  { label: 'Report', value: 'report' },
] as const satisfies ReadonlyArray<{ label: string; value: NoteType }>;

export const ISSUE_STATUS_VALUES = ['draft', 'published', 'archived'] as const;
export type IssueStatus = (typeof ISSUE_STATUS_VALUES)[number];

export const ISSUE_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
] as const satisfies ReadonlyArray<{ label: string; value: IssueStatus }>;

export const ISSUE_NOTE_TYPE_VALUES = ['ESSAY', 'INTERVIEW', 'FIELD NOTE', 'SYSTEM', 'REPORT'] as const;
export type IssueNoteType = (typeof ISSUE_NOTE_TYPE_VALUES)[number];

export const ISSUE_NOTE_TYPE_OPTIONS = ISSUE_NOTE_TYPE_VALUES.map((value) => ({ label: value, value }));
