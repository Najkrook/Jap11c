import { type ActiveTab, TAB_ROUTES } from '../layout/navigation';

interface DashboardRecommendationInput {
  completedLessons: number;
  totalLessons: number;
  dueReviews: number;
  nextLessonTitle: string;
  scriptName: string;
}

export const getDashboardRecommendation = ({
  completedLessons,
  totalLessons,
  dueReviews,
  nextLessonTitle,
  scriptName
}: DashboardRecommendationInput) => {
  if (completedLessons === 0) {
    return {
      tab: 'learning' as ActiveTab,
      label: 'Din första uppgift',
      title: `Börja med ${nextLessonTitle}`,
      description: `Lär dig fem ${scriptName}-tecken och avsluta med ett kort snabbtest.`,
      actionLabel: 'Starta första lektionen'
    };
  }

  if (dueReviews > 0) {
    return {
      tab: 'srs' as ActiveTab,
      label: 'Dagens repetition',
      title: `Repetera ${dueReviews} kort`,
      description: 'Börja med korten som är redo nu och håll kunskapen levande.',
      actionLabel: 'Starta repetitionen'
    };
  }

  if (completedLessons < totalLessons) {
    return {
      tab: 'learning' as ActiveTab,
      label: 'Nästa lektion',
      title: nextLessonTitle,
      description: `${completedLessons} av ${totalLessons} lektioner klara. Fortsätt där du slutade.`,
      actionLabel: 'Fortsätt lärstigen'
    };
  }

  return {
    tab: 'exam' as ActiveTab,
    label: 'Redo för slutprovet',
    title: `Testa dina kunskaper i ${scriptName}`,
    description: 'Alla lektioner är klara. Gör tentan och se vilka tecken som behöver finslipas.',
    actionLabel: 'Starta tentan'
  };
};

export const navigateFromDashboard = (
  tab: ActiveTab,
  onNavigate: ((tab: ActiveTab) => void) | undefined,
  navigate: (path: string) => void
) => {
  if (onNavigate) {
    onNavigate(tab);
    return;
  }
  navigate(TAB_ROUTES[tab]);
};
