/**
 * Share cards (Open Graph images), drawn at build time in the Field Manual style.
 * Satori lays out the card from a small element tree; resvg turns the SVG into a PNG.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import type satoriType from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getGuild } from './guilds';
import type { Pattern } from './schema';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const PAPER = '#f2f1ec';
const SHEET = '#ffffff';
const INK = '#111110';
const MUTED = '#55534d';
const ACCENT = '#ff7a2f';

const require = createRequire(import.meta.url);
// Satori's ES module build reads __dirname, which does not exist in ES modules, so load its CommonJS build.
const satori: typeof satoriType = require('satori').default ?? require('satori');
const font = (pkg: string, file: string) => fs.readFileSync(require.resolve(`${pkg}/files/${file}`));

let fonts: Parameters<typeof satoriType>[1]['fonts'] | null = null;
function loadFonts() {
  fonts ??= [
    { name: 'Space Grotesk', data: font('@fontsource/space-grotesk', 'space-grotesk-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Space Grotesk', data: font('@fontsource/space-grotesk', 'space-grotesk-latin-700-normal.woff'), weight: 700, style: 'normal' },
    { name: 'Plex Mono', data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Plex Mono', data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff'), weight: 600, style: 'normal' },
  ];
  return fonts;
}

type Style = Record<string, string | number>;
interface El {
  type: string;
  props: { style?: Style; children?: El | string | (El | string)[] };
}
/** Tiny element builder: every box is a flex container, which is what Satori expects. */
function h(style: Style, ...children: (El | string | false | null | undefined)[]): El {
  const kids = children.filter((c): c is El | string => Boolean(c));
  return { type: 'div', props: { style: { display: 'flex', ...style }, children: kids.length === 1 ? kids[0] : kids } };
}

/** Cut text at a word boundary so it fits roughly `max` characters. */
export function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/[\s,;:.]+\S*$/, '') + '…';
}

/** Title size steps down for long titles so they never run past two lines. */
export function titleSize(title: string): number {
  if (title.length <= 18) return 96;
  if (title.length <= 26) return 80;
  if (title.length <= 34) return 68;
  return 58;
}

const PLATFORMS_LINE = 'ChatGPT · Claude · Gemini · Grok · OpenClaw · Hermes';

function brand(): El {
  return h(
    { alignItems: 'center', gap: 14 },
    h(
      { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', background: ACCENT, border: `3px solid ${INK}`, fontSize: 28, fontWeight: 700, color: INK },
      'G',
    ),
    h({ fontSize: 30, fontWeight: 700, letterSpacing: -0.5, color: INK }, 'GUILD'),
    h({ fontFamily: 'Plex Mono', fontSize: 18, color: MUTED }, '/ open patterns for AI'),
  );
}

function frame(head: El, body: El): El {
  return h(
    { width: OG_WIDTH, height: OG_HEIGHT, padding: 40, background: PAPER, fontFamily: 'Space Grotesk', color: INK },
    h({ flexDirection: 'column', width: '100%', height: '100%', border: `4px solid ${INK}`, background: SHEET }, head, body),
  );
}

function headBar(left: string, right: string): El {
  return h(
    { justifyContent: 'space-between', padding: '18px 28px', background: ACCENT, borderBottom: `4px solid ${INK}`, fontFamily: 'Plex Mono', fontSize: 22, fontWeight: 600, letterSpacing: 1 },
    h({}, left),
    h({}, right),
  );
}

function footBar(left: El | string, right: string): El {
  return h(
    { justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderTop: `4px solid ${INK}` },
    typeof left === 'string' ? h({}, left) : left,
    h({ fontFamily: 'Plex Mono', fontSize: 18, color: MUTED }, right),
  );
}

export function patternCard(p: Pattern): El {
  const guild = getGuild(p.guild);
  const type = p.type.toUpperCase();
  const facts = [
    p.type === 'agent' ? `${p.skills.length} skills + persona` : null,
    `by ${p.master}`,
    p.hallmark ? `Hallmark ${p.hallmark}` : 'Free · CC BY 4.0',
  ].filter(Boolean) as string[];

  return frame(
    headBar(`PATTERN No. ${p.number}`, type),
    h(
      { flexDirection: 'column', flexGrow: 1 },
      h(
        { flexDirection: 'column', flexGrow: 1, padding: '36px 40px 0' },
        h({ fontFamily: 'Plex Mono', fontSize: 22, color: MUTED, letterSpacing: 1 }, `${guild.name.toUpperCase()}' GUILD`),
        h({ marginTop: 14, fontSize: titleSize(p.title), fontWeight: 700, lineHeight: 1, letterSpacing: -2.5 }, p.title),
        h({ marginTop: 22, fontSize: 28, lineHeight: 1.35, color: '#2e2d29', maxWidth: 1000 }, clip(p.description, 150)),
        h(
          { marginTop: 'auto', marginBottom: 24, gap: 12 },
          ...facts.map((f) => h({ padding: '6px 14px', border: `2px solid ${INK}`, fontFamily: 'Plex Mono', fontSize: 18, fontWeight: 600 }, f)),
        ),
      ),
      footBar(brand(), PLATFORMS_LINE),
    ),
  );
}

export function defaultCard(): El {
  return frame(
    headBar('VOL. 01 — EDITION 2026', 'FREE, FOREVER'),
    h(
      { flexDirection: 'column', flexGrow: 1 },
      h(
        { flexDirection: 'column', flexGrow: 1, padding: '44px 40px 0' },
        h({ fontSize: 96, fontWeight: 700, lineHeight: 0.95, letterSpacing: -3.5, maxWidth: 980 }, 'Hire an AI that already knows your job.'),
        h(
          { marginTop: 28, fontSize: 28, lineHeight: 1.35, color: '#2e2d29', maxWidth: 960 },
          'Copyable agents, skills and personas from teachers, doctors, sellers and builders.',
        ),
      ),
      footBar(brand(), PLATFORMS_LINE),
    ),
  );
}

export async function renderPng(el: El): Promise<Uint8Array> {
  // Satori accepts React-like element objects; our builder produces exactly that shape.
  const svg = await satori(el as unknown as Parameters<typeof satoriType>[0], { width: OG_WIDTH, height: OG_HEIGHT, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
