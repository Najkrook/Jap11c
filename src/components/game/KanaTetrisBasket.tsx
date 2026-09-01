import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  Trophy, 
  Flame, 
  RotateCcw, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  ArrowDown, 
  Sparkles, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  ShieldCheck,
  Compass,
  Layers,
  Sliders,
  ChevronRight,
  Box
} from 'lucide-react';
import type { UserStats } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { sfx, playJapaneseSpeech } from '../../utils/audio';
import { useProgression } from '../../context/ProgressionContext';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';
import { AudioButton } from '../common/AudioButton';

interface KanaTetrisBasketProps {
  onBackToArcade?: () => void;
}

interface BasketInfo {
  romaji: string;
  kana: string;
  id: string;
}

interface LevelConfig {
  levelNumber: number;
  rowName: string;
  title: string;
  description: string;
  kanaIds: string[];
  baskets: BasketInfo[];
  targetScore: number;
}

// 13 Pedagogiska nivåer med fack/korgar
const BASKET_LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    rowName: 'A-raden',
    title: 'Nivå 1: Vokal-Korgarna (A, I, U, E, O)',
    description: 'De 5 grundvokalerna. Fånga varje fallande vokalblock i dess matchande korg!',
    kanaIds: ['a', 'i', 'u', 'e', 'o'],
    baskets: [
      { romaji: 'a', kana: 'あ', id: 'a' },
      { romaji: 'i', kana: 'い', id: 'i' },
      { romaji: 'u', kana: 'う', id: 'u' },
      { romaji: 'e', kana: 'え', id: 'e' },
      { romaji: 'o', kana: 'お', id: 'o' }
    ],
    targetScore: 500
  },
  {
    levelNumber: 2,
    rowName: 'K-raden',
    title: 'Nivå 2: Ka-Korgarna (Ka, Ki, Ku, Ke, Ko)',
    description: 'Fånga konsonanterna från Ka-raden. Tänk på minnesbilderna (Ka = Kaka, Ki = Nyckel)!',
    kanaIds: ['ka', 'ki', 'ku', 'ke', 'ko'],
    baskets: [
      { romaji: 'ka', kana: 'か', id: 'ka' },
      { romaji: 'ki', kana: 'き', id: 'ki' },
      { romaji: 'ku', kana: 'く', id: 'ku' },
      { romaji: 'ke', kana: 'け', id: 'ke' },
      { romaji: 'ko', kana: 'こ', id: 'ko' }
    ],
    targetScore: 700
  },
  {
    levelNumber: 3,
    rowName: 'S-raden',
    title: 'Nivå 3: Sa-Korgarna (Sa, Shi, Su, Se, So)',
    description: 'Se upp för Shi (kroken) och Su (öglan)!',
    kanaIds: ['sa', 'shi', 'su', 'se', 'so'],
    baskets: [
      { romaji: 'sa', kana: 'さ', id: 'sa' },
      { romaji: 'shi', kana: 'し', id: 'shi' },
      { romaji: 'su', kana: 'す', id: 'su' },
      { romaji: 'se', kana: 'せ', id: 'se' },
      { romaji: 'so', kana: 'そ', id: 'so' }
    ],
    targetScore: 800
  },
  {
    levelNumber: 4,
    rowName: 'T-raden',
    title: 'Nivå 4: Ta-Korgarna (Ta, Chi, Tsu, Te, To)',
    description: 'Öva på Chi (som en 5:a) och Tsu (tsunami-vågen)!',
    kanaIds: ['ta', 'chi', 'tsu', 'te', 'to'],
    baskets: [
      { romaji: 'ta', kana: 'た', id: 'ta' },
      { romaji: 'chi', kana: 'ち', id: 'chi' },
      { romaji: 'tsu', kana: 'つ', id: 'tsu' },
      { romaji: 'te', kana: 'て', id: 'te' },
      { romaji: 'to', kana: 'to', id: 'to' }
    ],
    targetScore: 900
  },
  {
    levelNumber: 5,
    rowName: 'N-raden',
    title: 'Nivå 5: Na-Korgarna (Na, Ni, Nu, Ne, No)',
    description: 'Fem kluriga tecken: Na, Ni, Nu (nudlar), Ne (katt) och No (förbudsmärke)!',
    kanaIds: ['na', 'ni', 'nu', 'ne', 'no'],
    baskets: [
      { romaji: 'na', kana: 'な', id: 'na' },
      { romaji: 'ni', kana: 'に', id: 'ni' },
      { romaji: 'nu', kana: 'ぬ', id: 'nu' },
      { romaji: 'ne', kana: 'ね', id: 'ne' },
      { romaji: 'no', kana: 'の', id: 'no' }
    ],
    targetScore: 900
  },
  {
    levelNumber: 6,
    rowName: 'H-raden',
    title: 'Nivå 6: Ha-Korgarna (Ha, Hi, Fu, He, Ho)',
    description: 'Lär dig Ha, Hi (leende), Fu (berget Fuji), He (kullen) och Ho (med hatt)!',
    kanaIds: ['ha', 'hi', 'fu', 'he', 'ho'],
    baskets: [
      { romaji: 'ha', kana: 'は', id: 'ha' },
      { romaji: 'hi', kana: 'ひ', id: 'hi' },
      { romaji: 'fu', kana: 'ふ', id: 'fu' },
      { romaji: 'he', kana: 'へ', id: 'he' },
      { romaji: 'ho', kana: 'ほ', id: 'ho' }
    ],
    targetScore: 900
  },
  {
    levelNumber: 7,
    rowName: 'M-raden',
    title: 'Nivå 7: Ma-Korgarna (Ma, Mi, Mu, Me, Mo)',
    description: 'Ma, Mi (noten mi), Mu (ko med horn), Me (öga) och Mo (fiskkrok med mask)!',
    kanaIds: ['ma', 'mi', 'mu', 'me', 'mo'],
    baskets: [
      { romaji: 'ma', kana: 'ま', id: 'ma' },
      { romaji: 'mi', kana: 'み', id: 'mi' },
      { romaji: 'mu', kana: 'む', id: 'mu' },
      { romaji: 'me', kana: 'め', id: 'me' },
      { romaji: 'mo', kana: 'も', id: 'mo' }
    ],
    targetScore: 900
  },
  {
    levelNumber: 8,
    rowName: 'R- & Y-raden',
    title: 'Nivå 8: Ra- & Ya-Korgarna (Ra, Ri, Ru, Re, Ro & Ya, Yu, Yo)',
    description: 'Ra-raden med klaff-R och Y-tecknen (Ya, Yu, Yo)!',
    kanaIds: ['ra', 'ri', 'ru', 're', 'ro', 'ya', 'yu', 'yo'],
    baskets: [
      { romaji: 'ra', kana: 'ら', id: 'ra' },
      { romaji: 'ri', kana: 'り', id: 'ri' },
      { romaji: 'ru', kana: 'る', id: 'ru' },
      { romaji: 're', kana: 'れ', id: 're' },
      { romaji: 'ro', kana: 'ろ', id: 'ro' }
    ],
    targetScore: 1000
  },
  {
    levelNumber: 9,
    rowName: 'W & N',
    title: 'Nivå 9: Baskana Slut (Wa, Wo, N)',
    description: 'Slutför baskana med Wa, Wo och N!',
    kanaIds: ['wa', 'wo', 'n', 'a', 'o'],
    baskets: [
      { romaji: 'wa', kana: 'わ', id: 'wa' },
      { romaji: 'wo', kana: 'を', id: 'wo' },
      { romaji: 'n', kana: 'ん', id: 'n' },
      { romaji: 'a', kana: 'あ', id: 'a' },
      { romaji: 'o', kana: 'お', id: 'o' }
    ],
    targetScore: 900
  },
  {
    levelNumber: 10,
    rowName: 'G-raden',
    title: 'Nivå 10: Dakuten Ga (Ga, Gi, Gu, Ge, Go)',
    description: 'Ka-raden med två små fnuttar (゛) blir tonande G-ljud!',
    kanaIds: ['ga', 'gi', 'gu', 'ge', 'go'],
    baskets: [
      { romaji: 'ga', kana: 'が', id: 'ga' },
      { romaji: 'gi', kana: 'ぎ', id: 'gi' },
      { romaji: 'gu', kana: 'ぐ', id: 'gu' },
      { romaji: 'ge', kana: 'げ', id: 'ge' },
      { romaji: 'go', kana: 'ご', id: 'go' }
    ],
    targetScore: 1000
  },
  {
    levelNumber: 11,
    rowName: 'Z & D',
    title: 'Nivå 11: Za & Da-Korgarna (Za, Ji, Zu, Ze, Zo / Da, De, Do)',
    description: 'S-raden blir Z/J och T-raden blir D!',
    kanaIds: ['za', 'ji', 'zu', 'ze', 'zo', 'da', 'de', 'do'],
    baskets: [
      { romaji: 'za', kana: 'ざ', id: 'za' },
      { romaji: 'ji', kana: 'じ', id: 'ji' },
      { romaji: 'zu', kana: 'ず', id: 'zu' },
      { romaji: 'da', kana: 'だ', id: 'da' },
      { romaji: 'do', kana: 'ど', id: 'do' }
    ],
    targetScore: 1000
  },
  {
    levelNumber: 12,
    rowName: 'B & P',
    title: 'Nivå 12: Ba & Pa-Korgarna (Dakuten & Handakuten)',
    description: 'Ha-raden med fnuttar blir B, och med cirkel blir P!',
    kanaIds: ['ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po'],
    baskets: [
      { romaji: 'ba', kana: 'ば', id: 'ba' },
      { romaji: 'bi', kana: 'び', id: 'bi' },
      { romaji: 'bu', kana: 'ぶ', id: 'bu' },
      { romaji: 'pa', kana: 'ぱ', id: 'pa' },
      { romaji: 'po', kana: 'ぽ', id: 'po' }
    ],
    targetScore: 1000
  },
  {
    levelNumber: 13,
    rowName: 'Mästarläget',
    title: 'Nivå 13: Stora Hiragana-Dojon (Blandat)',
    description: 'Blandade tecken från hela alfabetet. Hur hög combo klarar du?',
    kanaIds: HIRAGANA_DATA.map(k => k.id),
    baskets: [
      { romaji: 'a', kana: 'あ', id: 'a' },
      { romaji: 'ka', kana: 'か', id: 'ka' },
      { romaji: 'sa', kana: 'さ', id: 'sa' },
      { romaji: 'ta', kana: 'ta', id: 'ta' },
      { romaji: 'na', kana: 'na', id: 'na' }
    ],
    targetScore: 99999
  }
];

