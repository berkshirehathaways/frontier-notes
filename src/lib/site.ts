export const SITE = {
  title: '노이즈',
  englishName: 'thefutureisnowhere',
  subtitle: 'AI 최전선의 언어를 기록하는 매거진.',
  description: '소음이 신호가 되기 전의 장면을 기록하는 매거진입니다.',
  baseUrl: 'https://frontier-notes.vercel.app',
  defaultOgImage: '/og-default.svg',
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
  'open-ecosystem',
  'learning-by-doing',
  'failure-as-signal',
  'contribution-trace',
  'github-ssot',
  'open-workflow',
  'frontier-language',
  'tool-making',
  'workflow-shift',
  'agent-failure',
  'harness-layering',
  'failure-log',
  'coaching-the-bot',
  'shared-screen',
  'unfinished-work',
  'collaboration-trace',
  'lab-to-github',
  'translation-workflow',
  'harness-engineering',
] as const;

export const STAGE_OPTIONS = [
  'project',
  'startup',
  'operator',
  'investor',
  'community',
] as const;
