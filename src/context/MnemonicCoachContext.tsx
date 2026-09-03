import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import type { KanaCharacter } from '../types/kana';
import { HIRAGANA_DATA } from '../data/hiraganaData';
import { KATAKANA_DATA } from '../data/katakanaData';
import { useAudio } from '../modules/audio';
import { useScriptMode } from './scriptModeState';
import { MnemonicCoachContext } from './mnemonicCoachState';

const COACH_STORAGE_KEY = 'hiraganaskolan_coach_enabled_v1';

export const MnemonicCoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { playSfx } = useAudio();
  const { isKatakana } = useScriptMode();
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
    playSfx('click');
  }, [isCoachEnabled, setCoachEnabled, playSfx]);

  const findKanaCharacter = useCallback((query: string | KanaCharacter): KanaCharacter | undefined => {
    if (typeof query !== 'string') {
      return query;
    }

    const trimmed = query.trim().toLowerCase();
    const primary = isKatakana ? KATAKANA_DATA : HIRAGANA_DATA;
    const secondary = isKatakana ? HIRAGANA_DATA : KATAKANA_DATA;

    let found = primary.find(k => 
      k.id.toLowerCase() === trimmed ||
      k.kana === query.trim() ||
      k.romaji.toLowerCase() === trimmed
    );

    if (!found) {
      found = secondary.find(k =>
        k.id.toLowerCase() === trimmed ||
        k.kana === query.trim() ||
        k.romaji.toLowerCase() === trimmed
      );
    }

    return found;
  }, [isKatakana]);

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
      playSfx('magicCast');
    } catch {
      // Ignore
    }

    return true;
  }, [isCoachEnabled, findKanaCharacter, playSfx]);

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

  const value = useMemo(() => ({
    isCoachEnabled,
    isOpen,
    activeKana,
    setCoachEnabled,
    showCoach,
    hideCoach,
    toggleCoach
  }), [isCoachEnabled, isOpen, activeKana, setCoachEnabled, showCoach, hideCoach, toggleCoach]);

  return (
    <MnemonicCoachContext.Provider value={value}>
      {children}
    </MnemonicCoachContext.Provider>
  );
};