interface FallingBlock {
  id: string;
  kana: string;
  romaji: string;
  xPercent: number; // 15% till 85%
  yPercent: number; // 2% till 78%
  baseSpeedPercentPerSec: number;
}

export const KanaTetrisBasket: React.FC<KanaTetrisBasketProps> = ({
  onBackToArcade
}) => {
  const { stats, recordActivity } = useProgression();
  const userStats = stats;
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover' | 'levelwin'>('idle');
  const [gameMode, setGameMode] = useState<'classic' | 'zen'>('classic');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  
  // Speed Setting (Delta-time calibrated)
  const [speedMode, setSpeedMode] = useState<'slow' | 'normal' | 'fast'>('slow');
  
  // Accessibility & Guidance toggles
  const [showLaserGuide, setShowLaserGuide] = useState<boolean>(true);
  const [showCartHighlight, setShowCartHighlight] = useState<boolean>(true);
  const [audioOnSpawn, setAudioOnSpawn] = useState<boolean>(true);

  // Slow-Mo "Bullet Time" State
  const [slowMoActive, setSlowMoActive] = useState<boolean>(false);
  const [slowMoEnergy, setSlowMoEnergy] = useState<number>(100);

  // Basket Tray Position: X center percent across arena (slides from -25% to 125% so all baskets reach edges)
  const [trayX, setTrayX] = useState<number>(50);
  const [targetTrayX, setTargetTrayX] = useState<number>(50);

  // Active Falling Block
  const [fallingBlock, setFallingBlock] = useState<FallingBlock | null>(null);
  const [recentHitFeedback, setRecentHitFeedback] = useState<{ text: string; type: 'success' | 'wrong' | 'miss' | 'heal'; time: number } | null>(null);
  const [glowingBasketIdx, setGlowingBasketIdx] = useState<number | null>(null);

  const currentLevel = BASKET_LEVELS[selectedLevelIdx] || BASKET_LEVELS[0];
  const lastFrameTimeRef = useRef<number>(0);
  const activeLevelRef = useRef<LevelConfig>(currentLevel);
  const slowMoActiveRef = useRef<boolean>(slowMoActive);

  useEffect(() => {
    activeLevelRef.current = currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    slowMoActiveRef.current = slowMoActive;
  }, [slowMoActive]);

  // Delta-time calibrated fall speed (percentage points per second in tall arena)
  // Drop distance is ~76% (y=2% to y=78%)
  // Slow: 76 / 8.8 ≈ 8.6 sekunder
  // Normal: 76 / 14.5 ≈ 5.2 sekunder
  // Fast: 76 / 23.0 ≈ 3.3 sekunder
  const getSpeedPercentPerSec = useCallback(() => {
    if (speedMode === 'slow') return 8.8;
    if (speedMode === 'normal') return 14.5;
    return 23.0;
  }, [speedMode]);

  // Spawn a new falling Hiragana block
  const spawnNewBlock = useCallback(() => {
    const lvl = activeLevelRef.current;
    const availableIds = lvl.kanaIds;
    const pickedId = availableIds[Math.floor(Math.random() * availableIds.length)];
    const kanaObj = HIRAGANA_DATA.find(k => k.id === pickedId) || HIRAGANA_DATA[0];

    const randomX = 16 + Math.random() * 68;

    const newBlock: FallingBlock = {
      id: `${kanaObj.id}-${Date.now()}`,
      kana: kanaObj.kana,
      romaji: kanaObj.romaji,
      xPercent: randomX,
      yPercent: 2,
      baseSpeedPercentPerSec: getSpeedPercentPerSec()
    };

    setFallingBlock(newBlock);

    if (audioOnSpawn) {
      playJapaneseSpeech(kanaObj.kana, 0.95);
    }
  }, [getSpeedPercentPerSec, audioOnSpawn]);

  // Start / Restart Game
  const handleStartLevel = (levelIdx: number = selectedLevelIdx) => {
    setSelectedLevelIdx(levelIdx);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setSlowMoEnergy(100);
    setSlowMoActive(false);
    setTrayX(50);
    setTargetTrayX(50);
    setRecentHitFeedback(null);
    setGlowingBasketIdx(null);
    setGameState('playing');
    sfx.playClick();
    setTimeout(() => {
      spawnNewBlock();
    }, 350);
  };

  // Move a specific basket directly under the block (Keyboard shortcut 1-5 or buttons)
  const alignBasketWithBlock = useCallback((basketIdx: number) => {
    if (!fallingBlock) return;
    const baskets = activeLevelRef.current.baskets;
    if (basketIdx < 0 || basketIdx >= baskets.length) return;

    const basketCount = baskets.length;
    const basketWidth = 14; // each basket is 14% wide
    const totalTrayWidth = basketCount * basketWidth;
    const halfWidth = totalTrayWidth / 2;

    // basketCenter = trayX - halfWidth + (basketIdx + 0.5) * basketWidth
    // Set basketCenter = fallingBlock.xPercent
    const desiredTrayX = fallingBlock.xPercent + halfWidth - (basketIdx + 0.5) * basketWidth;
    setTargetTrayX(desiredTrayX);
    sfx.playClick();
  }, [fallingBlock]);

  // Handle Block reaching basket level
  const handleBlockCatch = useCallback(() => {
    if (!fallingBlock) return;

    const lvl = activeLevelRef.current;
    const baskets = lvl.baskets;
    const basketCount = baskets.length;
    const basketWidth = 14;
    const totalTrayWidth = basketCount * basketWidth;
    const trayLeft = trayX - (totalTrayWidth / 2);
    const trayRight = trayX + (totalTrayWidth / 2);

    const blockX = fallingBlock.xPercent;

    // Check if block landed inside the tray
    if (blockX >= trayLeft && blockX <= trayRight) {
      const basketIndex = Math.min(
        Math.floor((blockX - trayLeft) / basketWidth),
        basketCount - 1
      );
      const hitBasket = baskets[basketIndex];

      if (hitBasket && hitBasket.romaji.toLowerCase() === fallingBlock.romaji.toLowerCase()) {
        // 🎉 MATCH! CAUGHT IN CORRECT BASKET!
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);

        const earnedPoints = 100 * Math.min(newCombo, 10);
        const newScore = score + earnedPoints;
        setScore(newScore);

        setSlowMoEnergy(prev => Math.min(100, prev + 25));

        if (gameMode === 'classic' && newCombo % 5 === 0 && lives < 3) {
          setLives(prev => Math.min(3, prev + 1));
          setRecentHitFeedback({
            text: `💖 5x Combo! +1 Liv återställt! (${fallingBlock.kana} = ${fallingBlock.romaji.toUpperCase()}) +${earnedPoints}p`,
            type: 'heal',
            time: Date.now()
          });
        } else {
          setRecentHitFeedback({
            text: `✨ Perfekt i korgen! ${fallingBlock.kana} = ${fallingBlock.romaji.toUpperCase()} (+${earnedPoints}p)`,
            type: 'success',
            time: Date.now()
          });
        }

        setGlowingBasketIdx(basketIndex);
        setTimeout(() => setGlowingBasketIdx(null), 500);

        sfx.playCatch(newCombo);
        playJapaneseSpeech(fallingBlock.kana, 1.0);

        recordActivity({
          type: 'game_finished',
          gameId: 'kanaDrop',
          score: newScore,
          maxCombo: newCombo
        });

        if (newScore >= lvl.targetScore && lvl.levelNumber < 13) {
          setGameState('levelwin');
          sfx.playLevelUp();
          fireSuperCelebration();
          return;
        }
      } else {
        // ❌ WRONG BASKET!
        setCombo(0);
        sfx.playMiss();

        if (gameMode === 'classic') {
          const newLives = lives - 1;
          setLives(newLives);

          setRecentHitFeedback({
            text: `⚠️ Fel korg! Föll i [${hitBasket ? hitBasket.romaji.toUpperCase() : 'fel'}], men blocket var ${fallingBlock.kana} (${fallingBlock.romaji.toUpperCase()}).`,
            type: 'wrong',
            time: Date.now()
          });

          if (newLives <= 0) {
            setGameState('gameover');
            sfx.playGameOver();
            return;
          }
        } else {
          setRecentHitFeedback({
            text: `💡 Tecknet ${fallingBlock.kana} (${fallingBlock.romaji.toUpperCase()}) hör hemma i korg ${fallingBlock.romaji.toUpperCase()}!`,
            type: 'wrong',
            time: Date.now()
          });
        }
      }
    } else {
      // 🌧️ MISSED TRAY
      setCombo(0);
      sfx.playMiss();
      setRecentHitFeedback({
        text: `💨 Missade korgarna! ${fallingBlock.kana} (${fallingBlock.romaji.toUpperCase()}) föll vid sidan.`,
        type: 'miss',
        time: Date.now()
      });
    }

    spawnNewBlock();
  }, [fallingBlock, trayX, combo, maxCombo, score, lives, gameMode, recordActivity, spawnNewBlock]);

  // Delta-Time Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animFrame: number;
    lastFrameTimeRef.current = performance.now();

    const gameLoop = (currentTime: number) => {
      const dtSeconds = Math.min((currentTime - lastFrameTimeRef.current) / 1000, 0.1);
      lastFrameTimeRef.current = currentTime;

      // Handle Slow-Mo energy drain
      if (slowMoActiveRef.current) {
        setSlowMoEnergy(prev => {
          const next = prev - (22 * dtSeconds);
          if (next <= 0) {
            setSlowMoActive(false);
            return 0;
          }
          return next;
        });
      }

      // Smooth tray movement towards target
      setTrayX((prev) => {
        const diff = targetTrayX - prev;
        if (Math.abs(diff) < 0.05) return targetTrayX;
        const lerpFactor = Math.min(1, 14 * dtSeconds);
        return prev + diff * lerpFactor;
      });

      // Update falling block with delta-time
      setFallingBlock((prev) => {
        if (!prev) return null;

        const effectiveSpeed = slowMoActiveRef.current ? prev.baseSpeedPercentPerSec * 0.3 : prev.baseSpeedPercentPerSec;
        const nextY = prev.yPercent + (effectiveSpeed * dtSeconds);

        // Catch level is at 78%
        if (nextY >= 78) {
          handleBlockCatch();
          return null;
        }

        return { ...prev, yPercent: nextY };
      });

      animFrame = requestAnimationFrame(gameLoop);
    };

    animFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [gameState, targetTrayX, handleBlockCatch]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const step = 8;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setTargetTrayX((prev) => Math.max(-25, prev - step));
        sfx.playClick();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setTargetTrayX((prev) => Math.min(125, prev + step));
        sfx.playClick();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        // Fast drop block
        setFallingBlock((prev) => prev ? { ...prev, baseSpeedPercentPerSec: prev.baseSpeedPercentPerSec * 2.8 } : null);
      } else if (e.code === 'Space' || e.key === 'Shift') {
        e.preventDefault();
        if (slowMoEnergy > 5) {
          setSlowMoActive(prev => !prev);
          sfx.playClick();
        }
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const basketIdx = parseInt(e.key, 10) - 1;
        alignBasketWithBlock(basketIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentLevel, slowMoEnergy, alignBasketWithBlock]);

  const targetBasketIdx = fallingBlock
    ? currentLevel.baskets.findIndex(b => b.romaji.toLowerCase() === fallingBlock.romaji.toLowerCase())
    : -1;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-6 space-y-6 animate-fadeIn select-none">
      {/* ============================================================ */}
      {/* 2-COLUMN DESKTOP LAYOUT (Left Side Panel + Tall Right Arena) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* LEFT SIDEBAR: LEVEL SELECTOR, CONTROLS, QUICK ALIGN & SETTINGS */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-4">
          
          {/* Header Card */}
          <div className="bg-white dark:bg-sumi-900 p-5 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-sm space-y-3">
            {onBackToArcade && (
              <button
                onClick={onBackToArcade}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-sumi-700"
              >
                <ArrowLeft size={14} /> Tillbaka till Spelarkaden
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-2xl shadow-xs">
                ⛩️
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  Kana Basket Drop
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fånga rätt Hiragana i korgarna!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Alignment Buttons (Big & Touch-Friendly) */}
          <div className="bg-white dark:bg-sumi-900 p-4 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-500 font-black uppercase text-[11px] tracking-wider">
                <Compass size={14} /> Rikta Korg Direktsikte
              </span>
              <span className="text-[10px] text-slate-400 font-mono">TANGENT 1–5</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {currentLevel.baskets.map((basket, idx) => {
                const isTarget = idx === targetBasketIdx && showCartHighlight;
                return (
                  <button
                    key={basket.id}
                    onClick={() => alignBasketWithBlock(idx)}
                    disabled={gameState !== 'playing'}
                    className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-between border-2 transition-all active:scale-95 disabled:opacity-40 shadow-xs ${
                      isTarget
                        ? 'bg-amber-400 text-sumi-950 border-amber-300 ring-2 ring-amber-400/60 font-black animate-pulse'
                        : 'bg-slate-50 dark:bg-sumi-950 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-sumi-800 hover:border-amber-400/60'
                    }`}
                  >
                    <span className="text-[9px] font-mono opacity-60">#{idx + 1}</span>
                    <span className="font-mono text-sm font-black uppercase">{basket.romaji}</span>
                    <span className="font-jp text-[11px] font-bold opacity-80">{basket.kana}</span>
                  </button>
                );
              })}
            </div>

            {/* Manual Nudge Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => {
                  setTargetTrayX(prev => Math.max(-25, prev - 12));
                  sfx.playClick();
                }}
                disabled={gameState !== 'playing'}
                className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40 border border-slate-200 dark:border-sumi-700"
              >
                <ArrowLeft size={14} /> Vänster
              </button>

              <button
                onClick={() => {
                  setFallingBlock(prev => prev ? { ...prev, baseSpeedPercentPerSec: prev.baseSpeedPercentPerSec * 2.8 } : null);
                }}
                disabled={gameState !== 'playing'}
                className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40 border border-slate-200 dark:border-sumi-700"
              >
                <ArrowDown size={14} /> Snabbfall
              </button>

              <button
                onClick={() => {
                  setTargetTrayX(prev => Math.min(125, prev + 12));
                  sfx.playClick();
                }}
                disabled={gameState !== 'playing'}
                className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40 border border-slate-200 dark:border-sumi-700"
              >
                Höger <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Game Settings & Assists Card */}
          <div className="bg-white dark:bg-sumi-900 p-4 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-sumi-800 pb-2">
              <Sliders size={14} className="text-amber-500" />
              <span>Spelinställningar & Tempo</span>
            </div>

            {/* Mode: Äventyr vs Zen */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Spelläge:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { setGameMode('classic'); sfx.playClick(); }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    gameMode === 'classic'
                      ? 'bg-amber-400 text-sumi-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Trophy size={13} />
                  <span>Äventyr (3 Liv)</span>
                </button>
                <button
                  onClick={() => { setGameMode('zen'); sfx.playClick(); }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    gameMode === 'zen'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck size={13} />
                  <span>Zen (Övning)</span>
                </button>
              </div>
            </div>

            {/* Speed Tempo */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fallhastighet:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'slow', label: '🐢 Lugnt', sub: '~9s' },
                  { id: 'normal', label: '🎋 Normal', sub: '~5s' },
                  { id: 'fast', label: '⚡ Snabb', sub: '~3s' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSpeedMode(s.id as any); sfx.playClick(); }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center ${
                      speedMode === s.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[9px] opacity-60 font-mono">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assistance Toggles */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-sumi-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Visuella Hjälpmedel:</label>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800 cursor-pointer">
                  <span className="font-semibold">Fall-Laser (Siktlinje)</span>
                  <input
                    type="checkbox"
                    checked={showLaserGuide}
                    onChange={e => setShowLaserGuide(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800 cursor-pointer">
                  <span className="font-semibold">Målkorg-Glöd (Highlight)</span>
                  <input
                    type="checkbox"
                    checked={showCartHighlight}
                    onChange={e => setShowCartHighlight(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800 cursor-pointer">
                  <span className="font-semibold">Röst-Uttal vid fall</span>
                  <input
                    type="checkbox"
                    checked={audioOnSpawn}
                    onChange={e => setAudioOnSpawn(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Level List Selector */}
          <div className="bg-white dark:bg-sumi-900 p-4 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-gold font-bold">
                <Layers size={14} /> Välj Rad / Nivå
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{selectedLevelIdx + 1} / 13</span>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {BASKET_LEVELS.map((lvl, idx) => (
                <button
                  key={lvl.levelNumber}
                  onClick={() => {
                    if (gameState === 'playing') setGameState('idle');
                    setSelectedLevelIdx(idx);
                    sfx.playClick();
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedLevelIdx === idx
                      ? 'bg-amber-400 text-sumi-950 font-black shadow-xs'
                      : 'bg-slate-50 dark:bg-sumi-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sumi-800 border border-slate-100 dark:border-sumi-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-70 font-mono">Nivå {lvl.levelNumber}</span>
                    <span className="truncate">{lvl.rowName}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Control Guide Card */}
          <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-3xl border border-slate-200 dark:border-sumi-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <HelpCircle size={13} className="text-amber-500" />
              <span>Kommandon & Tips:</span>
            </div>
            <ul className="text-[11px] space-y-1 list-disc list-inside leading-relaxed text-slate-500 dark:text-slate-400">
              <li><strong>Tangent 1–5:</strong> Riktar in korg 1–5 direkt under blocket.</li>
              <li><strong>Piltangenter / A & D:</strong> Stegvis sidoflytt eller använd knapparna.</li>
              <li><strong>Mellanslag / Shift:</strong> Aktivera Slow-Mo (Tidsfrysning).</li>
              <li><strong>Nedåtpil / S:</strong> Snabbfall när du är säker på korgen.</li>
            </ul>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT MAIN GAME ARENA (Tall Zen Dojo Canvas) */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 xl:col-span-8.5 space-y-4">
          <div
            className="relative w-full h-[700px] sm:h-[730px] bg-gradient-to-b from-[#0c1017] via-[#111726] to-[#0a0d14] rounded-3xl border-4 border-slate-800 dark:border-sumi-700 shadow-2xl overflow-hidden flex flex-col justify-between select-none"
          >
            {/* Ambient Background Zen Lights / Floating Particles */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-10 left-16 w-3 h-3 rounded-full bg-amber-400 blur-xs"></div>
              <div className="absolute top-24 right-24 w-3 h-3 rounded-full bg-cyan-400 blur-xs"></div>
              <div className="absolute top-48 left-1/4 w-4 h-4 rounded-full bg-sakura-400 blur-xs"></div>
              <div className="absolute top-72 right-1/3 w-3 h-3 rounded-full bg-emerald-400 blur-xs"></div>
              
              {/* Subtle Japanese Pattern Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]"></div>
            </div>

            {/* ============================================================ */}
            {/* IN-GAME FLOATING HUD (Top Frosted Glass Overlay Bar) */}
            {/* ============================================================ */}
            <div className="p-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-white flex flex-wrap justify-between items-center gap-3 text-xs z-30 shadow-lg">
              
              {/* Left HUD: Level & Mode Badge */}
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-sumi-950 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm">
                  {currentLevel.rowName}
                </span>
                <span className="font-bold text-slate-200 text-xs truncate max-w-[200px] sm:max-w-xs">
                  {currentLevel.title}
                </span>
              </div>

              {/* Center HUD: Lives / Zen & Combo Streak */}
              <div className="flex items-center gap-4">
                {gameMode === 'classic' ? (
                  <div className="flex items-center gap-1 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold mr-1">LIV:</span>
                    {[1, 2, 3].map((h) => (
                      <Heart
                        key={h}
                        size={16}
                        className={`transition-transform duration-200 ${
                          h <= lives ? 'text-sakura-500 fill-sakura-500 scale-100' : 'text-slate-700 fill-slate-700 scale-75'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/60 px-3 py-1 rounded-xl text-emerald-300 font-bold text-xs">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Zen-läge</span>
                  </div>
                )}

                {/* Combo Flame */}
                <div className="flex items-center gap-1 font-black text-amber-400 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-700 text-xs">
                  <Flame size={15} className={combo > 1 ? 'animate-bounce text-orange-500' : 'text-slate-600'} />
                  <span>{combo}x</span>
                </div>
              </div>

              {/* Right HUD: Slow-Mo Bullet Time & Score */}
              <div className="flex items-center gap-3">
                {/* Slow-Mo Bar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slowMoEnergy > 5) setSlowMoActive(prev => !prev);
                  }}
                  disabled={slowMoEnergy <= 5 || gameState !== 'playing'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all border ${
                    slowMoActive
                      ? 'bg-cyan-500 text-sumi-950 border-cyan-300 animate-pulse shadow-glow'
                      : slowMoEnergy > 5
                      ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                      : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50'
                  }`}
                >
                  <Hourglass size={12} />
                  <span className="hidden sm:inline">Slow-Mo</span>
                  <div className="w-10 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-100 ${
                        slowMoEnergy > 30 ? 'bg-cyan-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${slowMoEnergy}%` }}
                    />
                  </div>
                </button>

                {/* Live Score */}
                <div className="bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">POÄNG:</span>
                  <span className="text-base font-black font-mono text-emerald-400">{score}</span>
                  <span className="text-[10px] text-slate-500 font-mono">/ {currentLevel.targetScore}p</span>
                </div>
              </div>
            </div>

            {/* FLOATING FEEDBACK ALERT */}
            {recentHitFeedback && Date.now() - recentHitFeedback.time < 2200 && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fadeIn">
                <div className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-2xl flex items-center gap-2 border backdrop-blur-md ${
                  recentHitFeedback.type === 'success' || recentHitFeedback.type === 'heal'
                    ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                    : recentHitFeedback.type === 'wrong'
                    ? 'bg-rose-950/95 border-rose-500 text-rose-200'
                    : 'bg-slate-900/95 border-slate-600 text-slate-300'
                }`}>
                  {recentHitFeedback.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
                  {recentHitFeedback.type === 'heal' && <Heart size={16} className="text-sakura-400 fill-sakura-400 animate-bounce" />}
                  {recentHitFeedback.type === 'wrong' && <AlertCircle size={16} className="text-rose-400" />}
                  <span>{recentHitFeedback.text}</span>
                </div>
              </div>
            )}

            {/* FALLING LASER / BEACON GUIDE LINE */}
            {gameState === 'playing' && fallingBlock && showLaserGuide && (
              <div
                style={{ left: `${fallingBlock.xPercent}%` }}
                className="absolute top-0 bottom-24 -translate-x-1/2 w-8 pointer-events-none z-10 flex flex-col items-center"
              >
                <div className="w-0.5 h-full bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-amber-300/80 dashed-line opacity-75"></div>
                {/* Target zone beacon on basket level */}
                <div className="w-16 h-4 rounded-full bg-amber-400/30 border border-amber-300/80 shadow-glow flex items-center justify-center animate-pulse">
                  <span className="text-[8px] font-black text-amber-200 uppercase tracking-widest">MÅLZON</span>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* FALLING HIRAGANA BLOCK (Snappy & Clean) */}
            {/* ============================================================ */}
            {gameState === 'playing' && fallingBlock && (
              <div
                style={{
                  left: `${fallingBlock.xPercent}%`,
                  top: `${fallingBlock.yPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20 pointer-events-none"
              >
                <div className="relative flex flex-col items-center">
                  {/* Floating Romanized hint badge */}
                  <div className="bg-slate-950/90 text-amber-300 border border-amber-500/60 px-2.5 py-0.5 rounded-lg font-mono text-xs font-black uppercase mb-1 shadow-xl whitespace-nowrap">
                    {fallingBlock.romaji}
                  </div>

                  {/* Clean Glowing Block Shape */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-sakura-500 text-white font-jp text-5xl sm:text-6xl font-black flex items-center justify-center shadow-2xl border-3 border-white/95 animate-pulse-glow">
                    {fallingBlock.kana}
                  </div>

                  {/* Down arrow indicator */}
                  <div className="text-amber-300 text-sm font-black animate-bounce mt-1">
                    ▼
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* THE CATCHING BASKET TRAY (Bamboo & Wooden Lacquer Chambers) */}
            {/* ============================================================ */}
            <div className="mt-auto w-full relative pb-6 z-10">
              
              {/* Bottom Stand Line */}
              <div className="w-full h-3 bg-slate-950/80 border-t border-slate-800"></div>

              {/* Movable Basket Tray */}
              <div
                style={{
                  left: `${trayX}%`,
                  transform: 'translateX(-50%)'
                }}
                className="absolute bottom-5 flex items-end justify-center select-none pointer-events-none transition-transform duration-75"
              >
                {/* Bamboo / Lacquered Tray Housing */}
                <div className="flex items-end bg-gradient-to-b from-[#241a13] to-[#120d09] p-2 rounded-3xl border-3 border-amber-600/70 shadow-2xl gap-2">
                  
                  {/* Individual Basket Chambers */}
                  {currentLevel.baskets.map((basket, idx) => {
                    const isGlowing = glowingBasketIdx === idx;
                    const isTargetHint = showCartHighlight && idx === targetBasketIdx;

                    return (
                      <div
                        key={basket.id}
                        className={`relative w-20 sm:w-24 h-28 rounded-2xl flex flex-col justify-between items-center p-2 border-2 transition-all duration-150 ${
                          isGlowing
                            ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-white text-sumi-950 shadow-glow -translate-y-2 scale-105'
                            : isTargetHint
                            ? 'bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 border-amber-400 text-white shadow-glow ring-2 ring-amber-400/60 -translate-y-1'
                            : 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-900/60 text-white'
                        }`}
                      >
                        {/* Target Indicator above matching basket */}
                        {isTargetHint && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-400 text-sumi-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider animate-bounce shadow-xl whitespace-nowrap border border-white">
                            🎯 MÅL [ {idx + 1} ]
                          </div>
                        )}

                        {/* Top Rim of Basket */}
                        <div className="w-full flex justify-between items-center px-1">
                          <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                            isTargetHint ? 'bg-amber-400 text-sumi-950 font-black' : 'bg-slate-800 text-slate-300'
                          }`}>
                            #{idx + 1}
                          </span>
                          <AudioButton text={basket.kana} size="sm" />
                        </div>

                        {/* Middle Romaji Label */}
                        <div className={`font-mono text-xl sm:text-2xl font-black uppercase tracking-tight ${
                          isTargetHint ? 'text-amber-300 font-extrabold' : 'text-slate-100'
                        }`}>
                          {basket.romaji}
                        </div>

                        {/* Bottom Hiragana Subtitle */}
                        <div className="font-jp text-sm font-bold text-slate-300 -mt-1">
                          {basket.kana}
                        </div>

                        {/* Inner Basket Floor Cushioned Line */}
                        <div className={`w-full h-1 rounded-full ${
                          isTargetHint ? 'bg-amber-400' : 'bg-amber-800/40'
                        }`}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* OVERLAYS: IDLE / PAUSED / GAME OVER / WIN */}
            {/* ============================================================ */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 text-center text-white animate-fadeIn">
                {/* IDLE / START SCREEN */}
                {gameState === 'idle' && (
                  <div className="space-y-6 max-w-md">
                    <div className="w-24 h-24 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/40 text-5xl shadow-2xl">
                      ⛩️
                    </div>
                    <div>
                      <span className="text-xs bg-amber-400 text-sumi-950 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {currentLevel.rowName}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                        {currentLevel.title}
                      </h2>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {currentLevel.description}
                      </p>
                    </div>

                    {/* Level preview baskets */}
                    <div className="bg-slate-900/90 border border-slate-700 p-3.5 rounded-2xl text-xs flex justify-around items-center">
                      <span className="text-slate-400 font-bold">Korgar:</span>
                      <div className="flex gap-1.5 font-mono font-bold text-amber-300">
                        {currentLevel.baskets.map((b, i) => (
                          <span key={b.id} className="bg-slate-800 px-2 py-1 rounded border border-slate-600">
                            [{i + 1}] {b.romaji} ({b.kana})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="bg-white/10 p-3 rounded-2xl border border-white/5">🎯 Mål: <strong>{currentLevel.targetScore}p</strong></div>
                      <div className="bg-white/10 p-3 rounded-2xl border border-white/5">
                        {gameMode === 'classic' ? '💖 3 Liv (+Regen)' : '🌱 Zen (Oändliga liv)'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartLevel()}
                      className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sumi-950 font-black text-base shadow-2xl transition-transform hover:scale-102 flex items-center justify-center gap-2"
                    >
                      <Play size={22} className="fill-current" /> Starta spelet!
                    </button>
                  </div>
                )}

                {/* PAUSED */}
                {gameState === 'paused' && (
                  <div className="space-y-4">
                    <h2 className="text-3xl font-extrabold">Spelet är pausat ⏸️</h2>
                    <button
                      onClick={() => setGameState('playing')}
                      className="px-8 py-3 rounded-2xl bg-amber-400 text-sumi-950 font-bold text-sm"
                    >
                      Fortsätt spela
                    </button>
                  </div>
                )}

                {/* GAME OVER */}
                {gameState === 'gameover' && (
                  <div className="space-y-4 max-w-sm">
                    <div className="text-5xl">💥</div>
                    <h2 className="text-3xl font-extrabold text-rose-400">Slut på liv!</h2>
                    <p className="text-xs text-slate-300">
                      Slutpoäng: <strong className="text-emerald-400 text-lg font-mono">{score}</strong> | Högsta combo: <strong>{maxCombo}x</strong>
                    </p>
                    <div className="flex gap-2 justify-center pt-2">
                      <button
                        onClick={() => handleStartLevel()}
                        className="px-6 py-3 rounded-xl bg-amber-400 text-sumi-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
                      >
                        <RotateCcw size={15} /> Försök igen
                      </button>
                      <button
                        onClick={() => {
                          setGameMode('zen');
                          handleStartLevel();
                        }}
                        className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1 border border-slate-700"
                      >
                        🌱 Byt till Zen-läge
                      </button>
                    </div>
                  </div>
                )}

                {/* LEVEL WIN */}
                {gameState === 'levelwin' && (
                  <div className="space-y-4 max-w-sm">
                    <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                      🏆
                    </div>
                    <h2 className="text-3xl font-extrabold text-amber-300">Nivå Klarad! 🎉</h2>
                    <p className="text-xs text-slate-300">
                      Grymt jobbat! Du bemästrade <strong>{currentLevel.rowName}</strong> och samlade {score} poäng!
                    </p>
                    <div className="flex gap-2 justify-center pt-2">
                      {selectedLevelIdx < BASKET_LEVELS.length - 1 ? (
                        <button
                          onClick={() => handleStartLevel(selectedLevelIdx + 1)}
                          className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black text-xs flex items-center gap-1.5 shadow-lg"
                        >
                          Kör nästa rad ({BASKET_LEVELS[selectedLevelIdx + 1].rowName}) →
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartLevel(0)}
                          className="px-6 py-3 rounded-xl bg-amber-400 text-sumi-950 font-bold text-xs"
                        >
                          Börja om från början
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
