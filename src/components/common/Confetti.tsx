import confetti from 'canvas-confetti';

export function fireConfetti(options?: confetti.Options) {
  try {
    const defaults: confetti.Options = {
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#C0A375', '#002B49', '#F43F5E', '#5C8D4E', '#D8B84E']
    };
    confetti({ ...defaults, ...options });
  } catch (e) {
    console.warn('Confetti error', e);
  }
}

export function fireSuperCelebration() {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C0A375', '#F43F5E', '#D8B84E', '#002B49']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C0A375', '#F43F5E', '#D8B84E', '#002B49']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    console.warn('Super confetti error', e);
  }
}
