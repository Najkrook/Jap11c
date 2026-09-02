import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Ring */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 animate-ping opacity-75 absolute" />
        
        {/* Stationery Box with Kana */}
        <div className="w-16 h-16 rounded-2xl bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 flex items-center justify-center font-bold text-2xl shadow-md relative z-10 border border-amber-400/40 animate-pulse">
          あ
        </div>
      </div>
      
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Laddar vy...
      </p>
    </div>
  );
};
