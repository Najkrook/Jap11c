import type { SrsRating, SrsSessionStats } from './types';

export interface StudySessionState<T> {
  currentIndex: number;
  totalCards: number;
  currentCard: T | null;
  isFlipped: boolean;
  isCompleted: boolean;
  stats: SrsSessionStats;
  queueLength: number;
  retryCount: number;
}

export interface StudySessionOptions<T> {
  initialCards: T[];
  getXpForRating?: (rating: SrsRating) => number;
  onCardReviewed?: (card: T, rating: SrsRating, earnedXp: number) => void;
  onCompleted?: (stats: SrsSessionStats) => void;
}

export class StudySessionEngine<T> {
  private queue: T[];
  private originalCards: T[];
  private currentIndex: number = 0;
  private isFlipped: boolean = false;
  private isCompleted: boolean = false;
  private retryCount: number = 0;
  private stats: SrsSessionStats = {
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    xpEarned: 0
  };

  private getXpForRating: (rating: SrsRating) => number;
  private onCardReviewedCallback?: (card: T, rating: SrsRating, earnedXp: number) => void;
  private onCompletedCallback?: (stats: SrsSessionStats) => void;

  private listeners: Set<(state: Readonly<StudySessionState<T>>) => void> = new Set();
  private cachedState: StudySessionState<T>;

  constructor(options: StudySessionOptions<T>) {
    this.originalCards = [...options.initialCards];
    this.queue = [...options.initialCards];
    this.getXpForRating = options.getXpForRating || ((rating: SrsRating) => {
      switch (rating) {
        case 'again': return 5;
        case 'hard': return 10;
        case 'good': return 15;
        case 'easy': return 25;
      }
    });
    this.onCardReviewedCallback = options.onCardReviewed;
    this.onCompletedCallback = options.onCompleted;

    if (this.queue.length === 0) {
      this.isCompleted = true;
    }

    this.cachedState = this.computeState();
  }

  private computeState(): StudySessionState<T> {
    return {
      currentIndex: this.currentIndex,
      totalCards: this.originalCards.length,
      currentCard: this.queue[this.currentIndex] ?? null,
      isFlipped: this.isFlipped,
      isCompleted: this.isCompleted,
      stats: { ...this.stats },
      queueLength: this.queue.length,
      retryCount: this.retryCount
    };
  }

  public getState(): Readonly<StudySessionState<T>> {
    return this.cachedState;
  }

  public subscribe(listener: (state: Readonly<StudySessionState<T>>) => void): () => void {
    this.listeners.add(listener);
    listener(this.cachedState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.cachedState = this.computeState();
    this.listeners.forEach(listener => listener(this.cachedState));
  }

  public flip(): void {
    if (this.isCompleted) return;
    this.isFlipped = !this.isFlipped;
    this.notify();
  }

  public setFlipped(flipped: boolean): void {
    if (this.isCompleted) return;
    this.isFlipped = flipped;
    this.notify();
  }

  public rateCurrent(rating: SrsRating): {
    card: T;
    rating: SrsRating;
    earnedXp: number;
    isFinished: boolean;
  } | null {
    if (this.isCompleted || this.currentIndex >= this.queue.length) {
      return null;
    }

    const currentCard = this.queue[this.currentIndex];
    const earnedXp = this.getXpForRating(rating);

    // Update session statistics
    this.stats.reviewed += 1;
    this.stats[rating] += 1;
    this.stats.xpEarned += earnedXp;

    // Invoke per-card review hook if registered
    this.onCardReviewedCallback?.(currentCard, rating, earnedXp);

    // Reinsert failed cards at the end of the queue for immediate spaced mastery
    if (rating === 'again') {
      this.queue.push(currentCard);
      this.retryCount += 1;
    }

    // Advance session index
    this.currentIndex += 1;
    this.isFlipped = false;

    if (this.currentIndex >= this.queue.length) {
      this.isCompleted = true;
      this.onCompletedCallback?.(this.stats);
    }

    this.notify();

    return {
      card: currentCard,
      rating,
      earnedXp,
      isFinished: this.isCompleted
    };
  }

  public restart(): void {
    this.queue = [...this.originalCards];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.isCompleted = this.queue.length === 0;
    this.retryCount = 0;
    this.stats = {
      reviewed: 0,
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
      xpEarned: 0
    };
    this.notify();
  }
}