import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Crown, 
  ArrowRight
} from 'lucide-react';
import { ShinkansenRush } from './ShinkansenRush';
import { useProgression } from '../../context/ProgressionContext';
import { useAudio } from '../../modules/audio';

export type ArcadeGameId = 'hub' | 'shinkansen-rush';

interface GameArcadeProps {}

interface GameCardConfig {
  id: ArcadeGameId;
  title: string;
  jpTitle: string;
  badgeText: string;
  badgeColor: string;
  description: string;
  genre: string;
  icon: string;
  highScoreKey: 'shinkansenRush';
  tags: string[];
  gradient: string;
  borderHover: string;
}

const ARCADE_GAMES: GameCardConfig[] = [
  {
    id: 'shinkansen-rush',
    title: 'Shinkansen Station Rush',
    jpTitle: '新幹線ラッシュ',
    badgeText: 'FAVORIT',
    badgeColor: 'bg-emerald-500 text-white',
    description: 'Bli stationschef i Tokyo! Matcha avgångsbiljetter till rätt Shinkansen-vagn innan tåget avgår. Träna snabb visuell avkodning och särskilj kluriga tvillingtecken.',
    genre: 'Reflex & Sortering',
    icon: '🚄',
    highScoreKey: 'shinkansenRush',
    tags: ['Tidsrush', '5 Stationer', 'Eki-Melodier', 'Touch/Tangentbord'],
    gradient: 'from-blue-600/20 via-cyan-500/10 to-transparent',
    borderHover: 'hover:border-cyan-400'
  }
];

export const GameArcade: React.FC<GameArcadeProps> = () => {
  const { playSfx } = useAudio();
  const { stats } = useProgression();
  const userStats = stats;
  const [activeGame, setActiveGame] = useState<ArcadeGameId>('hub');

  const handleSelectGame = (gameId: ArcadeGameId) => {
    playSfx('click');
    setActiveGame(gameId);
  };

  const handleBackToArcade = () => {
    playSfx('click');
    setActiveGame('hub');
  };

  if (activeGame === 'shinkansen-rush') {
    return (
      <div className="space-y-4">
        <ShinkansenRush
          onBackToArcade={handleBackToArcade}
        />
      </div>
    );
  }

  const totalArcadeScore = userStats.highScores.shinkansenRush || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* ARCADE HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sumi-900 via-slate-900 to-sumi-950 border border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-xs font-black tracking-widest uppercase">
              <Sparkles size={13} />
              <span>ゲームセンター • JAPANESE GAME ARCADE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Kana Spelarkad</span>
              <span className="text-2xl opacity-60 font-jp font-normal">ゲーム</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Träna dina Hiragana-reflexer, avkoda kana i realtid och utmana dina kunskaper genom interaktiva arkadspel.
            </p>
          </div>

          {/* Player Arcade Status Badge */}
          <div className="bg-sumi-950/80 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-5 backdrop-blur-sm self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Arkadpoäng
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {totalArcadeScore.toLocaleString()} <span className="text-xs text-slate-400">p</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Crown size={12} className="text-brand-gold" />
                <span>Nivå {userStats.level} • {userStats.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GAME CABINETS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 size={20} className="text-brand-gold" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Välj Spelautomat
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            1 Spelläge Tillgängligt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARCADE_GAMES.map((game) => {
            const currentHigh = userStats.highScores[game.highScoreKey] || 0;
            return (
              <div
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer ${game.borderHover}`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-linear-to-b ${game.gradient} opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-sumi-800 border border-slate-200 dark:border-sumi-700 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${game.badgeColor}`}>
                        {game.badgeText}
                      </span>
                      <span className="font-jp text-xs text-slate-400 font-bold opacity-75">
                        {game.jpTitle}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                      {game.genre}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                      {game.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-sumi-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-5 mt-4 border-t border-slate-100 dark:border-sumi-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Ditt Rekord</div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-amber-400">
                      {currentHigh > 0 ? `${currentHigh.toLocaleString()} p` : '–'}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectGame(game.id);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs group-hover:bg-amber-400 group-hover:text-sumi-950 transition-all shadow-sm"
                  >
                    <span>Spela</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
