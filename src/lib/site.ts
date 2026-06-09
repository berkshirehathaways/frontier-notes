export const SITE = {
  title: '노이즈',
  englishName: 'Noise',
  subtitle: 'AI 최전선의 언어를 기록하는 매거진.',
  description: '노이즈는 아직 산업, 법, 대중의 언어로 정리되기 전, AI 최전선에서 먼저 나타나는 말, 행동, 장면, 감각을 기록하는 매거진이다.',
  coreLines: [
    'AI 최전선의 언어를 기록합니다.',
    'Issue로 묶고, 사람으로 기억합니다.',
  ],
  cta: {
    readLatest: '/issues',
    interviewProposal: '/interview-proposal',
  },
  contactEmail: 'frontier.notes.magazine@gmail.com',
};

export const MAIN_NAV = [
  { href: '/issues', label: 'ISSUES' },
  { href: '/notes', label: 'NOTES' },
  { href: '/people', label: 'PEOPLE' },
  { href: '/about', label: 'ABOUT' },
  { href: '/interview-proposal', label: 'CONTRIBUTE' },
] as const;

export const HUB_NAV: ReadonlyArray<{ readonly href: string; readonly label: string }> = [];

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
  'project',
  'startup',
  'operator',
  'investor',
  'community',
] as const;
