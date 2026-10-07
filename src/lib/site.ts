import { Marked } from 'marked';
import { GUILDS } from './guilds';
import { loadPatterns, resolveAgent } from './patterns';
import type { Bundle } from './exporters';
import type { Pattern, PatternType } from './schema';

export const SITE_NAME = 'Guild';
export const TAGLINE = 'Open patterns for AI';
export const REPO_URL = 'https://github.com/ArnavPuri/ai-guild';

/** Link inside the site, respecting the configured base path. */
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}

export const patternHref = (p: Pattern) => href(`patterns/${p.name}/`);
export const guildHref = (id: string) => href(`guilds/${id}/`);
export const sourceHref = (p: Pattern) => `${REPO_URL}/blob/main/${p.path}`;
export const editHref = (p: Pattern) => `${REPO_URL}/edit/main/${p.path}`;

export const TYPE_LABEL: Record<PatternType, string> = { agent: 'Agent', skill: 'Skill', persona: 'Persona' };

export function allPatterns(): Pattern[] {
  return loadPatterns();
}

export function bundleFor(p: Pattern, all = allPatterns()): Bundle {
  if (p.type !== 'agent') return { main: p, skills: [] };
  const r = resolveAgent(p, all);
  return { main: p, persona: r.persona, skills: r.skills };
}

export function guildCounts(all = allPatterns()) {
  return GUILDS.map((g) => ({ ...g, count: all.filter((p) => p.guild === g.id).length }));
}

// Pattern bodies come from reviewed Markdown, and raw HTML is refused by the checker.
// The renderer escapes any HTML that slips through anyway.
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const md = new Marked({ gfm: true });
md.use({ renderer: { html: (token) => escapeHtml(token.text) } });

export function renderMarkdown(src: string): string {
  return md.parse(src, { async: false }) as string;
}

/** Body without its "# Title" line, for display under our own title. */
export function bodyWithoutTitle(p: Pattern): string {
  return p.body.replace(/^#\s+.*\n+/, '');
}
