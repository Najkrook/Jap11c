import { useSyncExternalStore, useCallback } from 'react';
import { StudySessionEngine, type StudySessionState } from './StudySessionEngine';
import type { SrsRating } from './types';

export function useStudySession<T>(engine: StudySessionEngine<T>): {
  state: StudySessionState<T>;
  flip: () => void;
  setFlipped: (flipped: boolean) => void;
  rate: (rating: SrsRating) => void;
  restart: () => void;
} {
  const subscribe = useCallback(
    (onStoreChange: () => void) => engine.subscribe(onStoreChange),
    [engine]
  );

  const getSnapshot = useCallback(() => engine.getState(), [engine]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const flip = useCallback(() => engine.flip(), [engine]);
  const setFlipped = useCallback((f: boolean) => engine.setFlipped(f), [engine]);
  const rate = useCallback((rating: SrsRating) => {
    engine.rateCurrent(rating);
  }, [engine]);
  const restart = useCallback(() => engine.restart(), [engine]);

  return {
    state,
    flip,
    setFlipped,
    rate,
    restart
  };
}