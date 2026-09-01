import React from 'react';
import { Sparkles, Heart, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-sumi-900 border-t border-slate-200 dark:border-sumi-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 dark:bg-brand-bronze text-white dark:text-sumi-950 flex items-center justify-center font-bold text-xs">
            あ
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Hiragana Mästare</span> — Interaktiv självstudieapp för nybörjare i japanska.
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" />
            Spaced Repetition & Mnemoteknik
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <BookOpen size={13} className="text-brand-500 dark:text-brand-bronze" />
            Genki I (3rd Edition)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-sakura-500">
            <Heart size={13} className="fill-sakura-500" />
            Gjord för att göra japanska roligt!
          </span>
        </div>
      </div>
    </footer>
  );
};
