import React, { useState, useCallback } from 'react';
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Zap, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { 
  TRICKY_HIRAGANA_GROUPS, 
  type TrickyQuestion, 
  generateTrickyQuestion 
} from '../../data/trickyHiraganaData';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';

const QUESTIONS_PER_ROUND = 10;

export const TrickyHiraganaTrainer: React.FC = () => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();

  const [activeTab, setActiveTab] = useState<'quiz' | 'guide'>('quiz');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(TRICKY_HIRAGANA_GROUPS[0].id);

  // ==========================================
  // QUIZ STATE
  // ==========================================
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<TrickyQuestion | null>(() => generateTrickyQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [roundStats, setRoundStats] = useState<{ correctCount: number; totalCount: number }>({ correctCount: 0, totalCount: QUESTIONS_PER_ROUND });

  // Load next question
  const loadNextQuestion = useCallback((excludeGroupId?: string) => {
    const q = generateTrickyQuestion({ excludeGroupId });
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, []);

  // Initialize new round
  const startNewRound = useCallback(() => {
    setQuestionNumber(1);
    setScore(0);
    setStreak(0);
    setIsRoundFinished(false);
    setRoundStats({ correctCount: 0, totalCount: QUESTIONS_PER_ROUND });
    loadNextQuestion();
  }, [loadNextQuestion]);

  // Handle choice submission
  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option === currentQuestion.correctOption;
    setIsCorrect(correct);

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      setScore(prev => prev + 10 + Math.min(nextStreak * 2, 20));
      setRoundStats(prev => ({ ...prev, correctCount: prev.correctCount + 1 }));

      playSfx('catch', { combo: nextStreak });
      speakJapanese(currentQuestion.targetKana);

      if (nextStreak === 5) {
        fireConfetti();
      }
    } else {
      setStreak(0);
      playSfx('miss');
    }
  };

  // Next question or finish round
  const handleProceed = () => {
    if (questionNumber >= QUESTIONS_PER_ROUND) {
      // Round completed
      setIsRoundFinished(true);
      const finalPercent = Math.round((roundStats.correctCount / QUESTIONS_PER_ROUND) * 100);

      if (finalPercent >= 80) {
        fireSuperCelebration();
      } else if (finalPercent >= 50) {
        fireConfetti();
      }

      recordActivity({
        type: 'practice_completed',
        practiceType: 'trickyHiragana',
        score: Math.max(score, 50)
      });
    } else {
      setQuestionNumber(prev => prev + 1);
      loadNextQuestion(currentQuestion?.groupId);
    }
  };

  const selectedGroup = TRICKY_HIRAGANA_GROUPS.find(g => g.id === selectedGroupId) || TRICKY_HIRAGANA_GROUPS[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-900 to-sumi-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-4 -bottom-4 text-8xl sm:text-9xl font-jp font-bold text-white/5 pointer-events-none select-none">
          似
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-brand-gold text-xs font-extrabold uppercase tracking-wider border border-white/10">
            <Zap size={14} /> Förväxlingsträning • 11 Tvillinggrupper
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            Kluriga Hiragana 🔀
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Tecken som ser nästan identiska ut (som <strong>れ, わ, ね</strong> eller <strong>め, ぬ</strong>) är nybörjarens största fallgrop. Här testas du <strong>endast mot tecknens tvillingar</strong> så att du lär dig se de avgörande detaljerna!
          </p>
        </div>
      </div>

      {/* Subtab Selector */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-sumi-900 p-1.5 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-xs gap-1">
          <button
            onClick={() => { setActiveTab('quiz'); playSfx('click'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800'
            }`}
          >
            <Zap size={15} />
            <span>Utmaningen (Test)</span>
          </button>
          <button
            onClick={() => { setActiveTab('guide'); playSfx('click'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800'
            }`}
          >
            <BookOpen size={15} />
            <span>Lathund & Jämförelse</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. QUIZ MODE                               */}
      {/* ========================================== */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          {!isRoundFinished && currentQuestion && (
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-lg space-y-6">
              {/* Progress & Stats Bar */}
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">
                  Fråga {questionNumber} av {QUESTIONS_PER_ROUND}
                </span>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-amber-500 font-mono text-sm">
                    <Flame size={16} /> {streak}x streak
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    {score} XP
                  </span>
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-sumi-800 text-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-200/70 dark:bg-sumi-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Grupp: {currentQuestion.groupTitle}
                </div>

                {currentQuestion.type === 'kana_to_romaji' ? (
                  <div>
                    <div className="text-8xl sm:text-9xl font-jp font-black text-slate-900 dark:text-white leading-none py-2">
                      {currentQuestion.targetKana}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
                      Vilket romaji-ljud hör till detta tecken?
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl sm:text-7xl font-mono font-black text-brand-600 dark:text-brand-gold uppercase leading-none py-2">
                      /{currentQuestion.targetRomaji}/
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
                      Vilket av dessa snarlika tecken är <strong>{currentQuestion.targetRomaji}</strong>?
                    </p>
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className={`grid gap-3 ${
                currentQuestion.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {currentQuestion.options.map((option) => {
                  const isOptionSelected = selectedAnswer === option;
                  const isThisCorrect = option === currentQuestion.correctOption;

                  let buttonStyle = 'bg-white dark:bg-sumi-800 border-slate-200 dark:border-sumi-700 text-slate-900 dark:text-white hover:border-brand-500 hover:scale-[1.02]';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400';
                    } else if (isOptionSelected) {
                      buttonStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300';
                    } else {
                      buttonStyle = 'opacity-40 border-slate-200 dark:border-sumi-800 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`py-4 sm:py-5 px-4 rounded-2xl border-2 font-bold transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer ${buttonStyle}`}
                    >
                      <span className={`${
                        currentQuestion.type === 'romaji_to_kana' 
                          ? 'text-4xl sm:text-5xl font-jp font-black' 
                          : 'text-2xl sm:text-3xl font-mono uppercase'
                      }`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Pedagogical Tip */}
              {isAnswered && (
                <div className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
                  isCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Helt rätt! {currentQuestion.targetKana} = {currentQuestion.targetRomaji}</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={20} className="text-rose-600 dark:text-rose-400" />
                          <span>Inte riktigt! Rätt svar är {currentQuestion.correctOption}</span>
                        </>
                      )}
                    </div>
                    <AudioButton text={currentQuestion.targetKana} size="sm" />
                  </div>

                  <div className="text-xs sm:text-sm space-y-1.5 pt-2 border-t border-black/10 dark:border-white/10">
                    <div>
                      <strong className="text-amber-700 dark:text-amber-300">💡 Kännetecken ({currentQuestion.keyFeature}):</strong>{' '}
                      <span>{currentQuestion.distinctionTip}</span>
                    </div>
                    <div>
                      <strong className="text-indigo-700 dark:text-indigo-300">🦊 Minnesregel:</strong>{' '}
                      <span>{currentQuestion.mnemonic}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleProceed}
                      autoFocus
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-bronze dark:hover:bg-amber-400 text-white dark:text-sumi-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>{questionNumber >= QUESTIONS_PER_ROUND ? 'Se slutresultat' : 'Nästa fråga'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Round Finish Screen */}
          {isRoundFinished && (
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-sumi-800 shadow-lg text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 mx-auto flex items-center justify-center">
                <Sparkles size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Ronden avklarad! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Du har testat dina ögon mot Hiraganas svåraste förväxlingstecken.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {roundStats.correctCount}/{QUESTIONS_PER_ROUND}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mt-1">Rätta svar</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
                  <div className="text-2xl font-black text-amber-500">
                    {bestStreak}x
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mt-1">Bästa streak</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
                  <div className="text-2xl font-black text-emerald-500">
                    +{score}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 mt-1">XP Erhållet</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={startNewRound}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-bronze text-white dark:text-sumi-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Kör en ny rond (10 frågor)</span>
                </button>
                <button
                  onClick={() => { setActiveTab('guide'); playSfx('click'); }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen size={16} />
                  <span>Se Lathund & Jämför</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 2. VISUAL GUIDE & COMPARISON TAB           */}
      {/* ========================================== */}
      {activeTab === 'guide' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Group Pill Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {TRICKY_HIRAGANA_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => { setSelectedGroupId(group.id); playSfx('click'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGroupId === group.id
                    ? 'bg-amber-400 text-sumi-950 font-black shadow-md scale-105'
                    : 'bg-white dark:bg-sumi-900 border border-slate-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>

          {/* Active Group Comparison Card */}
          <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-md space-y-6">
            {/* Header info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedGroup.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  {selectedGroup.nicknameSv}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {selectedGroup.categoryDescriptionSv}
              </p>
            </div>

            {/* Comparison Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs sm:text-sm text-amber-950 dark:text-amber-100">
              <HelpCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
              <div>
                <strong>Gyllene regeln:</strong> {selectedGroup.comparisonTipSv}
              </div>
            </div>

            {/* Side-by-side Character Grid */}
            <div className={`grid gap-4 ${
              selectedGroup.characters.length === 2 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-3'
            }`}>
              {selectedGroup.characters.map((char) => (
                <div
                  key={char.kana}
                  className="bg-slate-50 dark:bg-sumi-950 rounded-2xl p-6 border border-slate-200 dark:border-sumi-800 space-y-4 text-center flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xl font-black text-brand-600 dark:text-brand-gold uppercase">
                        /{char.romaji}/
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-100/70 dark:bg-brand-950 text-brand-700 dark:text-brand-gold">
                        {char.keyFeature}
                      </span>
                    </div>

                    <div className="text-8xl sm:text-9xl font-jp font-black text-slate-900 dark:text-white leading-none py-2">
                      {char.kana}
                    </div>

                    <div className="text-left bg-white dark:bg-sumi-900 p-3.5 rounded-xl border border-slate-200 dark:border-sumi-800 text-xs space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        🔍 Kännetecken:
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {char.distinctionSv}
                      </p>
                    </div>

                    <div className="text-left bg-indigo-50 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1.5">
                      <div className="font-bold text-indigo-900 dark:text-indigo-200">
                        🦊 Minnesregel:
                      </div>
                      <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
                        {char.mnemonicSv}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <AudioButton text={char.kana} size="md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => { setActiveTab('quiz'); startNewRound(); playSfx('click'); }}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-bronze dark:hover:bg-amber-400 text-white dark:text-sumi-950 font-extrabold text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Zap size={16} />
                <span>Starta quiz med dessa tecken!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
