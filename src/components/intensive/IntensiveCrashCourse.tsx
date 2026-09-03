import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Calendar, 
  Sparkles, 
  Gamepad2, 
  BrainCircuit, 
  Grid3X3, 
  HelpCircle,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { INTENSIVE_DAYS_DATA, DIAGNOSTIC_EXAM_ITEMS } from '../../data/intensiveData';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';
import { fireSuperCelebration } from '../common/Confetti';
import { useProgression } from '../../context/progressionState';
import { useMnemonicCoach } from '../../context/mnemonicCoachState';
import { useNavigate } from 'react-router-dom';
import { type ActiveTab, TAB_ROUTES } from '../layout/navigation';

interface IntensiveCrashCourseProps {
  onNavigate?: (tab: ActiveTab | string) => void;
}

const STORAGE_KEY = 'kanamaster_intensive_tasks_v1';

export const IntensiveCrashCourse: React.FC<IntensiveCrashCourseProps> = ({
  onNavigate
}) => {
  const navigate = useNavigate();
  const handleNavigate = (tab: ActiveTab | string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      const route = TAB_ROUTES[tab as ActiveTab] || '/';
      navigate(route);
    }
  };

  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Diagnostic Exam State
  const [examActive, setExamActive] = useState<boolean>(false);
  const [examIndex, setExamIndex] = useState<number>(0);
  const [examScore, setExamScore] = useState<number>(0);
  const [examChosenOption, setExamChosenOption] = useState<string | null>(null);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [wrongRows, setWrongRows] = useState<string[]>([]);

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    } catch (e) {
      console.warn('Failed to save intensive tasks', e);
    }
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      playSfx('click');
      return next;
    });
  };

  // Calculate total progress
  const totalTasks = INTENSIVE_DAYS_DATA.reduce((acc, d) => 
    acc + d.blocks.reduce((bAcc, b) => bAcc + b.tasks.length, 0), 0
  );
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const currentDay = INTENSIVE_DAYS_DATA[selectedDayIdx];

  // Exam handlers
  const startExam = () => {
    setExamActive(true);
    setExamIndex(0);
    setExamScore(0);
    setExamChosenOption(null);
    setExamFinished(false);
    setWrongRows([]);
    playSfx('click');
  };

  const { showCoach, isCoachEnabled } = useMnemonicCoach();

  const handleExamAnswer = (chosen: string) => {
    if (examChosenOption !== null) return;
    setExamChosenOption(chosen);

    const currentItem = DIAGNOSTIC_EXAM_ITEMS[examIndex];
    const isCorrect = chosen.toLowerCase() === currentItem.romaji.toLowerCase();

    if (isCorrect) {
      playSfx('catch', { combo: 2 });
      setExamScore(prev => prev + 1);
    } else {
      playSfx('miss');
      if (!wrongRows.includes(currentItem.row)) {
        setWrongRows(prev => [...prev, currentItem.row]);
      }
      if (isCoachEnabled && currentItem.kana) {
        showCoach(currentItem.kana);
      }
    }
  };

  const nextExamQuestion = () => {
    if (examIndex + 1 < DIAGNOSTIC_EXAM_ITEMS.length) {
      setExamIndex(prev => prev + 1);
      setExamChosenOption(null);
    } else {
      setExamFinished(true);
      playSfx('levelUp');
      fireSuperCelebration();

      recordActivity({
        type: 'intensive_exam_completed',
        score: examScore,
        totalQuestions: DIAGNOSTIC_EXAM_ITEMS.length
      });
    }
  };

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Textbook Cover Header */}
      <div className="relative bg-gradient-to-r from-ink-navy via-brand-600 to-slate-900 text-white rounded-3xl p-6 sm:p-9 shadow-xl border border-brand-bronze/30 overflow-hidden">
        {/* Subtle dot grid watermark */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-[180px] font-jp font-bold pointer-events-none select-none">
          速
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20">
            <Zap size={14} className="fill-amber-300 text-amber-300" /> Intensivstudie • 72-Timmars Bootcamp
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hiragana på 2–3 Dagar ⚡
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Ett komprimerat studieprogram för dig som vill lära dig all Hiragana snabbt och effektivt. Följ dagsplanerna med svenska minnesbilder, Shinkansen Rush och aktiva minneskort.
          </p>

          {/* Overall Progress Bar */}
          <div className="pt-2 max-w-md">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Totalt avklarade moment: {completedCount} / {totalTasks}</span>
              <span className="font-mono text-amber-300 font-bold">{progressPercent}% klart</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs (Styled like clean notebook dividers) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-sumi-800">
        {INTENSIVE_DAYS_DATA.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => {
              setSelectedDayIdx(idx);
              setExamActive(false);
              playSfx('click');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              selectedDayIdx === idx && !examActive
                ? 'bg-ink-navy text-white shadow-md dark:bg-brand-bronze dark:text-sumi-950 -translate-y-0.5'
                : 'bg-white dark:bg-sumi-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800 border border-slate-200 dark:border-sumi-800'
            }`}
          >
            <Calendar size={16} />
            <span>{day.dayTitle}</span>
          </button>
        ))}

        {/* Diagnostic Exam Tab */}
        <button
          onClick={() => {
            setExamActive(true);
            playSfx('click');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            examActive
              ? 'bg-amber-500 text-sumi-950 font-black shadow-md -translate-y-0.5'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <GraduationCap size={18} />
          <span>📝 Slutprov & Diplom</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* DAILY VIEW (When NOT in Exam Mode) */}
      {/* ========================================== */}
      {!examActive && (
        <div className="space-y-6">
          {/* Day Overview Banner */}
          <div className="bg-paper-100 dark:bg-sumi-900 p-6 rounded-3xl border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-gold uppercase tracking-wider">
                {currentDay.subtitle} • {currentDay.estimatedHours}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {currentDay.dayTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                {currentDay.focusText}
              </p>
            </div>

            {/* Daily Pro Tip */}
            <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl max-w-sm text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Lightbulb size={18} className="shrink-0 text-amber-500 mt-0.5" />
              <div>
                <strong className="font-bold">Lärartips:</strong> {currentDay.dailyProTip}
              </div>
            </div>
          </div>

          {/* Time Blocks Grid */}
          <div className="grid grid-cols-1 gap-6">
            {currentDay.blocks.map((block) => (
              <div
                key={block.id}
                className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-5"
              >
                {/* Block Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-sumi-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                      {block.timeLabel} ({block.duration})
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {block.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {block.description}
                </p>

                {/* Kana Pills with Quick Voice Synthesis */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tecken i detta pass (Klicka för att höra uttal):
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {block.kanaList.map((k, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          speakJapanese(k, { rate: 1.0 });
                          playSfx('click');
                        }}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800 hover:border-brand-bronze hover:scale-105 transition-all text-slate-900 dark:text-white"
                      >
                        <span className="font-jp text-lg font-black">{k}</span>
                        <AudioButton text={k} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Memory Tricks Box (Styled like lined notebook note) */}
                <div className="bg-paper-50 dark:bg-sumi-950 p-4 rounded-2xl border border-paper-300 dark:border-sumi-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    <Sparkles size={14} className="text-amber-500" />
                    Svenska Minnesbilder för detta pass:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {block.keyMnemonicTips.map((tip, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Tasks & Checkboxes */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Checklista för passet:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {block.tasks.map((task) => {
                      const isDone = !!completedTasks[task.id];
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                            isDone
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through'
                              : 'bg-slate-50 dark:bg-sumi-950 border-slate-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="font-semibold">{task.text}</span>
                          </div>

                          {/* Action Link Icons */}
                          {task.actionType === 'game' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate('game');
                                playSfx('click');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-400 text-sumi-950 font-bold text-[11px] flex items-center gap-1 hover:opacity-90"
                            >
                              <Gamepad2 size={12} /> Kör Tåget
                            </button>
                          )}
                          {task.actionType === 'srs' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate('srs');
                                playSfx('click');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-brand-600 text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-[11px] flex items-center gap-1 hover:opacity-90"
                            >
                              <BrainCircuit size={12} /> Minneskort
                            </button>
                          )}
                          {task.actionType === 'chart' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate('chart');
                                playSfx('click');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-sumi-800 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 hover:opacity-90"
                            >
                              <Grid3X3 size={12} /> 50-Tabell
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DIAGNOSTIC FINAL EXAM VIEW (Dag 3 Avslutning) */}
      {/* ========================================== */}
      {examActive && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-9 border border-slate-200 dark:border-sumi-800 shadow-xl space-y-6 animate-fadeIn">
          {!examFinished ? (
            <div className="max-w-md mx-auto space-y-6 text-center">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Fråga {examIndex + 1} av {DIAGNOSTIC_EXAM_ITEMS.length}</span>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                  {DIAGNOSTIC_EXAM_ITEMS[examIndex].row}
                </span>
                <span className="text-emerald-500 font-mono font-bold">{examScore} rätt</span>
              </div>

              {/* Target Character Card */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-8 rounded-3xl border border-slate-200 dark:border-sumi-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">Vad är uttalet?</span>
                <div className="text-8xl font-jp font-black text-slate-900 dark:text-white my-2">
                  {DIAGNOSTIC_EXAM_ITEMS[examIndex].kana}
                </div>
                <div className="flex justify-center">
                  <AudioButton text={DIAGNOSTIC_EXAM_ITEMS[examIndex].kana} size="md" showLabel label="Lyssna" variant="secondary" />
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3">
                {DIAGNOSTIC_EXAM_ITEMS[examIndex].options.map((opt, idx) => {
                  const isTarget = opt.toLowerCase() === DIAGNOSTIC_EXAM_ITEMS[examIndex].romaji.toLowerCase();
                  const isChosen = examChosenOption === opt;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleExamAnswer(opt)}
                      className={`py-4 px-3 rounded-2xl border-2 font-mono text-xl font-bold uppercase transition-all ${
                        examChosenOption === null
                          ? 'border-slate-200 dark:border-sumi-700 bg-slate-50 dark:bg-sumi-950 hover:border-brand-bronze text-slate-800 dark:text-slate-200'
                          : isTarget
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : isChosen
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          : 'border-slate-200 dark:border-sumi-800 opacity-40 bg-slate-50 dark:bg-sumi-950 text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {examChosenOption !== null && (
                <button
                  onClick={nextExamQuestion}
                  className="w-full py-3.5 rounded-2xl bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-sm shadow-md"
                >
                  Nästa fråga →
                </button>
              )}
            </div>
          ) : (
            /* EXAM RESULT & DIPLOMA */
            <div className="text-center py-6 space-y-6 max-w-lg mx-auto animate-fadeIn">
              <div className="w-20 h-20 bg-amber-400/20 text-amber-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md animate-bounce-short">
                🎓
              </div>

              <div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Bootcamp Slutfört!
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                  Diagnostiskt Slutprov Klart! 🎉
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Du fick <strong className="text-emerald-600 dark:text-emerald-400 text-lg font-mono">{examScore}</strong> av {DIAGNOSTIC_EXAM_ITEMS.length} rätt!
                </p>
              </div>

              {/* Diagnostic Feedback */}
              {wrongRows.length > 0 ? (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl text-left text-xs space-y-1 text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <HelpCircle size={15} /> Diagnostisk analys:
                  </div>
                  <p>
                    Bra kämpat! Du rekommenderas att göra en extra snabbrepetition av följande rader: <strong>{wrongRows.join(', ')}</strong>.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs">
                  🏆 <strong>Perfekt resultat!</strong> Du behärskar alla grundläggande tecken och är 100% redo för vidare japanskastudier!
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={startExam}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200"
                >
                  Gör provet igen
                </button>
                <button
                  onClick={() => handleNavigate('game')}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-extrabold text-xs shadow-md"
                >
                  Kör Shinkansen Rush 🚄
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
