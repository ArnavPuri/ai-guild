import matter from 'gray-matter';
import { frontmatterSchema, type Pattern, type PatternType } from './schema';

export class PatternError extends Error {
  constructor(
    public path: string,
    message: string,
  ) {
    super(`${path}: ${message}`);
  }
}

/** Pull the bullet lines that sit under a "## Try saying" heading. */
export function extractStarters(body: string): string[] {
  const match = body.match(/^##\s+Try saying\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
  if (!match) return [];
  return match[1]
    .split('\n')
    .map((l) => l.match(/^\s*[-*]\s+(.*)$/)?.[1]?.trim())
    .filter((l): l is string => Boolean(l))
    .map((l) => l.replace(/^["“]|["”]$/g, ''));
}

/** Parse one pattern file. Throws PatternError with a readable message when the frontmatter is wrong. */
export function parsePattern(raw: string, path: string, type: PatternType): Pattern {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(raw);
  } catch (e) {
    throw new PatternError(path, `frontmatter is not valid YAML (${(e as Error).message})`);
  }
  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ');
    throw new PatternError(path, issues);
  }
  const fm = result.data;
  const body = parsed.content.trim();
  return {
    number: fm.metadata.number,
    name: fm.name,
    type,
    title: fm.metadata.title,
    description: fm.description,
    guild: fm.metadata.guild,
    master: fm.metadata.master,
    hallmark: fm.metadata.hallmark || null,
    tags: fm.metadata.tags,
    languages: fm.metadata.languages,
    persona: fm.metadata.persona,
    skills: fm.metadata.skills,
    body,
    starters: extractStarters(body),
    path,
    raw,
  };
}
