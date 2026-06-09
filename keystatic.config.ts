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
  issue: fields.text({ label: 'Issue', description: '예: coaching-the-bot-night' }),
  person: fields.text({ label: 'Person', validation: { isRequired: false } }),
  role: fields.text({ label: 'Role', validation: { isRequired: false } }),
  company: fields.text({ label: 'Company', validation: { isRequired: false } }),
  stage: fields.select({
    label: 'Stage',
    defaultValue: 'project',
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
  series: fields.text({
    label: '시리즈',
    description: '연결된 시리즈명이 있을 때만 입력합니다.',
    validation: { isRequired: false },
  }),
  featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
  showInRecentNotes: fields.checkbox({
    label: '최근 노트에 표시',
    description: '홈 또는 최근 노트 목록에 표시할지 결정합니다.',
    defaultValue: true,
  }),
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
    components: {
      FigureImage: {
        label: 'Figure Image',
        kind: 'block',
        schema: {
          src: fields.text({ label: '이미지 경로' }),
          alt: fields.text({ label: '대체 텍스트' }),
          caption: fields.text({ label: '캡션', multiline: true }),
          variant: fields.select({
            label: '여백 스타일',
            defaultValue: 'normal',
            options: [
              { label: '기본 (2rem 위아래)', value: 'normal' },
              { label: '좁은 여백 (1.5rem 위아래)', value: 'tight' },
              { label: '하단 여백 (0 0 2rem)', value: 'bottom' },
              { label: '하단 여백 + 테두리', value: 'bottom-bordered' },
            ],
          }),
        },
      },
    },
  }),
});

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: '노이즈 CMS',
    },
    navigation: {
      Notes: ['essays', 'interviews', 'field-notes', 'systems', 'reports'],
      Issues: ['issues'],
      Data: ['people', 'tools'],
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
      schema: {
        ...noteSchema('interview'),
        interviewKind: fields.select({
          label: '인터뷰 형식',
          description: '비워두면 한줄 릴레이 인터뷰로 처리됩니다. 심층 인터뷰일 때만 deep을 선택합니다.',
          defaultValue: 'relay',
          options: [
            { label: '한줄 릴레이 인터뷰', value: 'relay' },
            { label: '심층 인터뷰', value: 'deep' },
          ],
        }),
      },
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
    issues: collection({
      label: 'Issues',
      slugField: 'title',
      path: 'src/content/issues/*',
      format: 'yaml',
      columns: ['number', 'slug', 'status', 'publishedAt', 'current'],
      schema: {
        title: fields.slug({ name: { label: 'Issue 제목' } }),
        slug: fields.text({ label: 'Issue Slug', description: '예: coaching-the-bot-night' }),
        number: fields.text({ label: 'Issue 번호', description: '예: 01', validation: { isRequired: false } }),
        publicPath: fields.text({
          label: '공개 경로',
          description: '예: /issues-01 (다음 단계에서 전용 랜딩 라우트로 사용)',
          validation: { isRequired: false },
        }),
        status: fields.select({
          label: '발행 상태',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
        }),
        hidden: fields.checkbox({ label: '목록에서 숨기기', defaultValue: true }),
        current: fields.checkbox({ label: '현재 이슈', defaultValue: false }),
        description: fields.text({ label: '설명', multiline: true }),
        publishedAt: fields.date({ label: '발행일', validation: { isRequired: true } }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/uploads',
          publicPath: '/uploads/',
          validation: { isRequired: false },
        }),
        ogImage: fields.image({
          label: 'OG Image',
          directory: 'public/uploads',
          publicPath: '/uploads/',
          validation: { isRequired: false },
        }),
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
            order: fields.integer({ label: '순서', validation: { isRequired: false } }),
            type: fields.select({
              label: '타입 표시',
              defaultValue: 'ESSAY',
              options: [
                { label: 'ESSAY', value: 'ESSAY' },
                { label: 'INTERVIEW', value: 'INTERVIEW' },
                { label: 'FIELD NOTE', value: 'FIELD NOTE' },
                { label: 'SYSTEM', value: 'SYSTEM' },
                { label: 'REPORT', value: 'REPORT' },
              ],
            }),
            title: fields.text({ label: '글 제목', validation: { isRequired: false } }),
          }),
          {
            label: '콘텐츠 구성',
            itemLabel: (props) =>
              `${props.fields.order.value ? `${props.fields.order.value}. ` : ''}${props.fields.title.value || props.fields.slug.value || 'note'}`,
          },
        ),
        upcomingNotes: fields.array(
          fields.object({
            title: fields.text({ label: '글 제목' }),
            subtitle: fields.text({ label: '부제', validation: { isRequired: false } }),
            type: fields.text({ label: '타입', description: '예: ESSAY, INTERVIEW' }),
            slug: fields.text({ label: 'Slug' }),
            card_description: fields.text({ label: '카드 설명', multiline: true, validation: { isRequired: false } }),
          }),
          {
            label: '다음 이슈 예고',
            itemLabel: (props) => props.fields.title.value || props.fields.slug.value || 'note',
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
          defaultValue: 'project',
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
