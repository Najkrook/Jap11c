import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { GAIRAIGO_WORDS, type GairaigoWord } from '../../data/gairaigoData';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/ProgressionContext';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';

export const GairaigoDecoder: React.FC = () => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [shuffledWords, setShuffledWords] = useState<GairaigoWord[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);

  // Filter words
  const filteredWords = useCallback(() => {
    if (selectedCategory === 'all') return GAIRAIGO_WORDS;
    return GAIRAIGO_WORDS.filter(w => w.category === selectedCategory);
  }, [selectedCategory]);

  // Shuffle and init deck
  const initGame = useCallback(() => {
    const list = [...filteredWords()].sort(() => Math.random() - 0.5);
    setShuffledWords(list);
    setCurrentWordIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setShowClue(false);
    setStreak(0);
    setScore(0);
  }, [filteredWords]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentWord = shuffledWords[currentWordIndex] || null;

  // Generate 4 options for the current question
  useEffect(() => {
    if (!currentWord) return;

    const correct = currentWord.meaningSv;
    const pool = GAIRAIGO_WORDS.filter(w => w.meaningSv !== correct).map(w => w.meaningSv);
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [...shuffledPool, correct].sort(() => Math.random() - 0.5);

    setOptions(combined);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setShowClue(false);
  }, [currentWord]);

  // Handle guessing
  const handleSelectOption = (option: string) => {
    if (isAnswerRevealed || !currentWord) return;

    setSelectedOption(option);
    setIsAnswerRevealed(true);

    const isCorrect = option === currentWord.meaningSv;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 10 + Math.min(newStreak * 2, 20));
      playSfx('catch', { combo: newStreak });
      speakJapanese(currentWord.katakana);

      if (newStreak % 5 === 0) {
        fireConfetti();
      }

      recordActivity({
        type: 'practice_completed',
        practiceType: 'gairaigo' as any,
        score: 60
      });
    } else {
      setStreak(0);
      playSfx('miss');
    }
  };

  const handleNextWord = () => {
    playSfx('click');
    if (currentWordIndex + 1 < shuffledWords.length) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Completed all
      fireSuperCelebration();
      playSfx('levelUp');
    }
  };

  const categories = [
    { id: 'all', label: 'Alla Låneord' },
    { id: 'food', label: '🍔 Mat & Dryck' },
    { id: 'tech_gaming', label: '🎮 Teknik & Spel' },
    { id: 'travel_places', label: '✈️ Resor & Platser' },
    { id: 'daily_life', label: '🛍️ Vardag & Kläder' },
    { id: 'pop_culture', label: '🎤 Popkultur' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-amber-950 dark:to-sumi-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Experimentellt • Labb 1
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gairaigo Mystery Decoder 🕵️‍♂️
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
            I modern japanska är över <strong>10% av alla ord</strong> låneord skrivna i Katakana (Gairaigo). Träna ditt öra och din läshastighet genom att knäcka vad de betyder!
          </p>
        </div>
      </div>

      {/* Category Pills & Score Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-sumi-900 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-xs">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                playSfx('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-sumi-950 font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-900">
            <Flame size={15} className="text-amber-500 fill-amber-500" />
            <span>{streak}x streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-900">
            <Trophy size={14} />
            <span>{score} poäng</span>
          </div>
        </div>
      </div>

      {/* Main Decoder Box */}
      {currentWord && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-200 dark:border-sumi-800 shadow-md space-y-8 max-w-3xl mx-auto text-center">
          
          {/* Header Tag: Category & Origin Flag */}
          <div className="flex justify-between items-center text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-sumi-800 font-bold text-slate-600 dark:text-slate-300">
              {currentWord.categoryLabelSv} • Ord {currentWordIndex + 1} av {shuffledWords.length}
            </span>

            <span className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
              <span>Ursprung:</span>
              <span className="text-base">{currentWord.originFlag}</span>
              <span>{currentWord.originLanguage}</span>
            </span>
          </div>

          {/* Mystery Katakana Word Tile */}
          <div className="py-4 space-y-3">
            <div className="inline-flex items-center justify-center gap-4 bg-slate-50 dark:bg-sumi-950 px-8 py-6 rounded-3xl border-2 border-dashed border-amber-300 dark:border-amber-800/80 shadow-inner">
              <span className="font-jp text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-wider">
                {currentWord.katakana}
              </span>
              <AudioButton text={currentWord.katakana} size="lg" />
            </div>

            <div className="text-xs font-mono text-slate-400">
              Romaji: <span className="font-bold text-slate-600 dark:text-slate-300">{currentWord.romaji}</span>
            </div>
          </div>

          {/* Clue Accordion */}
          <div>
            {!showClue ? (
              <button
                type="button"
                onClick={() => { setShowClue(true); playSfx('click'); }}
                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Lightbulb size={15} /> Visa ledtråd 💡
              </button>
            ) : (
              <div className="bg-amber-50/80 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
                <strong>💡 Ledtråd:</strong> {currentWord.clueSv}
              </div>
            )}
          </div>

          {/* Multiple Choice Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentWord.meaningSv;

              let btnStyle = 'bg-slate-50 dark:bg-sumi-950 border-slate-200 dark:border-sumi-700 text-slate-800 dark:text-slate-200 hover:border-amber-400';

              if (isAnswerRevealed) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-extrabold shadow-sm';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 line-through opacity-70';
                } else {
                  btnStyle = 'opacity-40 border-transparent bg-slate-50 dark:bg-sumi-950 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswerRevealed}
                  className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all text-left flex justify-between items-center cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerRevealed && isCorrect && <CheckCircle2 size={18} className="text-emerald-500" />}
                  {isAnswerRevealed && isSelected && !isCorrect && <XCircle size={18} className="text-rose-500" />}
                </button>
              );
            })}
          </div>

          {/* Result Card with Fun Fact */}
          {isAnswerRevealed && (
            <div className="bg-slate-50 dark:bg-sumi-950 p-5 rounded-2xl border border-slate-200 dark:border-sumi-800 text-left space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Info size={15} className="text-amber-500" />
                <span>Språkfakta & Etymologi</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Originalord: <span className="font-bold text-slate-900 dark:text-white">{currentWord.originWord}</span> ({currentWord.originLanguage} {currentWord.originFlag}) → Japanska: <span className="font-bold text-amber-600 dark:text-amber-400">{currentWord.katakana}</span>
              </p>
              {currentWord.funFactSv && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-sumi-800">
                  ✨ {currentWord.funFactSv}
                </p>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNextWord}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Nästa ord</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Footer Restart */}
      <div className="flex justify-center pt-2">
        <button
          onClick={initGame}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} /> Starta om och blanda leken
        </button>
      </div>
    </div>
  );
};
