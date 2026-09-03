import { createContext, useContext } from 'react';
import type { KanaCharacter } from '../types/kana';

export interface MnemonicCoachContextValue {
  isCoachEnabled: boolean;
  isOpen: boolean;
  activeKana: KanaCharacter | null;
  setCoachEnabled: (enabled: boolean) => void;
  showCoach: (kanaOrId: string | KanaCharacter, onDismiss?: () => void) => boolean;
  hideCoach: (disableForever?: boolean) => void;
  toggleCoach: () => void;
}

export const MnemonicCoachContext = createContext<MnemonicCoachContextValue | undefined>(undefined);

export const useMnemonicCoach = (): MnemonicCoachContextValue => {
  const context = useContext(MnemonicCoachContext);
  if (!context) {
    throw new Error('useMnemonicCoach must be used within a MnemonicCoachProvider');
  }
  return context;
};
