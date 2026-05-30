export const SITE = {
  title: '노이즈',
  englishName: 'Noise',
  subtitle: '아직 회사가 되기 전의 AI 창업자를 인터뷰합니다.',
  description:
    '노이즈는 아직 회사가 되기 전의 AI 창업자를 인터뷰하는 매거진입니다. 피치덱보다 먼저, 뉴스보다 먼저 드러나는 생각과 작업 방식을 기록합니다.',
  coreLines: [
    '아직 회사가 되기 전의 AI 창업자를 인터뷰합니다.',
    '피치덱보다 먼저, 뉴스보다 먼저 드러나는 작업 방식을 기록합니다.',
  ],
  cta: {
    readLatest: '/interviews',
    interviewProposal: '/interview-proposal',
  },
  contactEmail: 'frontier.notes.magazine@gmail.com',
};

export const MAIN_NAV = [
  { href: '/interviews', label: '인터뷰' },
  { href: '/people', label: '사람들' },
  { href: '/field-notes', label: '현장 노트' },
  { href: '/tools', label: '도구' },
  { href: '/systems', label: '작업 시스템' },
  { href: '/reports', label: '리포트' },
  { href: '/essays', label: '에세이' },
  { href: '/about', label: '소개' },
  { href: '/interview-proposal', label: '제안하기' },
] as const;

export const HUB_NAV = [
  { href: '/notes', label: 'Notes Explorer' },
  { href: '/newsletter', label: 'Newsletter Archive' },
] as const;

export const SIGNAL_OPTIONS = [
  'speed',
  'tool-adoption',
  'distribution',
  'product-sense',
  'community-pull',
  'workflow-change',
  'demo-pressure',
  'founder-market-fit',
  'taste',
  'execution-density',
] as const;

export const STAGE_OPTIONS = [
  'pre-company',
  'project',
  'startup',
  'operator',
  'investor',
  'community',
] as const;
