/**
 * Web Audio API Sound Effects Synthesizer Engine
 * 
 * Synthesizes pure procedural sound effects for games, UI interactions, and feedback
 * without requiring any external audio assets.
 */

import type { SfxEffect, SfxOptions } from '../types';

export class SfxEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private masterVolume: number = 1.0;

  constructor(soundEnabled: boolean = true, masterVolume: number = 1.0) {
    this.soundEnabled = soundEnabled;
    this.masterVolume = masterVolume;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Lazy initializes the browser AudioContext upon user interaction.
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          return null;
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Plays a synthesized sound effect by name.
   */
  public play(effect: SfxEffect, options: SfxOptions = {}): void {
    if (!this.soundEnabled || this.masterVolume <= 0) return;

    switch (effect) {
      case 'click':
        this.playClick(options);
        break;
      case 'correct':
      case 'catch':
        this.playCatch(options);
        break;
      case 'wrong':
      case 'miss':
        this.playMiss(options);
        break;
      case 'levelUp':
        this.playLevelUp(options);
        break;
      case 'gameOver':
        this.playGameOver(options);
        break;
      case 'trainChime':
        this.playTrainChime(options);
        break;
      case 'trainWhistle':
        this.playTrainWhistle(options);
        break;
      case 'doorChime':
        this.playDoorChime(options);
        break;
      case 'doorPneumatic':
        this.playDoorPneumatic(options);
        break;
      case 'swordSlash':
        this.playSwordSlash(options);
        break;
      case 'magicCast':
        this.playMagicCast(options);
        break;
      case 'monsterHit':
        this.playMonsterHit(options);
        break;
      case 'coin':
        this.playCoin(options);
        break;
      case 'heal':
        this.playHeal(options);
        break;
    }
  }

  // --- INDIVIDUAL PROCEDURAL SYNTHESIZERS ---

  public playClick(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio synthesis errors in unsupported contexts
    }
  }

  public playCatch(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const combo = options.combo ?? 1;
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const baseFreq = 440;
      const multiplier = 1 + Math.min(combo * 0.08, 1.2);
      const freq1 = baseFreq * multiplier;
      const freq2 = freq1 * 1.5;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc.frequency.setValueAtTime(freq2, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Ignore
    }
  }

  public playMiss(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.25 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  public playLevelUp(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + idx * 0.09 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  public playGameOver(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const notes = [440, 415.3, 392, 349.23];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

        gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + idx * 0.15 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  public playTrainChime(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      // Japanese Eki-melody inspired chime (G4, C5, D5, G5, E5, D5)
      const notes = [392.00, 523.25, 587.33, 783.99, 659.25, 587.33];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.18 * vol, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.005 * vol, ctx.currentTime + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  public playTrainWhistle(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const chords = [440, 554.37]; // A4 + C#5
      chords.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.12 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005 * vol, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  public playDoorChime(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const chimes = [587.33, 440.00, 587.33, 440.00];
      chimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

        gain.gain.setValueAtTime(0.16 * vol, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.005 * vol, ctx.currentTime + idx * 0.15 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.12);
      });
    } catch {
      // Ignore
    }
  }

  public playDoorPneumatic(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005 * vol, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  public playSwordSlash(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  public playMagicCast(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  public playMonsterHit(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.25 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  public playCoin(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6

      gain.gain.setValueAtTime(0.15 * vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Ignore
    }
  }

  public playHeal(options: SfxOptions = {}): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const vol = (options.volume ?? 1.0) * this.masterVolume;
      const notes = [329.63, 440, 554.37, 659.25]; // E4, A4, C#5, E5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.15 * vol, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.2);
      });
    } catch {
      // Ignore
    }
  }
}
