import { describe, expect, it } from 'vitest';
import { clip, defaultCard, OG_HEIGHT, OG_WIDTH, patternCard, renderPng, titleSize } from '../src/lib/og';
import { loadPatterns } from '../src/lib/patterns';

/** Width and height from a PNG's IHDR chunk. */
const pngSize = (png: Uint8Array) => {
  const v = new DataView(png.buffer, png.byteOffset, png.byteLength);
  return { width: v.getUint32(16), height: v.getUint32(20) };
};

describe('share cards', () => {
  it('renders a 1200x630 PNG for a pattern and for the default card', async () => {
    const agent = loadPatterns().find((p) => p.type === 'agent')!;
    for (const card of [patternCard(agent), defaultCard()]) {
      const png = await renderPng(card);
      expect([...png.slice(1, 4)].map((c) => String.fromCharCode(c)).join('')).toBe('PNG');
      expect(pngSize(png)).toEqual({ width: OG_WIDTH, height: OG_HEIGHT });
    }
  }, 30000);

  it('clips long descriptions at a word boundary', () => {
    const text = 'one two three four five six seven eight nine ten';
    const out = clip(text, 20);
    expect(out.length).toBeLessThanOrEqual(21);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/\s…$/);
    expect(clip('short', 20)).toBe('short');
  });

  it('shrinks the title for every title length the schema allows', () => {
    expect(titleSize('Code Reviewer')).toBeGreaterThan(titleSize('x'.repeat(60)));
    expect(titleSize('x'.repeat(60))).toBeGreaterThanOrEqual(56);
  });
});
