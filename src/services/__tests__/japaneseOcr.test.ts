import { describe, expect, it } from 'vitest';
import { getJapaneseWordCandidates, getOcrImageSize, recognizeJapaneseImage } from '../japaneseOcr';

describe('Japanese photo recognition', () => {
  it('limits 48 MP photos to a bounded canvas while keeping the aspect ratio', () => {
    expect(getOcrImageSize(8064, 6048)).toEqual({ width: 2400, height: 1800 });
    expect(getOcrImageSize(6048, 8064)).toEqual({ width: 1800, height: 2400 });
    expect(getOcrImageSize(600, 400)).toEqual({ width: 600, height: 400 });
  });
  it('extracts distinct Japanese choices without OCR spaces or Latin-only noise', () => {
    const words = getJapaneseWordCandidates('学 校\n先生\n学校\n123 ABC');
    expect(words).toContain('学校');
    expect(words).toContain('先生');
    expect(words.filter(word => word === '学校')).toHaveLength(1);
    expect(words).not.toContain('ABC');
    expect(getJapaneseWordCandidates('')).toEqual([]);
  });
  it('does not start an aborted recognition', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(recognizeJapaneseImage(new File([], 'a.jpg'), 'horizontal', controller.signal, () => {})).rejects.toMatchObject({ name: 'AbortError' });
  });
  it('rejects oversized photos before decoding or downloading any model', async () => {
    const file = new File([], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 26 * 1024 * 1024 });
    await expect(recognizeJapaneseImage(file, 'horizontal', new AbortController().signal, () => {})).rejects.toThrow('25 MB');
  });
});
