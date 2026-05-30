import { collection, config, fields } from '@keystatic/core';
import { SIGNAL_OPTIONS, STAGE_OPTIONS } from './src/lib/site';

const noteTypeOptions = [
  { label: 'Essay', value: 'essay' },
  { label: 'Interview', value: 'interview' },
  { label: 'Field Note', value: 'field-note' },
  { label: 'System', value: 'system' },
  { label: 'Report', value: 'report' },
] as const;

const stageOptions = STAGE_OPTIONS.map((value) => ({ label: value, value }));
const signalOptions = SIGNAL_OPTIONS.map((value) => ({ label: value, value }));

const noteSchema = (defaultType: (typeof noteTypeOptions)[number]['value']) => ({
  title: fields.slug({ name: { label: 'Title' } }),
  subtitle: fields.text({ label: 'Subtitle' }),
  slug: fields.text({
    label: 'Slug',
    description: '라우팅/연결용 슬러그입니다. 파일명과 다르게 관리해도 됩니다.',
  }),
  date: fields.date({ label: 'Date', validation: { isRequired: true } }),
  updatedAt: fields.date({ label: 'Updated At', validation: { isRequired: false } }),
  type: fields.select({
    label: 'Type',
    defaultValue: defaultType,
    options: noteTypeOptions.map((item) => ({ ...item })),
  }),
  issue: fields.text({ label: 'Issue', description: '예: issue-01' }),
  person: fields.text({ label: 'Person', validation: { isRequired: false } }),
  role: fields.text({ label: 'Role', validation: { isRequired: false } }),
  company: fields.text({ label: 'Company', validation: { isRequired: false } }),
  stage: fields.select({
    label: 'Stage',
    defaultValue: 'pre-company',
    options: stageOptions,
  }),
  tools: fields.array(fields.text({ label: 'Tool' }), { label: 'Tools', itemLabel: (props) => props.value || 'tool' }),
  themes: fields.array(fields.text({ label: 'Theme' }), {
    label: 'Themes',
    itemLabel: (props) => props.value || 'theme',
  }),
  signals: fields.multiselect({
    label: 'Signals',
    options: signalOptions,
    defaultValue: [],
  }),
  location: fields.text({ label: 'Location', validation: { isRequired: false } }),
  related_people: fields.array(fields.text({ label: 'Related person slug' }), {
    label: 'Related People',
    itemLabel: (props) => props.value || 'person',
  }),
  related_tools: fields.array(fields.text({ label: 'Related tool slug' }), {
    label: 'Related Tools',
    itemLabel: (props) => props.value || 'tool',
  }),
  next_questions: fields.array(fields.text({ label: 'Question' }), {
    label: 'Next Questions',
    itemLabel: (props) => props.value || 'question',
  }),
  featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
  coverImage: fields.image({
    label: 'Cover Image',
    directory: 'public/uploads/covers',
    publicPath: '/uploads/covers/',
    validation: { isRequired: false },
  }),
  content: fields.mdx({
    label: 'Content',
    extension: 'mdx',
    options: {
      image: {
        directory: 'public/uploads/content',
        publicPath: '/uploads/content/',
      },
    },
  }),
});

