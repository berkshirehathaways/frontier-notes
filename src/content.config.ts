import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  ISSUE_NOTE_TYPE_VALUES,
  ISSUE_STATUS_VALUES,
  NOTE_COLLECTION_DEFS,
  NOTE_COLLECTIONS,
  NOTE_TYPE_VALUES,
  type NoteCollection,
} from './lib/content-model';
import { STAGE_OPTIONS } from './lib/site';

const noteType = z.enum(NOTE_TYPE_VALUES);

const noteSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slug: z.string(),
  date: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  type: noteType,
  interviewKind: z.enum(['relay', 'deep']).optional(),
  issue: z.string(),
  person: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  stage: z.enum(STAGE_OPTIONS).optional(),
  tools: z.array(z.string()).default([]),
  themes: z.array(z.string()).default([]),
  signals: z.array(z.string()).default([]),
  location: z.string().optional(),
  related_people: z.array(z.string()).default([]),
  related_tools: z.array(z.string()).default([]),
  next_questions: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().optional(),
  draft: z.boolean().default(false),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  series: z.string().optional(),
  showInRecentNotes: z.boolean().default(true),
});

const issueSchema = z.object({
  title: z.string(),
  slug: z.string(),
  number: z.string().optional(),
  publicPath: z.string().optional(),
  status: z.enum(ISSUE_STATUS_VALUES).optional(),
  description: z.string(),
  publishedAt: z.coerce.date(),
  current: z.boolean().default(false),
  hidden: z.boolean().default(false),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  themes: z.array(z.string()).default([]),
  includedNotes: z
    .array(
      z.object({
        collection: z.enum(NOTE_COLLECTIONS),
        slug: z.string(),
        order: z.number().optional(),
        type: z.enum(ISSUE_NOTE_TYPE_VALUES).optional(),
        title: z.string().optional(),
      }),
    )
    .default([]),
  upcomingNotes: z
    .array(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        type: z.string(),
        slug: z.string(),
        card_description: z.string().optional(),
      }),
    )
    .default([]),
});

const peopleSchema = z.object({
  name: z.string(),
  slug: z.string(),
  role: z.string(),
  company: z.string().optional(),
  stage: z.enum(STAGE_OPTIONS).optional(),
  tools: z.array(z.string()).default([]),
  signals: z.array(z.string()).default([]),
  relatedNotes: z.array(z.string()).default([]),
  summary: z.string(),
});

const toolsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  changedWorkflow: z.string(),
  frequentSignals: z.array(z.string()).default([]),
  relatedNotes: z.array(z.string()).default([]),
  summary: z.string(),
});

function noteLoaderBase(collection: NoteCollection) {
  const definition = NOTE_COLLECTION_DEFS.find((item) => item.key === collection);
  if (!definition) throw new Error(`Unknown note collection: ${collection}`);
  return definition.loaderBase;
}

function defineNoteCollection(collection: NoteCollection) {
  return defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: noteLoaderBase(collection) }),
    schema: noteSchema,
  });
}

const essays = defineNoteCollection('essays');
const interviews = defineNoteCollection('interviews');
const fieldNotes = defineNoteCollection('field-notes');
const systems = defineNoteCollection('systems');
const reports = defineNoteCollection('reports');

const issues = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/issues' }),
  schema: issueSchema,
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/people' }),
  schema: peopleSchema,
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/tools' }),
  schema: toolsSchema,
});

export const collections = {
  essays,
  interviews,
  'field-notes': fieldNotes,
  systems,
  reports,
  issues,
  people,
  tools,
};
