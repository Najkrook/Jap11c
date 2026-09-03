import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Grid3X3, 
  SkipForward
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { useScriptMode } from '../../context/scriptModeState';
import { fireSuperCelebration, fireConfetti } from '../common/Confetti';
import { useNavigate } from 'react-router-dom';
import { type ActiveTab, TAB_ROUTES } from '../layout/navigation';
import { checkRomajiMatch } from './examLogic';

interface HiraganaExamProps {
  onNavigate?: (tab: ActiveTab) => void;
}

export const HiraganaExam: React.FC<HiraganaExamProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const handleNavigate = (tab: ActiveTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      navigate(TAB_ROUTES[tab]);
    }
  };

  const { playSfx } = useAudio();
  const { recordActivity } = useProgression();
  const { isKatakana } = useScriptMode();

  const [examType, setExamType] = useState<'current' | 'hiragana' | 'katakana' | 'mixed'>(
    isKatakana ? 'katakana' : 'hiragana'
  );

  const [examState, setExamState] = useState<'intro' | 'active' | 'completed'>('intro');
  const [shuffledKana, setShuffledKana] = useState<KanaCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [lastAnswerFeedback, setLastAnswerFeedback] = useState<{ isCorrect: boolean; kana: string; romaji: string } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync examType with global scriptMode on mount
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Global script changes reset the exam's selected script.
    setExamType(isKatakana ? 'katakana' : 'hiragana');
  }, [isKatakana]);

  // Focus input automatically whenever index or state changes
  useEffect(() => {
    if (examState === 'active') {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, examState]);

  // Start / Restart exam
  const startExam = () => {
    let source: KanaCharacter[] = [];

    if (examType === 'katakana') {
      source = [...KATAKANA_DATA];
    } else if (examType === 'hiragana') {
      source = [...HIRAGANA_DATA];
    } else if (examType === 'mixed') {
      source = [...HIRAGANA_DATA.slice(0, 46), ...KATAKANA_DATA.slice(0, 46)];
    } else {
      source = isKatakana ? [...KATAKANA_DATA] : [...HIRAGANA_DATA];
    }

    const allKana = source.sort(() => Math.random() - 0.5);
    setShuffledKana(allKana);
    setCurrentIndex(0);
    setScore(0);
    setInputVal('');
    setLastAnswerFeedback(null);
    setExamState('active');
    playSfx('click');
  };

  const currentKana = shuffledKana[currentIndex];
  const totalQuestions = shuffledKana.length || (examType === 'katakana' ? KATAKANA_DATA.length : HIRAGANA_DATA.length);
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex) / totalQuestions) * 100) : 0;

  // Handle typing input with direct auto-advance on correct match
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (!currentKana) return;

    // Check if the current typed value matches
    if (checkRomajiMatch(val, currentKana)) {
      // CORRECT ANSWER! Auto-advance immediately
      playSfx('catch', { combo: 2 });
      setScore(prev => prev + 1);
      setLastAnswerFeedback({ isCorrect: true, kana: currentKana.kana, romaji: currentKana.romaji });

      advanceToNext(true);
    }
  };

  // Handle key down (Enter to skip / submit wrong if stuck)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If user presses Enter without matching, register as skipped/wrong and advance
      handleSkip();
    }
  };

  // Skip / Give up on current character (counts as incorrect)
  const handleSkip = () => {
    if (!currentKana || examState !== 'active') return;

    playSfx('miss');
    setLastAnswerFeedback({ isCorrect: false, kana: currentKana.kana, romaji: currentKana.romaji });

    advanceToNext(false);
  };

  // Advance helper
  const advanceToNext = (wasCorrect: boolean) => {
    setInputVal('');

    if (currentIndex + 1 < shuffledKana.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const finalScore = wasCorrect ? score + 1 : score;
      finishExam(finalScore);
    }
  };

  const finishExam = (finalScore: number) => {
    setExamState('completed');
    const percent = Math.round((finalScore / totalQuestions) * 100);

    if (percent >= 80) {
      fireSuperCelebration();
      playSfx('levelUp');
    } else {
      fireConfetti();
      playSfx('coin');
    }

    // Record XP and activity
    recordActivity({
      type: 'intensive_exam_completed',
      score: finalScore,
      totalQuestions: totalQuestions
    });
  };

  // Group label helper for current kana
  const getGroupBadge = (kana?: KanaCharacter) => {
    if (!kana) return '';
    const scriptLabel = kana.script === 'katakana' ? 'Katakana' : 'Hiragana';
    switch (kana.group) {
      case 'gojuon':
        return `${scriptLabel} Gojūon (Grundtecken)`;
      case 'dakuon':
        return `${scriptLabel} Dakuon (Dakuten)`;
      case 'handakuon':
        return `${scriptLabel} Handakuon (Halvdakuten)`;
      case 'yoon':
        return `${scriptLabel} Yōon (Kombinationsljud)`;
      case 'special':
        return `${scriptLabel} Special (Låneord)`;
      default:
        return kana.rowNameSv || scriptLabel;
    }
  };

  // Score percentage
  const finalPercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* ========================================================= */}
      {/* 1. INTRO SCREEN                                           */}
      {/* ========================================================= */}
      {examState === 'intro' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-ink-navy via-brand-700 to-slate-900 text-white rounded-3xl p-7 sm:p-10 shadow-xl border border-brand-bronze/30 overflow-hidden">
            <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -right-6 -bottom-6 opacity-10 text-[180px] font-jp font-bold pointer-events-none select-none">
              試
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20">
                <GraduationCap size={15} /> Officiell Kana-tenta • Auto-Advance
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {examType === 'katakana' ? 'Katakana-tenta 📝' : examType === 'mixed' ? 'Blandad Stormästartenta 📝' : 'Hiragana-tenta 📝'}
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                Testa dina kunskaper på alla tecken! Skriv rätt romaji på tangentbordet så avancerar tentan automatiskt så fort du svarar rätt.
              </p>

              {/* Exam Script Mode Chooser */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold mr-1">Välj tentamen:</span>
                <button
                  onClick={() => { setExamType('hiragana'); playSfx('click'); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    examType === 'hiragana' 
                      ? 'bg-amber-400 text-sumi-950 shadow-md font-black' 
                      : 'bg-white/15 text-slate-200 hover:bg-white/25 border border-white/20'
                  }`}
                >
                  あ Hiragana (85 tecken)
                </button>
                <button
                  onClick={() => { setExamType('katakana'); playSfx('click'); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    examType === 'katakana' 
                      ? 'bg-amber-400 text-sumi-950 shadow-md font-black' 
                      : 'bg-white/15 text-slate-200 hover:bg-white/25 border border-white/20'
                  }`}
                >
                  ア Katakana (85 tecken)
                </button>
                <button
                  onClick={() => { setExamType('mixed'); playSfx('click'); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    examType === 'mixed' 
                      ? 'bg-amber-400 text-sumi-950 shadow-md font-black' 
                      : 'bg-white/15 text-slate-200 hover:bg-white/25 border border-white/20'
                  }`}
                >
                  🀄 Blandad (92 tecken)
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={startExam}
                  className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-black text-sm sm:text-base shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 border border-amber-300 cursor-pointer"
                >
                  <GraduationCap size={20} className="fill-current text-sumi-950" />
                  Starta {examType === 'katakana' ? 'Katakana' : examType === 'mixed' ? 'Blandad' : 'Hiragana'}-tentan nu →
                </button>
              </div>
            </div>
          </div>

          {/* Exam Rules & Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                🎯
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Komplett Teckenuppsättning
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Alla grundtecken (Gojūon), Dakuten/Handakuon samt Yōon-kombinationer i slumpad ordning.
              </p>
            </div>

            <div className="bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Direkt Auto-advance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Skriv romaji i textrutan. Så fort du skriver korrekt hoppar tentan automatiskt vidare direkt till nästa fråga.
              </p>
            </div>

            <div className="bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                ⌨️
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Helt i egen takt
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ingen tidspress eller stress. Om du kör fast trycker du bara på <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-sumi-800 rounded text-[11px] font-mono border">Enter</kbd> för att hoppa över.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ACTIVE EXAM SCREEN                                     */}
      {/* ========================================================= */}
      {examState === 'active' && currentKana && (
        <div className="space-y-6">
          {/* Top Progress & Stats Bar */}
          <div className="bg-white dark:bg-sumi-900 rounded-2xl p-4 sm:p-5 border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold px-3 py-1 rounded-xl text-xs sm:text-sm border border-brand-200 dark:border-brand-900">
                Fråga {currentIndex + 1} av {totalQuestions}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {getGroupBadge(currentKana)}
              </span>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <span>{score} rätt</span>
              </div>

              {/* Progress percentage bar */}
              <div className="w-32 sm:w-40 bg-slate-100 dark:bg-sumi-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Question Box */}
          <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-12 border-2 border-paper-300 dark:border-sumi-800 shadow-lg text-center space-y-8">
            
            {/* Group Tag */}
            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300">
                {currentKana.rowNameSv} • {currentKana.group.toUpperCase()}
              </span>
            </div>

            {/* Target Kana Character */}
            <div className="space-y-3">
              <div className="text-8xl sm:text-9xl md:text-[140px] font-jp font-black text-ink-900 dark:text-white select-none transition-transform transform active:scale-95 leading-none">
                {currentKana.kana}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Skriv uttalet i romaji nedanför:
              </p>
            </div>

            {/* Typing Input */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="t.ex. ka"
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  autoComplete="off"
                  className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-paper-50 dark:bg-sumi-950 border-2 border-slate-300 dark:border-sumi-700 focus:border-brand-500 dark:focus:border-brand-400 text-3xl sm:text-4xl font-mono text-center font-bold tracking-wider text-slate-900 dark:text-white outline-hidden shadow-inner transition-all placeholder:text-slate-300 dark:placeholder:text-sumi-700"
                />
              </div>

              {/* Action Buttons: Skip / Give Up */}
              <div className="flex justify-center items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-sumi-800 dark:hover:bg-sumi-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <SkipForward size={14} /> Hoppa över tecken (Enter)
                </button>
              </div>
            </div>

            {/* Last Answer Indicator */}
            {lastAnswerFeedback && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animate-fadeIn ${
                lastAnswerFeedback.isCorrect 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
              }`}>
                {lastAnswerFeedback.isCorrect ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Rätt! ({lastAnswerFeedback.kana} = {lastAnswerFeedback.romaji})</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-rose-500" />
                    <span>Missat: ({lastAnswerFeedback.kana} = <strong>{lastAnswerFeedback.romaji}</strong>)</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. COMPLETED RESULT SCREEN                                */}
      {/* ========================================================= */}
      {examState === 'completed' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-12 border border-paper-300 dark:border-sumi-800 shadow-xl space-y-8 animate-fadeIn text-center max-w-2xl mx-auto">
          
          {/* Big Badge Icon */}
          <div className="w-24 h-24 bg-amber-400/20 text-amber-500 rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-inner animate-bounce-short">
            🎓
          </div>

          {/* Heading and Summary */}
          <div className="space-y-2">
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              Tenta Avklarad!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Ditt Resultat
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sammanställning för {examType === 'katakana' ? 'Katakana-tentan' : examType === 'mixed' ? 'Blandade tentan' : 'Hiragana-tentan'} ({totalQuestions} tecken)
            </p>
          </div>

          {/* Score Box */}
          <div className="bg-paper-50 dark:bg-sumi-950 rounded-2xl p-6 border border-paper-300 dark:border-sumi-800 space-y-3">
            <div className="text-5xl sm:text-6xl font-black font-mono text-slate-900 dark:text-white">
              {score} <span className="text-2xl sm:text-3xl text-slate-400 font-normal">/ {totalQuestions}</span>
            </div>
            
            <div className="text-lg font-bold text-brand-600 dark:text-brand-gold">
              {finalPercentage}% Träffsäkerhet
            </div>

            {/* Assessment phrase */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {finalPercentage === 100 && '🏆 Perfekt resultat! Du behärskar 100% av alla tecken felfritt!'}
              {finalPercentage >= 90 && finalPercentage < 100 && '🌟 Fantastiskt jobbat! Du har en exceptionellt stark grund!'}
              {finalPercentage >= 75 && finalPercentage < 90 && '👍 Bra kämpat! Väl godkänt resultat, du har god koll på de flesta tecknen.'}
              {finalPercentage < 75 && '📚 Bra försök! Fortsätt öva och gör om tentan när du känner dig redo.'}
            </p>
          </div>

          {/* Primary Action: Re-run Exam */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <button
              onClick={startExam}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 border border-amber-300 cursor-pointer"
            >
              <RotateCcw size={18} />
              Gör om tentan 🔄
            </button>

            <button
              onClick={() => handleNavigate('chart')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-sumi-800 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Grid3X3 size={17} />
              Öppna 50-Tabellen
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
