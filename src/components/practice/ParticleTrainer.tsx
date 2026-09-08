import React, { useState, useCallback, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Volume2, 
  ArrowRight,
  HelpCircle,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  PARTICLE_DUEL_GROUPS, 
  PARTICLE_GUIDE_ITEMS,
  type ParticleDuelCategory,
  type ParticleQuestion,
  generateParticleSession
} from '../../data/particleData';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';

const QUESTIONS_PER_ROUND = 10;

export const ParticleTrainer: React.FC = () => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();

  const [activeTab, setActiveTab] = useState<'quiz' | 'guide'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<ParticleDuelCategory>('all');
  const [showRomaji, setShowRomaji] = useState<boolean>(false);

  // ==========================================
  // QUIZ STATE
  // ==========================================
  const [session, setSession] = useState<ParticleQuestion[]>(() => 
    generateParticleSession(QUESTIONS_PER_ROUND, 'all')
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Active question
  const currentQuestion = session[currentIndex] || session[0];

  // Start new round
  const startNewRound = useCallback((cat: ParticleDuelCategory = selectedCategory) => {
    const newSession = generateParticleSession(QUESTIONS_PER_ROUND, cat);
    setSession(newSession);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setIsRoundFinished(false);
  }, [selectedCategory]);

  const handleCategoryChange = (cat: ParticleDuelCategory) => {
    setSelectedCategory(cat);
    playSfx('click');
    startNewRound(cat);
  };

  // Select an option
  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option === currentQuestion.correctParticle;
    setIsCorrect(correct);

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      setScore(prev => prev + 10 + Math.min(nextStreak * 2, 20));
      setCorrectCount(prev => prev + 1);

      playSfx('catch', { combo: nextStreak });
      speakJapanese(currentQuestion.fullSentenceKana);

      if (nextStreak === 5) {
        fireConfetti();
      }
    } else {
      setStreak(0);
      playSfx('miss');
    }
  };

  // Proceed to next question or complete
  const handleProceed = useCallback(() => {
    if (currentIndex + 1 >= session.length) {
      // Finished round!
      setIsRoundFinished(true);
      const finalPercent = Math.round((correctCount / session.length) * 100);

      recordActivity({
        type: 'practice_completed',
        practiceType: 'particles',
        score: Math.max(50, score)
      });

      if (finalPercent >= 80) {
        fireSuperCelebration();
        playSfx('levelUp');
      } else {
        playSfx('click');
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      playSfx('click');
    }
  }, [currentIndex, session.length, correctCount, score, recordActivity, playSfx]);

  // Keyboard shortcut to advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'quiz') return;
      if (isAnswered && !isRoundFinished && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isAnswered, isRoundFinished, handleProceed]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-gradient-to-r from-ink-navy via-brand-700 to-sumi-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-bronze/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/15 backdrop-blur text-sakura-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
                <Sparkles size={14} /> Japansk Grammatik
              </span>
              <span className="text-xs text-slate-300 font-medium">Genki I Partiklar (助詞 Joshi)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Partikelträning (Lucktext & Dueller)
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Mästra japanskans viktigaste småord (は, が, を, に, で, へ, の, と, も, から, まで). 
              Lär dig varför varje partikel används genom pedagogiska svenska regelförklaringar.
            </p>
          </div>

          {/* Sub-tab Switcher: Quiz vs Guide */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur p-1.5 rounded-2xl border border-white/15 shrink-0">
            <button
              onClick={() => { setActiveTab('quiz'); playSfx('click'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-white text-ink-navy shadow-md'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>Träning & Quiz</span>
            </button>
            <button
              onClick={() => { setActiveTab('guide'); playSfx('click'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-400 text-sumi-950 shadow-md'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Partikelguide</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. QUIZ TAB */}
      {/* ========================================== */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Duel Filter Pills */}
          <div className="bg-white dark:bg-sumi-900 p-4 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Layers size={16} className="text-brand-600 dark:text-brand-gold" />
              <span>Fokusläge:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {PARTICLE_DUEL_GROUPS.map(group => {
                const isSelected = selectedCategory === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => handleCategoryChange(group.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? `${group.badgeColor} shadow-xs scale-102`
                        : 'bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700'
                    }`}
                  >
                    <span>{group.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Romaji toggle */}
            <button
              onClick={() => setShowRomaji(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700 transition-colors ml-auto cursor-pointer"
              title="Växla romaji-stöd"
            >
              {showRomaji ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showRomaji ? 'Dölj Romaji' : 'Visa Romaji'}</span>
            </button>
          </div>

          {/* Active Round Card */}
          {!isRoundFinished ? (
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 xl:p-10 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-8">
              {/* Progress & Stats Bar */}
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-sumi-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 dark:bg-sumi-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-mono">
                    Fråga {currentIndex + 1} / {session.length}
                  </span>
                  <span className="hidden sm:inline text-slate-400">
                    Nivå {currentQuestion.level}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-amber-500 font-mono text-sm flex items-center gap-1 font-bold">
                    <Flame size={16} className={streak > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-300'} />
                    Streak: {streak}x
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">
                    Poäng: {score}
                  </span>
                </div>
              </div>

              {/* Cloze Sentence Display Area */}
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="bg-slate-50 dark:bg-sumi-950 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-sumi-800 space-y-4">
                  {/* Hiragana Sentence with Gap */}
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-2xl sm:text-3xl md:text-4xl font-jp font-extrabold text-slate-900 dark:text-white leading-relaxed">
                    <span>{currentQuestion.sentenceParts[0]}</span>

                    {/* Gap Slot */}
                    <span 
                      className={`inline-flex items-center justify-center min-w-[56px] sm:min-w-[68px] px-3 py-1 rounded-2xl border-2 font-mono text-2xl sm:text-3xl font-black transition-all ${
                        !isAnswered
                          ? 'border-dashed border-brand-500 text-brand-600 dark:text-brand-gold bg-brand-50/50 dark:bg-brand-950/30 animate-pulse'
                          : isCorrect
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isAnswered ? currentQuestion.correctParticle : '?'}
                    </span>

                    <span>{currentQuestion.sentenceParts[1]}</span>
                  </div>

                  {/* Romaji assistance if toggled */}
                  {showRomaji && (
                    <p className="font-mono text-xs sm:text-sm text-brand-600 dark:text-brand-gold font-semibold pt-1">
                      {currentQuestion.romaji}
                    </p>
                  )}

                  {/* Swedish Translation */}
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium pt-1">
                    🇸🇪 "{currentQuestion.swedishTranslation}"
                  </p>

                  {/* Audio button for listening to full sentence */}
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => speakJapanese(currentQuestion.fullSentenceKana)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-200 dark:bg-sumi-800 hover:bg-slate-300 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Lyssna på japanska"
                    >
                      <Volume2 size={15} className="text-brand-600 dark:text-brand-gold" />
                      <span>Lyssna på meningen</span>
                    </button>
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Välj rätt partikel för luckan:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                    {currentQuestion.options.map(option => {
                      const isChosen = selectedAnswer === option;
                      const isThisCorrect = option === currentQuestion.correctParticle;

                      let btnStyle = 'border-slate-200 dark:border-sumi-700 bg-white dark:bg-sumi-800 text-slate-900 dark:text-white hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-sumi-700';

                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/50';
                        } else if (isChosen && !isThisCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 line-through opacity-70';
                        } else {
                          btnStyle = 'border-slate-200 dark:border-sumi-800 bg-slate-50 dark:bg-sumi-900 text-slate-400 opacity-40';
                        }
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleSelectOption(option)}
                          disabled={isAnswered}
                          className={`p-4 sm:p-5 rounded-2xl border-2 font-jp text-3xl font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <span>{option}</span>
                          <span className="text-[10px] font-mono font-normal opacity-60">
                            {option === 'は' ? 'wa' : option === 'へ' ? 'e' : option === 'を' ? 'o' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback & Swedish Rule Explanation Card */}
                {isAnswered && (
                  <div className={`p-6 rounded-3xl border-2 text-left space-y-4 animate-fadeIn ${
                    isCorrect 
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                            <CheckCircle2 size={20} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                            <XCircle size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className={`text-base font-extrabold ${isCorrect ? 'text-emerald-900 dark:text-emerald-300' : 'text-rose-900 dark:text-rose-300'}`}>
                            {isCorrect ? 'Helt rätt! 🎯' : `Inte riktigt! Rätt svar är "${currentQuestion.correctParticle}"`}
                          </h4>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {currentQuestion.ruleSummary}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleProceed}
                        className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
                      >
                        <span>{currentIndex + 1 < session.length ? 'Nästa fråga' : 'Se resultat'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="bg-white/80 dark:bg-sumi-900/90 p-4 rounded-2xl border border-slate-200/60 dark:border-sumi-800 space-y-2">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {currentQuestion.explanationSv}
                      </p>

                      {currentQuestion.keyCueSv && (
                        <div className="pt-2 border-t border-slate-100 dark:border-sumi-800 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                          <Sparkles size={14} className="text-amber-500 shrink-0" />
                          <span>💡 Kom ihåg: {currentQuestion.keyCueSv}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================== */
            /* ROUND FINISHED SUMMARY SCREEN              */
            /* ========================================== */
            <div className="bg-white dark:bg-sumi-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-sumi-800 shadow-xs max-w-xl mx-auto text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-inner text-3xl">
                🏆
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Rundan avslutad!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Starkt jobbat med de japanska partiklarna.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Träffsäkerhet</span>
                  <div className="text-2xl font-black text-brand-600 dark:text-brand-gold mt-1">
                    {Math.round((correctCount / session.length) * 100)}%
                  </div>
                  <span className="text-[11px] text-slate-500">{correctCount} av {session.length}</span>
                </div>

                <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Poäng</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {score}
                  </div>
                  <span className="text-[11px] text-slate-500">+{Math.max(15, Math.round(score * 0.8))} XP</span>
                </div>

                <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Bästa streak</span>
                  <div className="text-2xl font-black text-amber-500 mt-1">
                    {bestStreak}x
                  </div>
                  <span className="text-[11px] text-slate-500">i rad</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => startNewRound(selectedCategory)}
                  className="flex-1 py-3 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <RotateCcw size={16} />
                  <span>Kör igen ({PARTICLE_DUEL_GROUPS.find(g => g.id === selectedCategory)?.title})</span>
                </button>

                <button
                  onClick={() => setActiveTab('guide')}
                  className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BookOpen size={16} />
                  <span>Öppna Partikelguiden</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 2. GUIDE TAB (REGELBOK & FUSKLAPP)         */}
      {/* ========================================== */}
      {activeTab === 'guide' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Intro Box */}
          <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="text-brand-600 dark:text-brand-gold" size={22} />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Partikelguiden (Grammatisk Fusklapp)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Japanska partiklar (助詞 joshi) är postpositioner som fästs direkt efter ord för att tala om ordets roll i meningen. 
              Här är din kompletta referensbok för alla grundpartiklar med gyllene regler och exempelmeningar med ljud!
            </p>
          </div>

          {/* Quick Comparison Box: The 3 Classic Traps */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm sm:text-base">
              <Sparkles className="text-amber-500" size={18} />
              <span>De 3 Klassiska Partikelfällorna att se upp med:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/90 dark:bg-sumi-900 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                <span className="font-bold text-xs text-brand-600 dark:text-brand-gold">
                  1. は (wa) vs が (ga)
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>は:</strong> Sätter scenen ("Vad gäller mig...").<br />
                  <strong>が:</strong> Pekar ut det specifika subjektet och används alltid med <em>すき</em> (gilla) och <em>あります/います</em> (finns).
                </p>
              </div>

              <div className="bg-white/90 dark:bg-sumi-900 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                  2. に (ni) vs で (de)
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>に:</strong> Statisk existens, specifik tid och mål.<br />
                  <strong>で:</strong> Plats där du utför en aktiv handling (äta, läsa) eller färdmedel/redskap.
                </p>
              </div>

              <div className="bg-white/90 dark:bg-sumi-900 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                <span className="font-bold text-xs text-purple-600 dark:text-purple-400">
                  3. を (o) vs に (ni)
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>を:</strong> Direkt objekt för transitiv handling.<br />
                  <strong>OBS:</strong> Att träffa en vän heter <em>ともだちに あう</em> (ni, inte o!).
                </p>
              </div>
            </div>
          </div>

          {/* Guide Cards for each Particle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PARTICLE_GUIDE_ITEMS.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-sumi-900 rounded-3xl p-6 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-sumi-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-sumi-950 border border-brand-200 dark:border-brand-900/40 flex items-center justify-center font-jp text-2xl font-black text-brand-600 dark:text-brand-gold">
                        {item.particle}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {item.nameSv}
                          </h4>
                          <span className="font-mono text-xs font-bold text-slate-400">
                            /{item.romaji}/
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.coreRoleSv}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Golden Rules */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Gyllene Regler:
                    </span>
                    <ul className="space-y-1">
                      {item.goldenRulesSv.map((rule, rIdx) => (
                        <li key={rIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-brand-600 dark:text-brand-gold font-bold">✔</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples with Audio */}
                  <div className="space-y-2 bg-slate-50 dark:bg-sumi-950 p-3.5 rounded-2xl border border-slate-200 dark:border-sumi-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Exempelmeningar:
                    </span>
                    <div className="space-y-2">
                      {item.exampleSentences.map((ex, eIdx) => (
                        <div key={eIdx} className="flex items-center justify-between text-xs gap-2">
                          <div>
                            <span className="font-jp font-bold text-slate-900 dark:text-white text-sm">
                              {ex.kana}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 block">
                              {ex.romaji}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300 italic block">
                              🇸🇪 {ex.translationSv}
                            </span>
                          </div>
                          <button
                            onClick={() => speakJapanese(ex.kana)}
                            className="p-1.5 rounded-xl bg-white dark:bg-sumi-900 hover:bg-slate-200 dark:hover:bg-sumi-800 text-brand-600 dark:text-brand-gold shrink-0 border border-slate-200 dark:border-sumi-800 transition-colors cursor-pointer"
                            title="Lyssna"
                          >
                            <Volume2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pitfall Alert */}
                <div className="pt-2">
                  <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-[11px] text-rose-900 dark:text-rose-200 flex items-start gap-2">
                    <HelpCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Fälla:</strong> {item.pitfallWarningSv}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
