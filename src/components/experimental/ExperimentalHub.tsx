/**
 * ============================================================================
 * OBS / KOMMENTAR: Denna sida (Experimentellt / ExperimentalHub) är dold från
 * appens navigering och ska förbli osynlig enligt användarens önskemål (behövs inte i nuläget).
 * ============================================================================
 */

import React, { useState } from 'react';
import { 
  FlaskConical, 
  Zap, 
  PenTool, 
  Search
} from 'lucide-react';
import { GairaigoDecoder } from './GairaigoDecoder';
import { TwinTrainer } from './TwinTrainer';
import { StrokeSandbox } from './StrokeSandbox';
import { useAudio } from '../../modules/audio';

type ExperimentalTool = 'decoder' | 'twins' | 'stroke';

export const ExperimentalHub: React.FC = () => {
  const { playSfx } = useAudio();
  const [activeTool, setActiveTool] = useState<ExperimentalTool>('decoder');

  const tools = [
    {
      id: 'decoder' as ExperimentalTool,
      label: 'Gairaigo Decoder 🕵️‍♂️',
      icon: Search,
      badge: 'Låneord & Spel',
      description: 'Knäck autentiska japanska låneord med ledtrådar och etymologi.'
    },
    {
      id: 'twins' as ExperimentalTool,
      label: 'Tvillingtränaren ⚡',
      icon: Zap,
      badge: 'シ/ツ & ソ/ン',
      description: 'Mästra skillnaden mellan Katakanas mest förvirrande tvillingtecken.'
    },
    {
      id: 'stroke' as ExperimentalTool,
      label: 'Stroke Sandbox ✍️',
      icon: PenTool,
      badge: 'Handskrift & AI',
      description: 'Rita valfritt tecken på tavlan och få direkt feedback på din precision.'
    }
  ];

  return (
    <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-ink-navy via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-[180px] font-jp font-bold pointer-events-none select-none">
          実
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20">
            <FlaskConical size={15} /> Experimentella Labbet
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Experimentellt & Innovativt 🧪
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
            Här hittar du våra mest interaktiva specialverktyg för att knäcka låneord, bemästra tvillingtecken och utvärdera din handskrift!
          </p>
        </div>
      </div>

      {/* Experimental Tool Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                playSfx('click');
              }}
              className={`p-5 rounded-3xl border-2 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-sumi-900 border-amber-400 dark:border-amber-500 shadow-lg scale-102'
                  : 'bg-white dark:bg-sumi-900 border-slate-200 dark:border-sumi-800 hover:border-slate-300 dark:hover:border-sumi-700 shadow-xs opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                    isActive ? 'bg-amber-400 text-sumi-950 shadow-sm' : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-sumi-800 text-slate-500 dark:text-slate-400">
                    {t.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.description}
                </p>
              </div>

              {isActive && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-sumi-800 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>Aktivt verktyg</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Active Experimental Tool Render */}
      <div className="pt-2">
        {activeTool === 'decoder' && <GairaigoDecoder />}
        {activeTool === 'twins' && <TwinTrainer />}
        {activeTool === 'stroke' && <StrokeSandbox />}
      </div>
    </div>
  );
};
