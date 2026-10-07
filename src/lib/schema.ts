import { z } from 'zod';
import { GUILD_IDS } from './guilds';

/** The three kinds of pattern. The kind comes from the file name: AGENT.md, SKILL.md or PERSONA.md. */
export const PATTERN_TYPES = ['agent', 'skill', 'persona'] as const;
export type PatternType = (typeof PATTERN_TYPES)[number];

export const FILE_FOR_TYPE: Record<PatternType, string> = {
  agent: 'AGENT.md',
  skill: 'SKILL.md',
  persona: 'PERSONA.md',
};

/** Same rule as the Agent Skills spec: lowercase letters, digits and single hyphens, max 64 chars. */
export const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Comma-separated list in a metadata string → array. Metadata values stay strings so SKILL.md files remain spec-valid. */
const csv = z
  .string()
  .default('')
  .transform((s) =>
    s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
  );

export const frontmatterSchema = z.object({
  name: z.string().max(64).regex(NAME_RE, 'lowercase letters, digits and hyphens only'),
  description: z.string().min(20, 'say what it does and when to use it').max(1024),
  license: z.literal('CC-BY-4.0'),
  metadata: z.object({
    number: z.string().regex(/^\d{4}$/, 'four digits, e.g. "0007"'),
    title: z.string().min(3).max(60),
    guild: z.enum(GUILD_IDS),
    master: z.string().min(2),
    hallmark: z
      .string()
      .regex(/^(\d{4}-\d{2})?$/, 'empty, or the review month as YYYY-MM')
      .default(''),
    tags: csv,
    languages: csv.transform((l) => (l.length ? l : ['en'])),
    persona: z.string().regex(NAME_RE).optional(),
    skills: csv,
  }),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface Pattern {
  number: string;
  name: string;
  type: PatternType;
  title: string;
  description: string;
  guild: string;
  master: string;
  /** Review month (YYYY-MM) once a pattern earns the Hallmark, else null. */
  hallmark: string | null;
  tags: string[];
  languages: string[];
  /** Agents only: the persona it wears. */
  persona?: string;
  /** Agents only: the skills it carries. */
  skills: string[];
  /** Markdown body, without frontmatter. */
  body: string;
  /** Lines under "## Try saying", if any. */
  starters: string[];
  /** Path inside the repo, e.g. patterns/teachers/classroom-co-teacher/AGENT.md */
  path: string;
  /** The whole file exactly as written. */
  raw: string;
}
