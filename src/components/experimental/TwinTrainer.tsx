import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Flame, 
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';

interface TwinPair {
  id: string;
  title: string;
  char1: {
    kana: string;
    romaji: string;
    ruleSv: string;
    strokeDirection: 'UP' | 'DOWN';
    dotsOrientation: 'vertical' | 'horizontal';
    mnemonic: string;
    angleDesc: string;
  };
  char2: {
    kana: string;
    romaji: string;
    ruleSv: string;
    strokeDirection: 'UP' | 'DOWN';
    dotsOrientation: 'vertical' | 'horizontal';
    mnemonic: string;
    angleDesc: string;
  };
}

const TWIN_PAIRS: TwinPair[] = [
  {
    id: 'shi_tsu',
    title: 'シ (shi) vs ツ (tsu)',
    char1: {
      kana: 'シ',
      romaji: 'shi',
      ruleSv: 'Tittar UPP mot solen (SHIning). Prickarna ligger lodrätt i linje och sista svepet dras nedifrån och UPPÅT.',
      strokeDirection: 'UP',
      dotsOrientation: 'vertical',
      mnemonic: 'SHIning sun = Tittar UPP',
      angleDesc: 'Flack vinkel nedifrån och upp (~40°)'
    },
    char2: {
      kana: 'ツ',
      romaji: 'tsu',
      ruleSv: 'En TSUnami som störtar NED. Prickarna ligger vågrätt bredvid varandra och svepet dras uppifrån och NEDÅT.',
      strokeDirection: 'DOWN',
      dotsOrientation: 'horizontal',
      mnemonic: 'TSUnami = Störtar NED',
      angleDesc: 'Brant vinkel uppifrån och ned (~70°)'
    }
  },
  {
    id: 'so_n',
    title: 'ソ (so) vs ン (n)',
    char1: {
      kana: 'ソ',
      romaji: 'so',
      ruleSv: 'SOrterar nålen NEDÅT. Det långa svepet startar allra högst upp och dras brant NEDÅT.',
      strokeDirection: 'DOWN',
      dotsOrientation: 'horizontal',
      mnemonic: 'SO = Svep NEDÅT',
      angleDesc: 'Brant svep uppifrån och ned'
    },
    char2: {
      kana: 'ン',
      romaji: 'n',
      ruleSv: 'Noshörningen stångar UPPÅT. Det långa svepet startar vid basen och dras flackt UPPÅT mot höger.',
      strokeDirection: 'UP',
      dotsOrientation: 'vertical',
      mnemonic: 'N = Stångar UPPÅT',
      angleDesc: 'Flackt svep nedifrån och upp'
    }
  },
  {
    id: 'ku_wa_ke',
    title: 'ク (ku) vs ワ (wa) vs ケ (ke)',
    char1: {
      kana: 'ク',
      romaji: 'ku',
      ruleSv: 'Kockmössa. Vänstra snedstrecket skär rakt genom det övre hörnet.',
      strokeDirection: 'DOWN',
      dotsOrientation: 'vertical',
      mnemonic: 'Ku = Skärande vänsterstreck',
      angleDesc: 'Öppet hörn'
    },
    char2: {
      kana: 'ワ',
      romaji: 'wa',
      ruleSv: 'Vinglas (Wine). Vänstra benet är helt lodrätt och taket fäster snyggt i toppen.',
      strokeDirection: 'DOWN',
      dotsOrientation: 'vertical',
      mnemonic: 'Wa = Lodrätt vänsterben',
      angleDesc: 'Stängt hörn'
    }
  }
];

