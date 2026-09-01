/**
 * Audio Utility Facade (Backward Compatibility Bridge)
 * 
 * Delegates to the central WebAudioSpeechAdapter in `src/modules/audio`.
 * Ensures seamless backward compatibility for existing game loops, exercises, and UI components.
 */

import { webAudioSpeechAdapter, type SfxOptions } from '../modules/audio';

class SoundEffectsController {
  public setSoundEnabled(enabled: boolean): void {
    webAudioSpeechAdapter.updateSettings({ soundEnabled: enabled });
  }

  public isSoundEnabled(): boolean {
    return webAudioSpeechAdapter.getSettings().soundEnabled;
  }

  public playClick(): void {
    webAudioSpeechAdapter.playSfx('click');
  }

  public playCatch(combo: number = 1): void {
    webAudioSpeechAdapter.playSfx('catch', { combo });
  }

  public playCorrect(combo: number = 1): void {
    webAudioSpeechAdapter.playSfx('correct', { combo });
  }

  public playMiss(): void {
    webAudioSpeechAdapter.playSfx('miss');
  }

  public playWrong(): void {
    webAudioSpeechAdapter.playSfx('wrong');
  }

  public playLevelUp(): void {
    webAudioSpeechAdapter.playSfx('levelUp');
  }

  public playGameOver(): void {
    webAudioSpeechAdapter.playSfx('gameOver');
  }

  public playTrainChime(): void {
    webAudioSpeechAdapter.playSfx('trainChime');
  }

  public playTrainWhistle(): void {
    webAudioSpeechAdapter.playSfx('trainWhistle');
  }

  public playDoorChime(): void {
    webAudioSpeechAdapter.playSfx('doorChime');
  }

  public playDoorPneumatic(): void {
    webAudioSpeechAdapter.playSfx('doorPneumatic');
  }

  public playSwordSlash(): void {
    webAudioSpeechAdapter.playSfx('swordSlash');
  }

  public playMagicCast(): void {
    webAudioSpeechAdapter.playSfx('magicCast');
  }

  public playMonsterHit(): void {
    webAudioSpeechAdapter.playSfx('monsterHit');
  }

  public playCoin(): void {
    webAudioSpeechAdapter.playSfx('coin');
  }

  public playHeal(): void {
    webAudioSpeechAdapter.playSfx('heal');
  }

  public playEffect(effectName: string, options?: SfxOptions): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webAudioSpeechAdapter.playSfx(effectName as any, options);
  }
}

export const sfx = new SoundEffectsController();

/**
 * Pronounce Japanese text using native browser SpeechSynthesis (ja-JP)
 */
export function playJapaneseSpeech(text: string, rate: number = 0.9): Promise<void> {
  return webAudioSpeechAdapter.speakJapanese(text, { rate });
}