const newsletterSchema = {
  title: fields.slug({ name: { label: 'Title' } }),
  subtitle: fields.text({ label: 'Subtitle' }),
  slug: fields.text({
    label: 'Slug',
    description: '뉴스레터 URL 슬러그입니다. 파일명과 분리해 관리할 수 있습니다.',
  }),
  date: fields.date({ label: 'Date', validation: { isRequired: true } }),
  updatedAt: fields.date({ label: 'Updated At', validation: { isRequired: false } }),
  summary: fields.text({ label: 'Summary', multiline: true }),
  topics: fields.array(fields.text({ label: 'Topic' }), {
    label: 'Topics',
    itemLabel: (props) => props.value || 'topic',
  }),
  featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
  content: fields.mdx({
    label: 'Content',
    extension: 'mdx',
    options: {
      image: {
        directory: 'public/uploads/newsletter',
        publicPath: '/uploads/newsletter/',
      },
    },
  }),
};

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: '최전선 노트 CMS',
    },
    navigation: {
      Notes: ['essays', 'interviews', 'field-notes', 'systems', 'reports'],
      Archive: ['newsletter'],
      Data: ['issues', 'people', 'tools'],
    },
  },
  collections: {
    essays: collection({
      label: 'Essays',
      slugField: 'title',
      path: 'src/content/essays/*',
      format: { contentField: 'content' },
      columns: ['type', 'issue', 'date', 'featured', 'draft'],
      schema: noteSchema('essay'),
    }),
    interviews: collection({
      label: 'Interviews',
      slugField: 'title',
      path: 'src/content/interviews/*',
      format: { contentField: 'content' },
      columns: ['type', 'issue', 'date', 'draft'],
      schema: noteSchema('interview'),
    }),
    'field-notes': collection({
      label: 'Field Notes',
      slugField: 'title',
      path: 'src/content/field-notes/*',
      format: { contentField: 'content' },
      columns: ['type', 'issue', 'date', 'draft'],
      schema: noteSchema('field-note'),
    }),
    systems: collection({
      label: 'Systems',
      slugField: 'title',
      path: 'src/content/systems/*',
      format: { contentField: 'content' },
      columns: ['type', 'issue', 'date', 'draft'],
      schema: noteSchema('system'),
    }),
    reports: collection({
      label: 'Reports',
      slugField: 'title',
      path: 'src/content/reports/*',
      format: { contentField: 'content' },
      columns: ['type', 'issue', 'date', 'draft'],
      schema: noteSchema('report'),
    }),
    newsletter: collection({
      label: 'Newsletter',
      slugField: 'title',
      path: 'src/content/newsletter/*',
      format: { contentField: 'content' },
      columns: ['date', 'featured', 'draft'],
      schema: newsletterSchema,
    }),
    issues: collection({
      label: 'Issues',
      slugField: 'title',
      path: 'src/content/issues/*',
      format: 'yaml',
      columns: ['slug', 'publishedAt', 'current'],
      schema: {
        title: fields.slug({ name: { label: 'Issue Name' } }),
        slug: fields.text({ label: 'Issue Slug' }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedAt: fields.date({ label: 'Published At', validation: { isRequired: true } }),
        current: fields.checkbox({ label: 'Current Issue', defaultValue: false }),
        themes: fields.array(fields.text({ label: 'Theme' }), {
          label: 'Themes',
          itemLabel: (props) => props.value || 'theme',
        }),
        includedNotes: fields.array(
          fields.object({
            collection: fields.select({
              label: 'Collection',
              defaultValue: 'essays',
              options: [
                { label: 'Essays', value: 'essays' },
                { label: 'Interviews', value: 'interviews' },
                { label: 'Field Notes', value: 'field-notes' },
                { label: 'Systems', value: 'systems' },
                { label: 'Reports', value: 'reports' },
              ],
            }),
            slug: fields.text({ label: 'Content Slug' }),
          }),
          {
            label: 'Included Notes',
            itemLabel: (props) => props.fields.slug.value || 'note',
          },
        ),
      },
    }),
    people: collection({
      label: 'People',
      slugField: 'name',
      path: 'src/content/people/*',
      format: 'yaml',
      columns: ['slug', 'role', 'stage'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        slug: fields.text({ label: 'Person Slug' }),
        role: fields.text({ label: 'Role' }),
        company: fields.text({ label: 'Company', validation: { isRequired: false } }),
        stage: fields.select({
          label: 'Stage',
          defaultValue: 'pre-company',
          options: stageOptions,
        }),
        tools: fields.array(fields.text({ label: 'Tool' }), {
          label: 'Tools',
          itemLabel: (props) => props.value || 'tool',
        }),
        signals: fields.multiselect({
          label: 'Signals',
          options: signalOptions,
          defaultValue: [],
        }),
        relatedNotes: fields.array(fields.text({ label: 'collection/slug' }), {
          label: 'Related Notes',
          itemLabel: (props) => props.value || 'note',
        }),
        summary: fields.text({ label: 'Summary', multiline: true }),
      },
    }),
    tools: collection({
      label: 'Tools',
      slugField: 'name',
      path: 'src/content/tools/*',
      format: 'yaml',
      columns: ['slug'],
      schema: {
        name: fields.slug({ name: { label: 'Tool Name' } }),
        slug: fields.text({ label: 'Tool Slug' }),
        changedWorkflow: fields.text({ label: 'Changed Workflow', multiline: true }),
        frequentSignals: fields.multiselect({
          label: 'Frequent Signals',
          options: signalOptions,
          defaultValue: [],
        }),
        relatedNotes: fields.array(fields.text({ label: 'collection/slug' }), {
          label: 'Related Notes',
          itemLabel: (props) => props.value || 'note',
        }),
        summary: fields.text({ label: 'Summary', multiline: true }),
      },
    }),
  },
});
