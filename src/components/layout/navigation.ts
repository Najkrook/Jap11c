export type ActiveTab = 'home' | 'learning' | 'exam' | 'chart' | 'srs' | 'game' | 'practice' | 'pronunciation' | 'experimental' | 'guide' | 'anki' | 'grammar';

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
  guide: '/guide',
  anki: '/anki',
  grammar: '/grammar'
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
  if (pathname.startsWith('/anki')) return 'anki';
  if (pathname.startsWith('/grammar')) return 'grammar';
  return 'home';
};

export interface CalculateVisibleNavCountParams {
  totalItemsCount: number;
  navWidth: number;
  itemWidths: number[];
  moreButtonWidth: number;
  gap: number;
  minCount?: number;
}

export const calculateVisibleNavCount = ({
  totalItemsCount,
  navWidth,
  itemWidths,
  moreButtonWidth,
  gap,
  minCount = 4
}: CalculateVisibleNavCountParams): number => {
  if (totalItemsCount <= 0 || navWidth <= 0 || itemWidths.length === 0) {
    return Math.min(minCount, totalItemsCount);
  }

  // If all items fit without the "Mer" button, show all items!
  const totalWidthAll =
    itemWidths.slice(0, totalItemsCount).reduce((sum, w) => sum + w, 0) +
    (totalItemsCount - 1) * gap;

  if (totalWidthAll <= navWidth) {
    return totalItemsCount;
  }

  // Otherwise, the "Mer" button is required. Available width for items:
  const availableForItems = navWidth - moreButtonWidth - gap;
  let accumulated = 0;
  let count = 0;

  for (let i = 0; i < totalItemsCount; i++) {
    const itemWidth = itemWidths[i] ?? 80;
    const needed = accumulated + itemWidth + (i > 0 ? gap : 0);
    if (needed <= availableForItems) {
      accumulated = needed;
      count++;
    } else {
      break;
    }
  }

  return Math.max(minCount, Math.min(count, totalItemsCount));
};

export const getInitialVisibleNavCount = (
  windowWidth?: number,
  totalItems: number = 12
): number => {
  const width = windowWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1280);
  if (width >= 1280) return totalItems;
  if (width >= 1024) return Math.min(8, totalItems);
  if (width >= 768) return Math.min(6, totalItems);
  return Math.min(4, totalItems);
};