export const TwinTrainer: React.FC = () => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();

  const [activeTab, setActiveTab] = useState<'visual' | 'quiz' | 'battle'>('visual');
  const [selectedTwinIndex, setSelectedTwinIndex] = useState<number>(0);

  // ==========================================
  // 1. TWIN QUIZ STATE
  // ==========================================
  const [quizQuestion, setQuizQuestion] = useState<{
    targetKana: string;
    targetRomaji: string;
    options: string[];
    pairId: string;
  } | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const generateQuizQuestion = useCallback(() => {
    const twins = [
      { kana: 'シ', romaji: 'shi', alt: 'ツ', altRomaji: 'tsu', rule: 'シ (shi) sveper UPPÅT!' },
      { kana: 'ツ', romaji: 'tsu', alt: 'シ', altRomaji: 'shi', rule: 'ツ (tsu) störtar NEDÅT!' },
      { kana: 'ソ', romaji: 'so', alt: 'ン', altRomaji: 'n', rule: 'ソ (so) dras NEDÅT!' },
      { kana: 'ン', romaji: 'n', alt: 'ソ', altRomaji: 'so', rule: 'ン (n) sveper UPPÅT!' },
      { kana: 'ク', romaji: 'ku', alt: 'ワ', altRomaji: 'wa', rule: 'ク (ku) har snedstreck!' },
      { kana: 'ワ', romaji: 'wa', alt: 'ク', altRomaji: 'ku', rule: 'ワ (wa) har lodrätt vänsterben!' },
      { kana: 'チ', romaji: 'chi', alt: 'テ', altRomaji: 'te', rule: 'チ (chi) har snedtopp!' },
      { kana: 'テ', romaji: 'te', alt: 'チ', altRomaji: 'chi', rule: 'テ (te) har horisontellt tak!' },
      { kana: 'ヌ', romaji: 'nu', alt: 'ス', altRomaji: 'su', rule: 'ヌ (nu) har korsande ben!' }
    ];

    const pick = twins[Math.floor(Math.random() * twins.length)];
    const options = [pick.romaji, pick.altRomaji].sort(() => Math.random() - 0.5);

    setQuizQuestion({
      targetKana: pick.kana,
      targetRomaji: pick.romaji,
      options,
      pairId: pick.rule
    });
    setQuizFeedback(null);
  }, []);

  useEffect(() => {
    if (activeTab === 'quiz') {
      // oxlint-disable-next-line react/set-state-in-effect -- Entering quiz mode requires a new randomized question.
      generateQuizQuestion();
    }
  }, [activeTab, generateQuizQuestion]);

  const handleQuizAnswer = (chosenRomaji: string) => {
    if (!quizQuestion || quizFeedback) return;

    const isCorrect = chosenRomaji === quizQuestion.targetRomaji;

    if (isCorrect) {
      const nextStreak = quizStreak + 1;
      setQuizStreak(nextStreak);
      setQuizScore(prev => prev + 10);
      playSfx('catch', { combo: nextStreak });
      speakJapanese(quizQuestion.targetKana);
      setQuizFeedback({ isCorrect: true, message: `Rätt! ${quizQuestion.targetKana} = ${quizQuestion.targetRomaji}` });

      if (nextStreak === 10) {
        fireSuperCelebration();
        recordActivity({
          type: 'practice_completed',
          practiceType: 'twinTrainer' as any,
          score: 100
        });
      }

      setTimeout(generateQuizQuestion, 900);
    } else {
      setQuizStreak(0);
      playSfx('miss');
      setQuizFeedback({ isCorrect: false, message: `Missat! Kom ihåg: ${quizQuestion.pairId}` });
      setTimeout(generateQuizQuestion, 1600);
    }
  };

  // ==========================================
  // 2. DUAL SCRIPT MATCH BATTLE
  // ==========================================
  const [matchCards, setMatchCards] = useState<{ id: string; char: string; script: 'h' | 'k'; pairKey: string; matched: boolean }[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{ id: string; pairKey: string; script: 'h' | 'k' } | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);

  const initMatchBattle = useCallback(() => {
    // Pick 6 random matching pairs
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5).slice(0, 6);
    const hList = indices.map(i => HIRAGANA_DATA[i]);
    const kList = indices.map(i => KATAKANA_DATA[i]);

    const cards: { id: string; char: string; script: 'h' | 'k'; pairKey: string; matched: boolean }[] = [];

    hList.forEach((h) => {
      cards.push({ id: `h-${h.id}`, char: h.kana, script: 'h', pairKey: h.romaji, matched: false });
    });
    kList.forEach((k) => {
      cards.push({ id: `k-${k.id}`, char: k.kana, script: 'k', pairKey: k.romaji, matched: false });
    });

    setMatchCards(cards.sort(() => Math.random() - 0.5));
    setSelectedMatch(null);
    setMatchScore(0);
  }, []);

  useEffect(() => {
    if (activeTab === 'battle') {
      // oxlint-disable-next-line react/set-state-in-effect -- Entering battle mode initializes a new match.
      initMatchBattle();
    }
  }, [activeTab, initMatchBattle]);

  const handleCardClick = (card: { id: string; char: string; script: 'h' | 'k'; pairKey: string; matched: boolean }) => {
    if (card.matched) return;

    playSfx('click');

    if (!selectedMatch) {
      setSelectedMatch({ id: card.id, pairKey: card.pairKey, script: card.script });
      return;
    }

    if (selectedMatch.id === card.id) {
      setSelectedMatch(null);
      return;
    }

    // Check if match
    if (selectedMatch.pairKey === card.pairKey && selectedMatch.script !== card.script) {
      // MATCH!
      playSfx('catch', { combo: 2 });
      speakJapanese(card.char);

      setMatchCards(prev => prev.map(c => {
        if (c.pairKey === card.pairKey) {
          return { ...c, matched: true };
        }
        return c;
      }));
      setMatchScore(prev => prev + 20);
      setSelectedMatch(null);

      // Check if all cleared
      const remaining = matchCards.filter(c => !c.matched && c.pairKey !== card.pairKey).length;
      if (remaining === 0) {
        fireConfetti();
        playSfx('levelUp');
      }
    } else {
      playSfx('miss');
      setSelectedMatch(null);
    }
  };

  const currentTwin = TWIN_PAIRS[selectedTwinIndex];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-800 to-sumi-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Zap size={14} /> Experimentellt • Labb 2
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tvillingtränaren & Script Match ⚡
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            De ökända Katakana-tvillingarna <strong>シ vs ツ</strong> och <strong>ソ vs ン</strong> förvirrar de flesta nybörjare. Här lär du dig avslöja hemligheten bakom deras streckriktning!
          </p>
        </div>
      </div>

      {/* Mode Subtabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-sumi-900 p-1.5 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-xs gap-1">
          <button
            onClick={() => { setActiveTab('visual'); playSfx('click'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800'
            }`}
          >
            🔍 Visuell Jämförelse
          </button>
          <button
            onClick={() => { setActiveTab('quiz'); playSfx('click'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800'
            }`}
          >
            ⚡ Snabb-Duell (Tvillingar)
          </button>
          <button
            onClick={() => { setActiveTab('battle'); playSfx('click'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'battle'
                ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800'
            }`}
          >
            🀄 Hiragana ↔ Katakana Match
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. VISUAL COMPARISON TAB                   */}
      {/* ========================================== */}
      {activeTab === 'visual' && currentTwin && (
        <div className="space-y-6 animate-fadeIn">
          {/* Twin Selector Pills */}
          <div className="flex justify-center gap-2">
            {TWIN_PAIRS.map((pair, idx) => (
              <button
                key={pair.id}
                onClick={() => { setSelectedTwinIndex(idx); playSfx('click'); }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedTwinIndex === idx
                    ? 'bg-amber-400 text-sumi-950 font-black shadow-md'
                    : 'bg-white dark:bg-sumi-900 border border-slate-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {pair.title}
              </button>
            ))}
          </div>

          {/* Side-by-Side Twin Battle Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Char 1 */}
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-sumi-800 shadow-md space-y-6 text-center relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xl font-black text-brand-600 dark:text-brand-gold uppercase">
                  /{currentTwin.char1.romaji}/
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  {currentTwin.char1.strokeDirection === 'UP' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  Sveper {currentTwin.char1.strokeDirection === 'UP' ? 'UPPÅT' : 'NEDÅT'}
                </span>
              </div>

              {/* Big Character with Visual Overlay */}
              <div className="py-4 relative">
                <div className="text-8xl sm:text-9xl font-jp font-black text-slate-900 dark:text-white leading-none">
                  {currentTwin.char1.kana}
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-400">
                  {currentTwin.char1.angleDesc}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 text-left space-y-2">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  💡 Minnesregel:
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {currentTwin.char1.ruleSv}
                </p>
              </div>

              <div className="flex justify-center">
                <AudioButton text={currentTwin.char1.kana} size="md" />
              </div>
            </div>

            {/* Char 2 */}
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-sumi-800 shadow-md space-y-6 text-center relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xl font-black text-brand-600 dark:text-brand-gold uppercase">
                  /{currentTwin.char2.romaji}/
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  {currentTwin.char2.strokeDirection === 'UP' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  Sveper {currentTwin.char2.strokeDirection === 'UP' ? 'UPPÅT' : 'NEDÅT'}
                </span>
              </div>

              {/* Big Character with Visual Overlay */}
              <div className="py-4 relative">
                <div className="text-8xl sm:text-9xl font-jp font-black text-slate-900 dark:text-white leading-none">
                  {currentTwin.char2.kana}
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-400">
                  {currentTwin.char2.angleDesc}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 text-left space-y-2">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  💡 Minnesregel:
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {currentTwin.char2.ruleSv}
                </p>
              </div>

              <div className="flex justify-center">
                <AudioButton text={currentTwin.char2.kana} size="md" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. SPEED QUIZ DUEL TAB                    */}
      {/* ========================================== */}
      {activeTab === 'quiz' && quizQuestion && (
        <div className="max-w-xl mx-auto bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-10 border-2 border-slate-200 dark:border-sumi-800 shadow-lg space-y-8 text-center animate-fadeIn">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Flame size={16} /> Streak: {quizStreak}x
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Poäng: {quizScore}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-9xl font-jp font-black text-slate-900 dark:text-white leading-none py-4">
              {quizQuestion.targetKana}
            </div>
            <p className="text-xs text-slate-400">
              Vilket romaji-ljud hör till detta Katakana-tecken?
            </p>
          </div>

          {/* 2 Big Options */}
          <div className="grid grid-cols-2 gap-4">
            {quizQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleQuizAnswer(opt)}
                disabled={!!quizFeedback}
                className="py-5 px-6 rounded-2xl border-2 border-slate-200 dark:border-sumi-700 bg-slate-50 dark:bg-sumi-950 font-mono text-3xl font-extrabold uppercase hover:border-amber-400 text-slate-900 dark:text-white transition-all cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {quizFeedback && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold animate-fadeIn ${
              quizFeedback.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300' 
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300'
            }`}>
              {quizFeedback.message}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 3. DUAL SCRIPT MATCH BATTLE TAB           */}
      {/* ========================================== */}
      {activeTab === 'battle' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center bg-white dark:bg-sumi-900 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-xs">
            <span className="text-xs font-bold text-slate-500">
              Para ihop varje <strong className="text-indigo-600 dark:text-indigo-400">Hiragana (あ)</strong> med motsvarande <strong className="text-amber-600 dark:text-amber-400">Katakana (ア)</strong>:
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Poäng: {matchScore}
              </span>
              <button
                onClick={initMatchBattle}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                title="Blanda om"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {matchCards.map((card) => {
              const isSelected = selectedMatch?.id === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 border-2 transition-all cursor-pointer select-none ${
                    card.matched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-600 opacity-40 cursor-default'
                      : isSelected
                      ? 'bg-amber-100 dark:bg-amber-950 border-amber-500 scale-105 shadow-md'
                      : card.script === 'h'
                      ? 'bg-white dark:bg-sumi-900 border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-sumi-900 border-amber-200 dark:border-amber-900/60 hover:border-amber-400 text-slate-900 dark:text-white'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-jp font-black">
                    {card.char}
                  </span>
                  <span className="text-[10px] font-bold uppercase mt-1 text-slate-400">
                    {card.script === 'h' ? 'Hiragana' : 'Katakana'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
