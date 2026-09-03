import { createContext, useContext } from 'react';
import type { KanaCharacter, ScriptMode } from '../types/kana';

export interface ScriptModeContextValue {
  scriptMode: ScriptMode;
  setScriptMode: (mode: ScriptMode) => void;
  toggleScriptMode: () => void;
  isHiragana: boolean;
  isKatakana: boolean;
  activeScriptData: KanaCharacter[];
  scriptTitle: string;
  scriptBadge: string;
  scriptDescription: string;
  isKanaOfActiveScript: (id: string) => boolean;
  filterIdsByActiveScript: (ids: string[]) => string[];
}

export const ScriptModeContext = createContext<ScriptModeContextValue | null>(null);

export function useScriptMode(): ScriptModeContextValue {
  const context = useContext(ScriptModeContext);
  if (!context) {
    throw new Error('useScriptMode must be used within a ScriptModeProvider');
  }
  return context;
}
