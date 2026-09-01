import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { KanaCharacter } from '../types/kana';
import { HIRAGANA_DATA } from '../data/hiraganaData';
import { sfx } from '../utils/audio';

const COACH_STORAGE_KEY = 'hiraganaskolan_coach_enabled_v1';

interface MnemonicCoachContextType {
  isCoachEnabled: boolean;
  isOpen: boolean;
  activeKana: KanaCharacter | null;
  setCoachEnabled: (enabled: boolean) => void;
  showCoach: (kanaOrId: string | KanaCharacter, onDismiss?: () => void) => boolean;
  hideCoach: (disableForever?: boolean) => void;
  toggleCoach: () => void;
}

const MnemonicCoachContext = createContext<MnemonicCoachContextType | undefined>(undefined);

export const MnemonicCoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCoachEnabled, setIsCoachEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(COACH_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeKana, setActiveKana] = useState<KanaCharacter | null>(null);
  const [onDismissCallback, setOnDismissCallback] = useState<(() => void) | null>(null);

  // Sync to localStorage
  const setCoachEnabled = useCallback((enabled: boolean) => {
    setIsCoachEnabled(enabled);
    try {
      localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(enabled));
    } catch (e) {
      console.warn('Failed to save coach preference to localStorage', e);
    }
  }, []);

  const toggleCoach = useCallback(() => {
    setCoachEnabled(!isCoachEnabled);
    sfx.playClick();
  }, [isCoachEnabled, setCoachEnabled]);

  const findKanaCharacter = useCallback((query: string | KanaCharacter): KanaCharacter | undefined => {
    if (typeof query !== 'string') {
      return query;
    }

    const trimmed = query.trim().toLowerCase();
    return HIRAGANA_DATA.find(k => 
      k.id.toLowerCase() === trimmed ||
      k.kana === query.trim() ||
      k.romaji.toLowerCase() === trimmed
    );
  }, []);

  const showCoach = useCallback((kanaOrId: string | KanaCharacter, onDismiss?: () => void): boolean => {
    if (!isCoachEnabled) {
      if (onDismiss) onDismiss();
      return false;
    }

    const kana = findKanaCharacter(kanaOrId);
    if (!kana) {
      if (onDismiss) onDismiss();
      return false;
    }

    setActiveKana(kana);
    setOnDismissCallback(() => onDismiss || null);
    setIsOpen(true);

    try {
      sfx.playMagicCast();
    } catch {
      // Ignore
    }

    return true;
  }, [isCoachEnabled, findKanaCharacter]);

  const hideCoach = useCallback((disableForever: boolean = false) => {
    if (disableForever) {
      setCoachEnabled(false);
    }

    setIsOpen(false);
    const cb = onDismissCallback;
    setOnDismissCallback(null);
    if (cb) {
      cb();
    }
  }, [onDismissCallback, setCoachEnabled]);

  return (
    <MnemonicCoachContext.Provider
      value={{
        isCoachEnabled,
        isOpen,
        activeKana,
        setCoachEnabled,
        showCoach,
        hideCoach,
        toggleCoach
      }}
    >
      {children}
    </MnemonicCoachContext.Provider>
  );
};

export const useMnemonicCoach = (): MnemonicCoachContextType => {
  const context = useContext(MnemonicCoachContext);
  if (!context) {
    throw new Error('useMnemonicCoach must be used within a MnemonicCoachProvider');
  }
  return context;
};
