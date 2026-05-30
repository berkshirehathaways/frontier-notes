export const SITE = {
  title: '최전선 노트',
  englishName: 'Frontier Notes',
  subtitle: 'AI native generation을 기록하는 기술 매거진',
  description:
    '최전선 노트는 AI native generation의 사람, 도구, 작업 방식, 현장 신호를 기록하는 기술 매거진입니다.',
  coreLines: [
    '피치덱에 오르기 전의 사람, 도구, 작업 방식을 기록합니다.',
    '아직 회사가 되기 전의 신호를 먼저 보기 위해 시작했습니다.',
  ],
  cta: {
    readLatest: '/notes',
    interviewProposal: '/interview-proposal',
  },
  contactEmail: 'frontier.notes.magazine@gmail.com',
};

export const MAIN_NAV = [
  { href: '/issues', label: 'Issues' },
  { href: '/essays', label: 'Essays' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/systems', label: 'Systems' },
  { href: '/reports', label: 'Reports' },
  { href: '/about', label: 'About' },
] as const;

export const HUB_NAV = [
  { href: '/notes', label: 'Notes Explorer' },
  { href: '/people', label: 'People' },
  { href: '/tools', label: 'Tools' },
  { href: '/newsletter', label: 'Newsletter Archive' },
  { href: '/interview-proposal', label: 'Interview Proposal' },
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
