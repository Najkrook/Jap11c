// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QuickAddWordModal } from '../QuickAddWordModal';
import { ProgressionServiceImpl } from '../../../modules/progression/ProgressionServiceImpl';
import { InMemoryStorageAdapter } from '../../../modules/progression/storage/InMemoryStorageAdapter';

const { addCustomCard, getStats, recognize } = vi.hoisted(() => ({ addCustomCard: vi.fn(), getStats: vi.fn(), recognize: vi.fn() }));
vi.mock('../../../modules/audio', () => ({ useAudio: () => ({ playSfx: vi.fn(), speakJapanese: vi.fn() }) }));
vi.mock('../../../context/progressionState', () => ({
  useProgression: () => ({ addCustomCard, stats: getStats() }),
}));
vi.mock('../../common/Confetti', () => ({ fireSuperCelebration: vi.fn() }));
vi.mock('../../../services/japaneseOcr', async importOriginal => ({
  ...await importOriginal<typeof import('../../../services/japaneseOcr')>(),
  recognizeJapaneseImage: recognize,
}));

let container: HTMLDivElement;
let root: Root;
let service: ProgressionServiceImpl;
const input = () => document.body.querySelector<HTMLInputElement>('#scan-word')!;
const meaning = () => document.body.querySelector<HTMLInputElement>('input[placeholder="t.ex. katt, skola, god morgon..."]')!;
const save = () => Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.includes('Spara kort'))!;
async function fill(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  await act(async () => {
    const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function settleLookup() {
  await act(async () => { await vi.advanceTimersByTimeAsync(350); });
}

beforeEach(async () => {
  vi.useFakeTimers();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = vi.fn(() => 'blob:test-photo');
    static revokeObjectURL = vi.fn();
  });
  service = new ProgressionServiceImpl(new InMemoryStorageAdapter());
  getStats.mockImplementation(() => service.getStats());
  addCustomCard.mockImplementation(card => service.addCustomCard(card));
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<QuickAddWordModal isOpen onClose={() => {}} />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('adding scanned words', () => {
  it('cannot save the previous card while a different word is being looked up', async () => {
    await fill(input(), 'ねこ');
    await settleLookup();
    expect(meaning().value).not.toBe('');
    await fill(input(), '未登録の試験語');
    expect(meaning().value).toBe('');
    expect(save().disabled).toBe(true);
  });

  it('preserves a manual translation entered immediately after an unknown word', async () => {
    await fill(input(), '未登録の試験語');
    await fill(meaning(), 'Min egen översättning');
    await settleLookup();
    expect(meaning().value).toBe('Min egen översättning');
  });

  it('clearly marks words with no dictionary match', async () => {
    await fill(input(), '未登録の試験語');
    await settleLookup();
    expect(document.body.textContent).toContain('Ingen lokal träff');
    expect(save().disabled).toBe(true);
  });

  it('saves a manual card, preserves optional reading fields, and prevents duplicates', async () => {
    await fill(input(), '未登録の試験語');
    await fill(meaning(), 'Min egen översättning');
    await act(async () => save().click());
    expect(service.getStats().customCards).toHaveLength(1);
    expect(service.getStats().customCards?.[0]).toMatchObject({
      kanji: '未登録の試験語', hiragana: '', romaji: '', meaning: 'Min egen översättning',
    });
    expect(document.body.textContent).toContain('Sparade');
    expect(input().value).toBe('');
    await fill(input(), '未登録の試験語');
    await fill(meaning(), 'Min egen översättning');
    expect(save().disabled).toBe(true);
    expect(document.body.textContent).toContain('finns redan');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reads a photo and lets the user choose and save one of its words', async () => {
    recognize.mockResolvedValueOnce({ text: '学校\n先生', confidence: 95 });
    const picker = document.body.querySelector<HTMLInputElement>('input[aria-label="Välj bild med japansk text"]')!;
    const file = new File(['image'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(picker, 'files', { value: [file], configurable: true });
    await act(async () => picker.dispatchEvent(new Event('change', { bubbles: true })));
    expect(recognize).toHaveBeenCalledWith(file, 'horizontal', expect.any(AbortSignal), expect.any(Function));
    expect(document.body.querySelector<HTMLTextAreaElement>('#scan-result')?.value).toBe('学校\n先生');
    const word = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent === '学校')!;
    await act(async () => word.click());
    await fill(meaning(), 'skola');
    await act(async () => save().click());
    expect(service.getStats().customCards?.[0].meaning).toBe('skola');
    expect(document.body.querySelector('#scan-result')).not.toBeNull(); // Continue with the next word from the photo.
  });

  it('ignores a late OCR result after cancellation', async () => {
    let resolve!: (result: { text: string; confidence: number }) => void;
    recognize.mockReturnValueOnce(new Promise(r => { resolve = r; }));
    const picker = document.body.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(picker, 'files', { value: [new File(['image'], 'photo.jpg')] });
    await act(async () => picker.dispatchEvent(new Event('change', { bubbles: true })));
    const cancel = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent === 'Avbryt bildläsning')!;
    await act(async () => cancel.click());
    await fill(input(), 'ねこ');
    await fill(meaning(), 'Min katt');
    await act(async () => resolve({ text: '学校', confidence: 95 }));
    expect(input().value).toBe('ねこ');
    expect(meaning().value).toBe('Min katt');
    expect(document.body.querySelector('#scan-result')).toBeNull();
  });

  it('shows a recoverable OCR error and still allows typing a card', async () => {
    recognize.mockRejectedValueOnce(new Error('Bilden kunde inte öppnas.'));
    const picker = document.body.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(picker, 'files', { value: [new File(['invalid'], 'photo.jpg')] });
    await act(async () => picker.dispatchEvent(new Event('change', { bubbles: true })));
    expect(document.body.querySelector('[role="alert"]')?.textContent).toContain('Bilden kunde inte öppnas');
    await fill(input(), 'ねこ');
    expect(save().disabled).toBe(false);
  });
});
