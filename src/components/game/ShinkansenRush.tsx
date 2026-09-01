import React, { useState, useEffect, useRef, useTransition } from 'react';
import { 
  Heart, 
  Trophy, 
  Flame, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Train, 
  MapPin, 
  Compass, 
  Lightbulb, 
  Users,
  ArrowUpRight
} from 'lucide-react';
import { 
  ShinkansenEngine, 
  SHINKANSEN_STATIONS,
  type GameMode,
  type ShinkansenState,
  type GameEvent
} from '../../modules/shinkansen';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/ProgressionContext';
import { fireSuperCelebration } from '../common/Confetti';

export interface ShinkansenRushProps {
  onBackToArcade?: () => void;
}

export const ShinkansenRush: React.FC<ShinkansenRushProps> = ({
  onBackToArcade
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const { stats, recordActivity } = useProgression();
  const userStats = stats;

  // Engine instance initialized once
  const engineRef = useRef<ShinkansenEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new ShinkansenEngine({ initialStationIndex: 0, mode: 'rush' });
  }
  const engine = engineRef.current;

  // React state reflecting engine state
  const [engineState, setEngineState] = useState<ShinkansenState>(() => engine.getState());
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [isTrainArriving, setIsTrainArriving] = useState<boolean>(false);

  // Sound and side-effect event handling
  useEffect(() => {
    const unsubscribeState = engine.subscribe((newState) => {
      setEngineState({ ...newState });
    });

    const unsubscribeEvents = engine.onEvent((event: GameEvent) => {
      switch (event.type) {
        case 'TASK_SPAWNED':
          setShowMnemonic(false);
          setIsTrainArriving(true);
          setTimeout(() => setIsTrainArriving(false), 450);
          break;

        case 'CORRECT_SELECTION':
          playSfx('catch', { combo: event.combo });
          playSfx('doorPneumatic');
          if (!isSoundMuted) {
            speakJapanese(event.correctKana);
          }
          if (event.isMilestoneCombo) {
            setTimeout(() => playSfx('trainWhistle'), 300);
          }
          break;

        case 'WRONG_SELECTION':
          playSfx('miss');
          playSfx('doorPneumatic');
          break;

        case 'TIMEOUT':
          playSfx('miss');
          playSfx('doorPneumatic');
          break;

        case 'DOOR_CLOSING_WARNING':
          if (!isSoundMuted) {
            playSfx('doorChime');
          }
          break;

        case 'STATION_CLEARED':
          playSfx('levelUp');
          playSfx('trainWhistle');
          fireSuperCelebration();
          recordActivity({
            type: 'game_finished',
            gameId: 'shinkansenRush',
            score: event.finalScore,
            maxCombo: event.maxCombo,
            details: {
              stationId: event.station.id
            }
          });
          break;

        case 'GAME_OVER':
          playSfx('gameOver');
          recordActivity({
            type: 'game_finished',
            gameId: 'shinkansenRush',
            score: event.score,
            maxCombo: event.maxCombo,
            details: {
              stationId: event.station.id
            }
          });
          break;
      }
    });

    return () => {
      unsubscribeState();
      unsubscribeEvents();
    };
  }, [engine, isSoundMuted, recordActivity, playSfx, speakJapanese]);

  // Tick loop
  useEffect(() => {
    if (engineState.status !== 'playing' || engineState.feedback !== null) {
      return;
    }

    let lastTick = performance.now();
    let animationFrameId: number;

    const tickLoop = (now: number) => {
      const delta = now - lastTick;
      lastTick = now;
      engine.tick(delta);

      if (engine.getState().status === 'playing' && engine.getState().feedback === null) {
        animationFrameId = requestAnimationFrame(tickLoop);
      }
    };

    animationFrameId = requestAnimationFrame(tickLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine, engineState.status, engineState.feedback]);

  // Handle post-feedback transitions (next passenger or station goal)
  useEffect(() => {
    if (engineState.status !== 'playing' || engineState.feedback === null) {
      return;
    }

    const isCorrect = engineState.feedback === 'correct';
    const isGoalReached = engine.isStationGoalReached();
    const delay = isCorrect ? 1200 : 1400;

    const timer = setTimeout(() => {
      if (isCorrect && isGoalReached) {
        engine.completeStation();
      } else {
        engine.nextPassenger();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [engine, engineState.status, engineState.feedback]);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (engineState.status !== 'playing') return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (['1', 'Digit1', 'Numpad1', 'a', 'A', 'ArrowLeft'].includes(e.key) || ['Digit1', 'Numpad1'].includes(e.code)) {
        e.preventDefault();
        engine.selectTrack(1);
      } else if (['2', 'Digit2', 'Numpad2', 's', 'S', 'ArrowDown', 'ArrowUp'].includes(e.key) || ['Digit2', 'Numpad2'].includes(e.code)) {
        e.preventDefault();
        engine.selectTrack(2);
      } else if (['3', 'Digit3', 'Numpad3', 'd', 'D', 'ArrowRight'].includes(e.key) || ['Digit3', 'Numpad3'].includes(e.code)) {
        e.preventDefault();
        engine.selectTrack(3);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (engineState.currentTask && !isSoundMuted) {
          speakJapanese(engineState.currentTask.correctKana);
        }
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowMnemonic(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, engineState.status, engineState.currentTask, isSoundMuted]);

  // ====================================================
  // SCREEN 1: STATION SELECT (ROUTE HUB)
  // ====================================================
  if (engineState.status === 'station_select') {
    const currentHigh = userStats.highScores.shinkansenRush || 0;

    return (
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
        {onBackToArcade && (
          <button
            onClick={onBackToArcade}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-sumi-900 border border-slate-200 dark:border-sumi-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-sumi-800 transition-all shadow-xs"
          >
            <ArrowLeft size={15} />
            <span>Tillbaka till Spelarkaden</span>
          </button>
        )}

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-slate-900 to-sumi-950 border-2 border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-black tracking-widest uppercase">
                <Train size={13} />
                <span>新幹線ステーションラッシュ • SHINKANSEN RUSH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>Shinkansen Station Rush</span>
                <span className="text-2xl font-jp opacity-60 font-normal">新幹線</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Kliv in i rollen som stationschef på Japans legendariska snabbtågsstationer. Matcha passagerarnas svenska minnesbilder och biljetter till rätt Shinkansen-vagn innan dörrarna stängs och tåget avgår!
              </p>
            </div>

            {/* Stats & Mode Switcher */}
            <div className="bg-sumi-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-3 shrink-0 self-start md:self-auto min-w-[220px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Ditt Rekord</span>
                <Trophy size={14} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {currentHigh > 0 ? `${currentHigh.toLocaleString()} p` : '0 p'}
              </div>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    playSfx('click');
                    engine.startStation(engineState.currentStationIndex, 'rush');
                    engine.returnToStationSelect();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black transition-all ${
                    engineState.mode === 'rush'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame size={14} />
                  <span>Rush (3 Liv)</span>
                </button>
                <button
                  onClick={() => {
                    playSfx('click');
                    engine.startStation(engineState.currentStationIndex, 'zen');
                    engine.returnToStationSelect();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black transition-all ${
                    engineState.mode === 'zen'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass size={14} />
                  <span>Zen (Övning)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Stations Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-brand-gold" />
              <span>Välj Startstation & Rutt</span>
            </h2>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              5 Progressiva Stationer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHINKANSEN_STATIONS.map((station, idx) => (
              <div
                key={station.id}
                onClick={() => {
                  playSfx('click');
                  playSfx('trainChime');
                  engine.startStation(idx, engineState.mode);
                }}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-5 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-linear-to-r ${station.themeGradient}`} />

                <div className="space-y-4 pt-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-sumi-800 border border-slate-200 dark:border-sumi-700 flex items-center justify-center font-black text-sm text-slate-800 dark:text-white group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        {station.id}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Station {station.id}
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{station.nameSv}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-jp text-lg font-black text-slate-700 dark:text-slate-200">
                        {station.nameKanji}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400">
                        {station.nameJp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${station.badgeBg}`}>
                      {station.trainCode}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {station.trainModel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {station.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sumi-800/80 border border-slate-200/70 dark:border-sumi-700/60">
                    <div className="text-[10px] font-bold text-brand-gold uppercase flex items-center gap-1">
                      <Sparkles size={11} />
                      <span>Inlärningsfokus</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                      {station.learningFocus}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-sumi-800 flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={13} />
                    <span>{station.baseTimeSeconds}s / avgång</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSfx('click');
                      playSfx('trainChime');
                      engine.startStation(idx, engineState.mode);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm"
                  >
                    <span>Starta</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // SCREEN 2: ACTIVE GAMEPLAY PLATFORM
  // ====================================================
  if (engineState.status === 'playing' && engineState.currentTask) {
    const task = engineState.currentTask;
    const station = engineState.currentStation;
    const timePercentage = Math.max(0, (engineState.timeRemainingMs / task.timeLimitMs) * 100);
    const isStressTime = timePercentage < 35;
    const isCriticalTime = timePercentage < 18;

    // Door ratio: 0 = fully closed, 1 = fully open
    const doorOpenRatio = engineState.feedback === 'correct' || engineState.feedback === 'timeout'
      ? 0
      : Math.max(0, Math.min(1, timePercentage / 100));

    return (
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4 animate-fadeIn select-none">
        {/* Top status bar */}
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-sumi-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-sm">
          <button
            onClick={() => {
              playSfx('click');
              engine.returnToStationSelect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-sumi-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Stationer</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-jp text-base font-black text-slate-900 dark:text-white px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-sumi-800 border border-slate-200 dark:border-sumi-700">
              {station.nameKanji}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              {station.nameRomaji}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase">
              St. {station.id}/5
            </span>
          </div>

          <div className="flex items-center gap-3">
            {engineState.combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-500 text-xs font-black animate-soft-pulse">
                <Flame size={14} className="text-amber-500" />
                <span>{engineState.combo}x</span>
              </div>
            )}

            {engineState.mode === 'rush' ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    size={18}
                    className={`transition-transform duration-300 ${
                      heartIndex <= engineState.lives
                        ? 'fill-rose-500 text-rose-500 scale-100'
                        : 'text-slate-300 dark:text-sumi-700 scale-75'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                <Compass size={14} />
                <span>Zen</span>
              </div>
            )}

            <div className="text-right pl-2 border-l border-slate-200 dark:border-sumi-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Poäng</div>
              <div className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-amber-400">
                {engineState.score.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Arena */}
        <div className="relative overflow-hidden rounded-3xl bg-sumi-950 border-2 border-slate-800 text-white shadow-2xl">
          {/* Overhead Sign */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-jp font-black text-cyan-300">{station.nameKanji}</span>
                <span className="text-[11px] text-slate-300">{station.nameRomaji}</span>
              </div>
              <span className="text-slate-500 hidden md:inline">➔</span>
              <div className="text-[11px] text-slate-400 hidden md:flex items-center gap-1">
                <span>Nästa:</span>
                <strong className="text-slate-300 font-jp">{station.nextStationKanji}</strong>
                <span>({station.nextStationRomaji})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                {station.line}
              </span>
              {engineState.mode === 'rush' && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-emerald-400 border border-slate-700">
                  {engineState.stationPassengersServed}/{station.passengersTarget} Ombord
                </span>
              )}
            </div>
          </div>

          {/* Passenger & Ticket Stage */}
          <div className="p-4 sm:p-6 bg-linear-to-b from-sumi-950 via-slate-900 to-sumi-950">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Passenger Avatar & Queue */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sumi-900 border-2 flex items-center justify-center text-4xl sm:text-5xl shadow-xl transition-all ${
                    engineState.feedback === 'correct' ? 'scale-110 border-emerald-400 ring-4 ring-emerald-400/30' :
                    engineState.feedback === 'wrong' || engineState.feedback === 'timeout' ? 'shake border-rose-500 ring-4 ring-rose-500/30' :
                    isStressTime ? 'animate-bounce border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-700'
                  }`}>
                    {task.persona.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 text-xl">
                    {engineState.feedback === 'correct' ? '😊' :
                     engineState.feedback === 'wrong' || engineState.feedback === 'timeout' ? '😭' :
                     isStressTime ? '😱' : '🎫'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-100">{task.persona.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
                      {task.persona.titleSv}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic max-w-xs leading-snug">
                    "{isStressTime ? task.persona.stressQuote : task.persona.happyQuote}"
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Users size={11} /> Kö:
                    </span>
                    <div className="flex items-center -space-x-1">
                      {engineState.upcomingQueue.map((p, i) => (
                        <span
                          key={p.id + i}
                          title={`${p.name} (${p.titleSv})`}
                          className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm opacity-80 hover:opacity-100 transition-opacity"
                        >
                          {p.avatar}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Boarding Ticket Card */}
              <div className="bg-sumi-900/95 border-2 border-amber-400/50 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-w-[260px] sm:min-w-[300px] text-center shadow-2xl relative">
                <div className="text-[10px] font-black text-amber-400 tracking-widest uppercase flex items-center gap-1.5 mb-1">
                  <span>BILJETT • 指定席</span>
                  <span className="text-sm">{task.persona.avatar}</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-wider text-shadow-glow">
                  {task.ticketDisplay}
                </div>

                {task.ticketMeaningSv && (
                  <div className="text-xs font-bold text-amber-300 mt-1 max-w-[250px] truncate bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                    {task.ticketMeaningSv}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800 w-full justify-center">
                  <button
                    onClick={() => speakJapanese(task.correctKana)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sumi-800 hover:bg-sumi-700 text-xs font-bold text-cyan-300 transition-colors cursor-pointer"
                    title="Lyssna på uttalet (Mellanslag)"
                  >
                    <Volume2 size={14} />
                    <span>Lyssna</span>
                  </button>

                  {task.characterInfo?.mnemonic && (
                    <button
                      onClick={() => setShowMnemonic(prev => !prev)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sumi-800 hover:bg-sumi-700 text-xs font-bold text-brand-gold transition-colors cursor-pointer"
                      title="Visa ledtråd (H)"
                    >
                      <Lightbulb size={14} />
                      <span>Ledtråd</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mnemonic Hint */}
            {showMnemonic && task.characterInfo?.mnemonic && (
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs flex items-start gap-2.5 mt-4 animate-fadeIn">
                <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Minnesregel: </strong>
                  <span>{task.characterInfo.mnemonic.storySv}</span>
                </div>
              </div>
            )}

            {/* Departure Countdown Timer Bar */}
            <div className="space-y-1.5 pt-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={`font-black flex items-center gap-1.5 ${
                  isCriticalTime ? 'text-rose-400 animate-pulse' :
                  isStressTime ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  <Clock size={13} />
                  <span>
                    {isCriticalTime ? 'DÖRRARNA STÄNGS NU!' :
                     isStressTime ? 'DÖRRARNA STÄNGS SNART!' : 'Avgångstimer (Avgår vid 0s)'}
                  </span>
                </span>
                <span className="font-bold text-slate-300">
                  {(engineState.timeRemainingMs / 1000).toFixed(1)}s
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-75 ease-linear ${
                    isCriticalTime ? 'bg-rose-500 animate-pulse shadow-rose-500/50 shadow-md' :
                    isStressTime ? 'bg-amber-400 shadow-amber-400/50 shadow-md' : 'bg-cyan-400 shadow-cyan-400/50 shadow-md'
                  }`}
                  style={{ width: `${timePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Tracks Grid */}
          <div className="bg-slate-900 border-t-2 border-slate-800 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Train size={16} className="text-cyan-400" />
                <span>Välj Rätt Shinkansen-Vagn att Gå Ombord:</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Snabbtangenter: [1] [2] [3] eller [A] [S] [D]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {task.tracks.map((track) => {
                const isChosen = engineState.selectedTrack === track.trackNumber;
                const isDeparting = engineState.departingTrack === track.trackNumber;

                let coachBorderColor = 'border-slate-700 hover:border-cyan-400';
                if (engineState.feedback !== null) {
                  if (track.isCorrect) {
                    coachBorderColor = 'border-emerald-400 ring-4 ring-emerald-400/30';
                  } else if (isChosen && !track.isCorrect) {
                    coachBorderColor = 'border-rose-500 ring-4 ring-rose-500/30';
                  }
                }

                const doorLedColor = isCriticalTime || engineState.feedback === 'timeout'
                  ? 'bg-rose-500 animate-ping'
                  : isStressTime
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400';

                return (
                  <div
                    key={track.trackNumber}
                    onClick={() => engine.selectTrack(track.trackNumber)}
                    className={`group relative flex flex-col justify-between rounded-3xl bg-sumi-950 border-2 p-3 sm:p-4 text-left transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-98 ${coachBorderColor} ${
                      isDeparting ? 'animate-slideOutRight' : isTrainArriving ? 'animate-slideInLeft' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                          {track.trackNumber}
                        </span>
                        <span className="text-xs font-black text-slate-200">
                          {track.trackNumber}番線 (Spår {track.trackNumber})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono">
                        <span className={`w-2 h-2 rounded-full ${doorLedColor}`} />
                        <span className="text-slate-400">
                          {doorOpenRatio === 0 ? 'STÄNGD' : isStressTime ? 'STÄNGS' : 'ÖPPEN'}
                        </span>
                      </div>
                    </div>

                    {/* Shinkansen Coach */}
                    <div className="my-3 rounded-2xl bg-linear-to-b from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-sumi-900 dark:to-slate-950 border-2 border-slate-600 dark:border-slate-700 relative overflow-hidden shadow-inner">
                      <div className={`h-2 bg-linear-to-r ${station.liveryColor}`} />

                      <div className="flex items-center justify-between px-3 pt-2 text-[10px] font-mono">
                        <span className="bg-sumi-950 text-cyan-400 px-1.5 py-0.5 rounded font-bold border border-slate-800">
                          CAR 0{track.trackNumber}
                        </span>
                        <span className="text-slate-400 font-jp">
                          {station.trainName}
                        </span>
                      </div>

                      {/* Cabin Interior & Sliding Doors */}
                      <div className="relative mx-3 my-2.5 h-28 rounded-xl bg-amber-50 dark:bg-amber-950/60 border-2 border-slate-400 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none text-slate-600 dark:text-amber-200">
                          <span className="text-2xl">💺</span>
                          <span className="text-2xl">💺</span>
                        </div>

                        {/* Character Display */}
                        <div className="relative z-10 font-jp text-4xl sm:text-5xl font-black text-slate-950 dark:text-amber-300 drop-shadow-md transition-transform group-hover:scale-110">
                          {track.kana}
                        </div>

                        {/* Sliding Door Left */}
                        <div
                          className="absolute top-0 bottom-0 left-0 w-1/2 bg-linear-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-r-2 border-slate-900 dark:border-slate-950 flex items-center justify-end pr-1 z-20 shadow-md transition-transform duration-75 ease-linear"
                          style={{
                            transform: `translateX(-${doorOpenRatio * 100}%)`
                          }}
                        >
                          <div className="w-5 h-16 rounded-md bg-cyan-900/60 border border-cyan-400/40 opacity-80" />
                          <div className="w-1 h-full bg-slate-900/80 ml-1" />
                        </div>

                        {/* Sliding Door Right */}
                        <div
                          className="absolute top-0 bottom-0 right-0 w-1/2 bg-linear-to-l from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-l-2 border-slate-900 dark:border-slate-950 flex items-center justify-start pl-1 z-20 shadow-md transition-transform duration-75 ease-linear"
                          style={{
                            transform: `translateX(${doorOpenRatio * 100}%)`
                          }}
                        >
                          <div className="w-1 h-full bg-slate-900/80 mr-1" />
                          <div className="w-5 h-16 rounded-md bg-cyan-900/60 border border-cyan-400/40 opacity-80" />
                        </div>
                      </div>

                      <div className="px-3 pb-1.5 flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>SHINKANSEN</span>
                        <span className="font-bold text-slate-500">JR-EAST/WEST</span>
                      </div>
                    </div>

                    {/* Floor & Action Row */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <div className="h-2 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-around px-2 overflow-hidden shadow-xs">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(dot => (
                          <span key={dot} className="w-1 h-1 rounded-full bg-amber-600/90 shrink-0" />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-extrabold text-slate-300 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                          <span>Gå ombord</span>
                          <ArrowUpRight size={13} />
                        </span>

                        {engineState.feedback !== null && track.isCorrect && (
                          <span className="font-black text-emerald-400 flex items-center gap-1 text-xs animate-bounce">
                            <CheckCircle2 size={14} /> Rätt Vagn!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSoundMuted(prev => !prev)}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSoundMuted ? 'Ljud av' : 'Ljud på'}</span>
            </button>
          </div>

          <div className="font-mono text-[11px]">
            Totalt expedierade resenärer: <strong className="text-slate-900 dark:text-white">{engineState.passengersServed}</strong>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // SCREEN 3: STATION CLEARED
  // ====================================================
  if (engineState.status === 'station_cleared') {
    const station = engineState.currentStation;
    const isFinalStation = engineState.currentStationIndex === SHINKANSEN_STATIONS.length - 1;

    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-400/15 border-2 border-emerald-400/30 text-emerald-500 flex items-center justify-center text-4xl mx-auto animate-bounce">
            🚄
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-black uppercase">
              <CheckCircle2 size={13} />
              <span>STATION AVKLARAD!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {station.nameSv} {station.nameKanji}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alla passagerare har framgångsrikt kommit ombord på {station.trainName}!
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Poäng</div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-amber-400">
                {engineState.score.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Max Combo</div>
              <div className="text-lg font-black font-mono text-amber-500">
                {engineState.maxCombo}x
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Intjänad XP</div>
              <div className="text-lg font-black font-mono text-emerald-500">
                +{engineState.sessionXpEarned} XP
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => {
                playSfx('click');
                engine.returnToStationSelect();
              }}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Välj Station</span>
            </button>

            <button
              onClick={() => {
                playSfx('click');
                playSfx('trainChime');
                engine.startStation(engineState.currentStationIndex, engineState.mode);
              }}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Spela Igen
            </button>

            <button
              onClick={() => {
                playSfx('click');
                playSfx('trainChime');
                engine.advanceStation();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
            >
              <span>{isFinalStation ? 'Tillbaka till Start' : 'Nästa Station'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // SCREEN 4: GAME OVER
  // ====================================================
  if (engineState.status === 'gameover') {
    const station = engineState.currentStation;

    return (
      <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn">
        <div className="rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 flex items-center justify-center text-3xl mx-auto">
            🛑
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Tåget har avgått!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Du fick slut på liv i {station.nameSv}. Repetera tecknen och försök igen!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Slutpoäng</div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-amber-400">
                {engineState.score.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Resenärer</div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {engineState.passengersServed}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                playSfx('click');
                engine.returnToStationSelect();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              Välj Station
            </button>
            <button
              onClick={() => {
                playSfx('click');
                playSfx('trainChime');
                engine.startStation(engineState.currentStationIndex, engineState.mode);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              Försök Igen 🚄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
