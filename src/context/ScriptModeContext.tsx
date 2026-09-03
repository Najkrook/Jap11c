import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ScriptMode } from '../types/kana';
import { HIRAGANA_DATA } from '../data/hiraganaData';
import { KATAKANA_DATA } from '../data/katakanaData';
import { useAudio } from '../modules/audio';
import { ScriptModeContext, type ScriptModeContextValue } from './scriptModeState';

const STORAGE_KEY = 'hiraganaskolan_script_mode';

export const ScriptModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playSfx } = useAudio();

  const [scriptMode, setScriptModeState] = useState<ScriptMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'katakana' || saved === 'hiragana') {
          return saved;
        }
      } catch {
        // Ignore localStorage error
      }
    }
    return 'hiragana';
  });

  const setScriptMode = useCallback((mode: ScriptMode) => {
    setScriptModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore localStorage error
    }
    playSfx('click');
  }, [playSfx]);

  const toggleScriptMode = useCallback(() => {
    setScriptMode(scriptMode === 'hiragana' ? 'katakana' : 'hiragana');
  }, [scriptMode, setScriptMode]);

  // Keep state synced with localStorage across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'katakana' || e.newValue === 'hiragana')) {
        setScriptModeState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isKanaOfActiveScript = useCallback((id: string): boolean => {
    if (scriptMode === 'katakana') {
      return id.startsWith('kata_');
    }
    return !id.startsWith('kata_');
  }, [scriptMode]);

  const filterIdsByActiveScript = useCallback((ids: string[]): string[] => {
    return ids.filter(id => isKanaOfActiveScript(id));
  }, [isKanaOfActiveScript]);

  const value = useMemo<ScriptModeContextValue>(() => {
    const isHiragana = scriptMode === 'hiragana';
    const isKatakana = scriptMode === 'katakana';
    const activeScriptData = isHiragana ? HIRAGANA_DATA : KATAKANA_DATA;

    return {
      scriptMode,
      setScriptMode,
      toggleScriptMode,
      isHiragana,
      isKatakana,
      activeScriptData,
      scriptTitle: isHiragana ? 'Hiragana' : 'Katakana',
      scriptBadge: isHiragana ? 'ひらがな' : 'カタカナ',
      scriptDescription: isHiragana 
        ? 'Det mjuka stavelsealfabetet för inhemska japanska ord och grammatiska partiklar.'
        : 'Det vassa stavelsealfabetet för moderna låneord (Gairaigo), betoning och onomatopoetiska ord.',
      isKanaOfActiveScript,
      filterIdsByActiveScript
    };
  }, [scriptMode, setScriptMode, toggleScriptMode, isKanaOfActiveScript, filterIdsByActiveScript]);

  return (
    <ScriptModeContext.Provider value={value}>
      {children}
    </ScriptModeContext.Provider>
  );
};
