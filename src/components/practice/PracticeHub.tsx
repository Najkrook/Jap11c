import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, 
  CheckSquare, 
  Keyboard, 
  BookOpen, 
  Timer, 
  RotateCcw, 
  Sparkles, 
  Trophy
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { GENKI_L1_VOCABULARY } from '../../data/japc11Vocab';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/ProgressionContext';
import { fireSuperCelebration } from '../common/Confetti';
import { useMnemonicCoach } from '../../context/MnemonicCoachContext';

interface PracticeHubProps {}

export const PracticeHub: React.FC<PracticeHubProps> = () => {
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();
  const { showCoach, isCoachEnabled, isOpen: isCoachOpen } = useMnemonicCoach();
  const [activeMode, setActiveMode] = useState<'quiz' | 'typing' | 'trace' | 'words' | 'speed'>('quiz');

  // ==========================================
  // 1. MULTIPLE CHOICE QUIZ STATE
  // ==========================================
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<{
    target: KanaCharacter;
    options: KanaCharacter[];
  }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const initQuiz = () => {
    const shuffled = [...HIRAGANA_DATA].sort(() => Math.random() - 0.5).slice(0, 10);
    const questions = shuffled.map((target) => {
      const distractors = HIRAGANA_DATA
        .filter(k => k.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      return { target, options };
    });

    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  useEffect(() => {
    if (activeMode === 'quiz') {
      initQuiz();
    }
  }, [activeMode]);

  const handleQuizAnswer = (chosenRomaji: string) => {
    if (selectedOption !== null || !quizQuestions[quizIndex]) return;
    setSelectedOption(chosenRomaji);

    const target = quizQuestions[quizIndex].target;
    const isCorrect = chosenRomaji.toLowerCase() === target.romaji.toLowerCase();
    if (isCorrect) {
      playSfx('catch', { combo: 2 });
      setQuizScore(prev => prev + 1);
    } else {
      playSfx('miss');
      if (isCoachEnabled && target) {
        showCoach(target);
      }
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      playSfx('levelUp');
      fireSuperCelebration();

      recordActivity({
        type: 'practice_completed',
        practiceType: 'quiz',
        score: quizScore * 10
      });
    }
  };

  // ==========================================
  // 2. SPEED TYPING STATE
  // ==========================================
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [typingInput, setTypingInput] = useState<string>('');
  const [typingList, setTypingList] = useState<KanaCharacter[]>([]);
  const [typingStreak, setTypingStreak] = useState<number>(0);
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  const initTyping = () => {
    const shuffled = [...HIRAGANA_DATA].sort(() => Math.random() - 0.5).slice(0, 20);
    setTypingList(shuffled);
    setTypingIndex(0);
    setTypingInput('');
    setTypingStreak(0);
  };

  useEffect(() => {
    if (activeMode === 'typing') {
      initTyping();
    }
  }, [activeMode]);

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypingInput(val);

    const current = typingList[typingIndex];
    if (current && val.toLowerCase().trim() === current.romaji.toLowerCase()) {
      // MATCH!
      playSfx('catch', { combo: typingStreak + 1 });
      speakJapanese(current.kana, { rate: 1.1 });
      setTypingStreak(prev => prev + 1);
      setTypingInput('');

      if (typingIndex + 1 < typingList.length) {
        setTypingIndex(prev => prev + 1);
      } else {
        fireSuperCelebration();
        initTyping();
      }
    }
  };

  const handleTypingKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const current = typingList[typingIndex];
      if (current && typingInput.trim().toLowerCase() !== current.romaji.toLowerCase()) {
        playSfx('miss');
        if (isCoachEnabled) {
          showCoach(current);
        }
      }
    }
  };

  // ==========================================
  // 3. CANVAS TRACING STATE
  // ==========================================
  const [traceKanaIndex, setTraceKanaIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTraceKana = HIRAGANA_DATA[traceKanaIndex];

  const clearTraceCanvas = () => {
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#002B49';
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // ==========================================
  // 4. GENKI I WORD READER STATE
  // ==========================================
  const [revealedWords, setRevealedWords] = useState<Record<number, boolean>>({});

  const toggleRevealWord = (idx: number) => {
    setRevealedWords(prev => ({ ...prev, [idx]: !prev[idx] }));
    playSfx('click');
  };

  // ==========================================
  // 5. 60-SECOND SPEED CHALLENGE STATE
  // ==========================================
  const [speedState, setSpeedState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedTarget, setSpeedTarget] = useState<KanaCharacter>(HIRAGANA_DATA[0]);
  const [speedOptions, setSpeedOptions] = useState<string[]>([]);

  const spawnSpeedQuestion = () => {
    const target = HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)];
    const distractors = HIRAGANA_DATA
      .filter(k => k.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(k => k.romaji);
    const options = [target.romaji, ...distractors].sort(() => Math.random() - 0.5);

    setSpeedTarget(target);
    setSpeedOptions(options);
  };

  const startSpeedChallenge = () => {
    setTimeLeft(60);
    setSpeedScore(0);
    setSpeedState('running');
    spawnSpeedQuestion();
    playSfx('click');
  };

  useEffect(() => {
    if (speedState !== 'running' || isCoachOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSpeedState('finished');
          playSfx('levelUp');
          fireSuperCelebration();
          recordActivity({
            type: 'practice_completed',
            practiceType: 'speed60s',
            score: speedScore
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [speedState, isCoachOpen, speedScore, recordActivity, playSfx]);

  const handleSpeedAnswer = (chosenRomaji: string) => {
    if (speedState !== 'running') return;

    if (chosenRomaji.toLowerCase() === speedTarget.romaji.toLowerCase()) {
      playSfx('catch', { combo: 2 });
      setSpeedScore(prev => prev + 1);
    } else {
      playSfx('miss');
      if (isCoachEnabled) {
        showCoach(speedTarget);
      }
    }
    spawnSpeedQuestion();
  };

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white dark:bg-sumi-900 p-5 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="text-brand-600 dark:text-brand-gold" size={24} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Övningshubben (Aktiva Lärverktyg)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Välj träningsform för att stärka minnet genom aktiv framkallning och handskrift.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {[
            { id: 'quiz', label: 'Flervalstest', icon: CheckSquare },
            { id: 'typing', label: 'Skriv Romaji', icon: Keyboard },
            { id: 'trace', label: 'Streckordning', icon: PenTool },
            { id: 'words', label: 'Genki I Ord', icon: BookOpen },
            { id: 'speed', label: '60s Snabbtest', icon: Timer },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as any);
                  playSfx('click');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                    : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700'
                }`}
              >
                <Icon size={14} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. FLERVALSTEST MODE */}
      {/* ========================================== */}
      {activeMode === 'quiz' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 xl:p-10 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          {!quizFinished && quizQuestions[quizIndex] ? (
            <div className="max-w-2xl xl:max-w-3xl mx-auto space-y-6 text-center">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Fråga {quizIndex + 1} av {quizQuestions.length}</span>
                <span className="text-emerald-500 font-mono text-sm">{quizScore} rätt</span>
              </div>

              {/* Kana Target Card */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-sumi-800">
                <div className="text-8xl sm:text-9xl font-jp font-black text-slate-900 dark:text-white my-2">
                  {quizQuestions[quizIndex].target.kana}
                </div>
                <div className="mt-4 flex justify-center">
                  <AudioButton text={quizQuestions[quizIndex].target.kana} size="md" showLabel label="Lyssna på uttal" variant="secondary" />
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {quizQuestions[quizIndex].options.map((opt, optIdx) => {
                  const isTarget = opt.romaji.toLowerCase() === quizQuestions[quizIndex].target.romaji.toLowerCase();
                  const isChosen = selectedOption === opt.romaji;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleQuizAnswer(opt.romaji)}
                      className={`py-5 px-4 rounded-2xl border-2 font-mono text-xl sm:text-2xl font-bold uppercase transition-all duration-150 relative cursor-pointer ${
                        selectedOption === null
                          ? 'border-slate-200 dark:border-sumi-700 bg-slate-50 dark:bg-sumi-950 hover:border-brand-bronze text-slate-800 dark:text-slate-200 hover:scale-102'
                          : isTarget
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 scale-102'
                          : isChosen
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          : 'border-slate-200 dark:border-sumi-800 opacity-50 bg-slate-50 dark:bg-sumi-950 text-slate-400'
                      }`}
                    >
                      <span className="hidden sm:inline-block absolute top-2.5 left-2.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-sumi-800 text-slate-500">
                        {optIdx + 1}
                      </span>
                      {opt.romaji}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              {selectedOption !== null && (
                <div className="pt-2 animate-fadeIn">
                  <button
                    onClick={nextQuizQuestion}
                    className="w-full py-4 rounded-2xl bg-brand-600 text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-sm sm:text-base shadow-md hover:scale-102 transition-transform cursor-pointer"
                  >
                    Nästa fråga →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Trophy size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Flervalstest Klart! 🎉
              </h2>
              <p className="text-sm text-slate-500">
                Du fick <strong className="text-emerald-500 text-base">{quizScore}</strong> av {quizQuestions.length} rätt!
              </p>
              <button
                onClick={initQuiz}
                className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-xs cursor-pointer"
              >
                Gör ett nytt flervalstest
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 2. SPEED TYPING DRILL */}
      {/* ========================================== */}
      {activeMode === 'typing' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 xl:p-10 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div className="max-w-xl xl:max-w-2xl mx-auto space-y-6 text-center">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Tecken {typingIndex + 1} av {typingList.length}</span>
              <span className="text-amber-500 font-mono text-sm flex items-center gap-1">
                <Sparkles size={16} /> Streak: {typingStreak}x
              </span>
            </div>

            {/* Target Kana */}
            {typingList[typingIndex] && (
              <div className="bg-slate-50 dark:bg-sumi-950 p-10 xl:p-12 rounded-3xl border border-slate-200 dark:border-sumi-800 space-y-4">
                <div className="text-9xl xl:text-[130px] font-jp font-black text-slate-900 dark:text-white leading-none">
                  {typingList[typingIndex].kana}
                </div>
                <p className="text-xs text-slate-400">
                  💡 Skriv romaji på tangentbordet (t.ex. "ka")
                </p>
              </div>
            )}

            {/* Input Field */}
            <div className="space-y-2">
              <input
                ref={typingInputRef}
                type="text"
                autoFocus
                value={typingInput}
                onChange={handleTypingChange}
                onKeyDown={handleTypingKeyDown}
                placeholder="Skriv romaji här..."
                className="w-full text-center font-mono text-3xl font-bold py-4 px-6 rounded-2xl bg-slate-100 dark:bg-sumi-800 border-2 border-slate-300 dark:border-sumi-600 focus:outline-none focus:ring-2 focus:ring-brand-bronze uppercase tracking-widest text-slate-900 dark:text-white"
              />
              {typingList[typingIndex] && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => showCoach(typingList[typingIndex])}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <span>🦊 Behöver du hjälp? Se minnesregeln</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. CANVAS TRACING MODE */}
      {/* ========================================== */}
      {activeMode === 'trace' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Handskrift & Streckordning ✍️
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Öva på att rita tecknet för hand för att bygga ett starkt muskelminne.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTraceKanaIndex(prev => Math.max(prev - 1, 0));
                  clearTraceCanvas();
                  playSfx('click');
                }}
                disabled={traceKanaIndex === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                ← Föregående
              </button>
              <span className="text-xs font-mono font-bold text-slate-500">
                {traceKanaIndex + 1} / {HIRAGANA_DATA.length}
              </span>
              <button
                onClick={() => {
                  setTraceKanaIndex(prev => Math.min(prev + 1, HIRAGANA_DATA.length - 1));
                  clearTraceCanvas();
                  playSfx('click');
                }}
                disabled={traceKanaIndex === HIRAGANA_DATA.length - 1}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Nästa →
              </button>
            </div>
          </div>

          {/* Desktop Split View: Canvas on Left, Details on Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            {/* Canvas column */}
            <div className="xl:col-span-6 flex flex-col items-center space-y-3">
              <div className="w-full flex justify-between items-center px-2">
                <span className="text-xs text-slate-400">Rita med musen eller touch:</span>
                <button
                  onClick={clearTraceCanvas}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-sumi-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} /> Rensa tavlan
                </button>
              </div>

              <div className="relative w-full aspect-square max-w-[360px] mx-auto bg-slate-50 dark:bg-sumi-950 rounded-3xl border-2 border-dashed border-slate-300 dark:border-sumi-700 overflow-hidden flex items-center justify-center select-none shadow-inner">
                {/* Reference Grid */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border-b border-dashed border-slate-200 dark:border-sumi-800 absolute top-0" style={{ height: '50%' }}></div>
                  <div className="w-full h-full border-r border-dashed border-slate-200 dark:border-sumi-800 absolute left-0" style={{ width: '50%' }}></div>
                </div>

                {/* Ghost Guide Character */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 font-jp text-[220px] font-bold text-slate-900 dark:text-white select-none">
                  {activeTraceKana.kana}
                </div>

                {/* Canvas */}
                <canvas
                  ref={traceCanvasRef}
                  width={400}
                  height={400}
                  onMouseDown={startDraw}
                  onMouseMove={drawMove}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onTouchStart={startDraw}
                  onTouchMove={drawMove}
                  onTouchEnd={() => setIsDrawing(false)}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                />
              </div>
            </div>

            {/* Details Column on Desktop */}
            <div className="xl:col-span-6 space-y-4">
              <div className="bg-slate-50 dark:bg-sumi-950 p-5 rounded-2xl border border-slate-200 dark:border-sumi-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-2xl font-bold text-brand-600 dark:text-brand-gold uppercase">
                    /{activeTraceKana.romaji}/
                  </span>
                  <span className="text-xs text-slate-400 ml-3">
                    ({activeTraceKana.strokeCount} {activeTraceKana.strokeCount === 1 ? 'streck' : 'streck'})
                  </span>
                </div>
                <AudioButton text={activeTraceKana.kana} size="md" />
              </div>

              {/* Mnemonic info */}
              <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Svensk Minnesbild</span>
                </div>
                <p className="text-sm font-bold text-amber-950 dark:text-amber-100">
                  {activeTraceKana.mnemonic.summary}
                </p>
                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  {activeTraceKana.mnemonic.storySv}
                </p>
              </div>

              {/* Pronunciation Advice */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 text-xs text-slate-600 dark:text-slate-300">
                <strong>Uttal:</strong> {activeTraceKana.pronunciationTipSv}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. GENKI I WORD READER MODE */}
      {/* ========================================== */}
      {activeMode === 'words' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Genki I Ordläsning 📖
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Öva på att läsa riktiga nybörjarord skrivna i ren Hiragana utan romaji. Klicka på kortet för att avslöja betydelsen!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {GENKI_L1_VOCABULARY.map((word, idx) => {
              const isRevealed = !!revealedWords[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleRevealWord(idx)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isRevealed
                      ? 'border-brand-600 dark:border-brand-bronze bg-slate-50 dark:bg-sumi-950'
                      : 'border-slate-200 dark:border-sumi-800 hover:border-slate-300 bg-white dark:bg-sumi-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-jp text-2xl font-extrabold text-slate-900 dark:text-white">
                      {word.kana}
                    </span>
                    <AudioButton text={word.kana} size="sm" />
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-sumi-800/80">
                    {isRevealed ? (
                      <div>
                        <span className="font-mono text-xs text-brand-600 dark:text-brand-gold font-bold">
                          {word.romaji}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          🇸🇪 {word.meaningSv}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Klicka för att avslöja svar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. 60-SECOND SPEED CHALLENGE */}
      {/* ========================================== */}
      {activeMode === 'speed' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          {speedState === 'idle' && (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Timer size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                60-Sekunders Snabbtest ⏱️
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hur många Hiragana hinner du identifiera på 60 sekunder? Perfekt för att träna upp snabbt läsflyt!
              </p>
              <button
                onClick={startSpeedChallenge}
                className="px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm shadow-md cursor-pointer"
              >
                Starta Snabbtestet
              </button>
            </div>
          )}

          {speedState === 'running' && (
            <div className="max-w-xl xl:max-w-2xl mx-auto space-y-6 text-center">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black font-mono text-rose-500 flex items-center gap-1">
                  <Timer size={24} /> {timeLeft}s
                </span>
                <span className="text-2xl font-black font-mono text-emerald-500">
                  Poäng: {speedScore}
                </span>
              </div>

              {/* Target Character */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-10 xl:p-12 rounded-3xl border border-slate-200 dark:border-sumi-800">
                <div className="text-9xl xl:text-[130px] font-jp font-black text-slate-900 dark:text-white animate-soft-pulse leading-none">
                  {speedTarget.kana}
                </div>
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {speedOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpeedAnswer(opt)}
                    className="py-5 rounded-2xl font-mono text-xl sm:text-2xl font-bold uppercase bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-900 dark:text-white transition-all active:scale-95 shadow-xs cursor-pointer relative"
                  >
                    <span className="hidden sm:inline-block absolute top-2.5 left-2.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-sumi-900 text-slate-500">
                      {idx + 1}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {speedState === 'finished' && (
            <div className="text-center py-8 space-y-4 max-w-sm mx-auto">
              <div className="text-5xl">⚡</div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Tiden är ute!
              </h2>
              <p className="text-sm text-slate-500">
                Du klarade <strong className="text-2xl text-emerald-500 font-mono">{speedScore}</strong> tecken på 60 sekunder!
              </p>
              <button
                onClick={startSpeedChallenge}
                className="px-6 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Kör en omgång till
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
