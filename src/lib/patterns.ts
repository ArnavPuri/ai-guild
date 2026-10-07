import fs from 'node:fs';
import path from 'node:path';
import { FILE_FOR_TYPE, PATTERN_TYPES, type Pattern, type PatternType } from './schema';
import { parsePattern, PatternError } from './parse';

export const PATTERNS_DIR = path.resolve(process.cwd(), 'patterns');

export interface PatternFolder {
  /** Repo-relative folder, e.g. patterns/teachers/classroom-co-teacher */
  dir: string;
  guildDir: string;
  folderName: string;
  files: string[];
}

/** Every folder two levels under patterns/ (patterns/<guild>/<name>/). */
export function listPatternFolders(root = PATTERNS_DIR): PatternFolder[] {
  if (!fs.existsSync(root)) return [];
  const out: PatternFolder[] = [];
  for (const guildDir of fs.readdirSync(root).sort()) {
    const g = path.join(root, guildDir);
    if (!fs.statSync(g).isDirectory()) continue;
    for (const folderName of fs.readdirSync(g).sort()) {
      const d = path.join(g, folderName);
      if (!fs.statSync(d).isDirectory()) continue;
      out.push({
        dir: path.posix.join('patterns', guildDir, folderName),
        guildDir,
        folderName,
        files: fs.readdirSync(d).sort(),
      });
    }
  }
  return out;
}

export function typeOfFolder(files: string[]): PatternType[] {
  return PATTERN_TYPES.filter((t) => files.includes(FILE_FOR_TYPE[t]));
}

let cache: Pattern[] | null = null;

/** Load and parse every pattern, sorted by number. Throws on the first broken file. */
export function loadPatterns(root = PATTERNS_DIR): Pattern[] {
  if (cache && root === PATTERNS_DIR) return cache;
  const patterns: Pattern[] = [];
  for (const folder of listPatternFolders(root)) {
    const types = typeOfFolder(folder.files);
    if (types.length !== 1) {
      throw new PatternError(folder.dir, 'each folder needs exactly one of AGENT.md, SKILL.md or PERSONA.md');
    }
    const type = types[0];
    const rel = path.posix.join(folder.dir, FILE_FOR_TYPE[type]);
    const raw = fs.readFileSync(path.join(root, folder.guildDir, folder.folderName, FILE_FOR_TYPE[type]), 'utf8');
    patterns.push(parsePattern(raw, rel, type));
  }
  patterns.sort((a, b) => a.number.localeCompare(b.number));
  if (root === PATTERNS_DIR) cache = patterns;
  return patterns;
}

export function byName(patterns: Pattern[]): Map<string, Pattern> {
  return new Map(patterns.map((p) => [p.name, p]));
}

/** An agent with its persona and skills looked up. Missing references are dropped (the checker reports them). */
export function resolveAgent(agent: Pattern, all: Pattern[]) {
  const index = byName(all);
  const persona = agent.persona ? index.get(agent.persona) : undefined;
  const skills = agent.skills.map((s) => index.get(s)).filter((p): p is Pattern => Boolean(p));
  return { agent, persona, skills };
}

/** Agents that use this persona or skill. */
export function usedBy(pattern: Pattern, all: Pattern[]): Pattern[] {
  return all.filter(
    (p) => p.type === 'agent' && (p.persona === pattern.name || p.skills.includes(pattern.name)),
  );
}
