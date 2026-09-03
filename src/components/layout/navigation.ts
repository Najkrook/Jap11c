export type ActiveTab = 'home' | 'learning' | 'exam' | 'chart' | 'srs' | 'game' | 'practice' | 'pronunciation' | 'experimental' | 'guide';

export const TAB_ROUTES: Record<ActiveTab, string> = {
  home: '/',
  learning: '/learn',
  exam: '/exam',
  chart: '/chart',
  srs: '/srs',
  game: '/game',
  practice: '/practice',
  pronunciation: '/pronunciation',
  experimental: '/experimental',
  guide: '/guide'
};

export const getActiveTabFromPath = (pathname: string): ActiveTab => {
  if (pathname.startsWith('/learn')) return 'learning';
  if (pathname.startsWith('/exam')) return 'exam';
  if (pathname.startsWith('/chart')) return 'chart';
  if (pathname.startsWith('/srs')) return 'srs';
  if (pathname.startsWith('/game')) return 'game';
  if (pathname.startsWith('/practice')) return 'practice';
  if (pathname.startsWith('/pronunciation')) return 'pronunciation';
  if (pathname.startsWith('/experimental')) return 'experimental';
  if (pathname.startsWith('/guide')) return 'guide';
  return 'home';
};
