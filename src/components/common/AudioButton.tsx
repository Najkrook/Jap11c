import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../modules/audio';

interface AudioButtonProps {
  text: string;
  rate?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  rate = 0.9,
  size = 'md',
  className = '',
  showLabel = false,
  label = 'Lyssna',
  variant = 'ghost'
}) => {
  const { playSfx, speakJapanese, soundEnabled } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying || !soundEnabled) return;
    setIsPlaying(true);
    playSfx('click');
    try {
      await speakJapanese(text, { rate });
    } finally {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-2.5 py-1.5 text-xs',
    lg: 'px-3.5 py-2 text-sm'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const variantClasses = {
    ghost: 'text-slate-600 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white hover:bg-paper-200 dark:hover:bg-sumi-800 rounded-lg',
    secondary: 'bg-paper-100 dark:bg-sumi-800 text-ink-800 dark:text-slate-200 hover:bg-paper-200 dark:hover:bg-sumi-700 rounded-xl border border-paper-300 dark:border-sumi-700 font-semibold shadow-2xs',
    primary: 'bg-ink-navy text-white hover:bg-brand-600 dark:bg-brand-bronze dark:text-sumi-950 rounded-xl shadow-xs font-semibold'
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label={soundEnabled ? (showLabel ? label : `Lyssna på uttal: ${text}`) : 'Ljudet är avstängt'}
      title={soundEnabled ? `Lyssna på uttal: ${text}` : 'Ljudet är avstängt (aktivera i toppmenyn)'}
      className={`inline-flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 focus:outline-none ${sizeClasses[size]} ${variantClasses[variant]} ${isPlaying ? 'ring-2 ring-amber-400 scale-105' : ''} ${!soundEnabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {isPlaying ? (
        <VolumeX size={iconSizes[size]} className="animate-pulse text-amber-500 shrink-0" />
      ) : (
        <Volume2 size={iconSizes[size]} className="transition-transform group-hover:scale-110 shrink-0" />
      )}
      {showLabel && <span className="font-medium whitespace-nowrap">{isPlaying ? 'Spelar...' : label}</span>}
    </button>
  );
};
