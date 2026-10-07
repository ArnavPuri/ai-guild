import { getGuild } from './guilds';
import { FILE_FOR_TYPE, type Pattern } from './schema';

export interface Issue {
  level: 'error' | 'warning';
  path: string;
  message: string;
}

/**
 * Text that has no business in a copy-paste pattern. Patterns are instructions for a model,
 * so anything that fetches, runs, installs, exfiltrates or overrides is refused outright.
 * This is the automated half of the Hallmark; two human reviewers are the other half.
 */
export const UNSAFE_RULES: { id: string; re: RegExp; message: string }[] = [
  { id: 'link', re: /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\.[a-z]/i, message: 'contains a web link; patterns are text-only' },
  { id: 'webhook', re: /\bweb-?hooks?\b/i, message: 'mentions a webhook' },
  { id: 'fetch-tool', re: /\b(curl|wget|Invoke-WebRequest|iwr)\b/i, message: 'mentions a download command' },
  {
    id: 'install',
    re: /\b(npm|npx|pnpm|yarn|pip3?|brew|apt(-get)?|cargo)\s+(i|install|add)\b/i,
    message: 'asks to install something',
  },
  { id: 'shell', re: /\b(bash|sh|zsh|powershell)\s+-c\b|\|\s*(ba)?sh\b|\beval\s*\(/i, message: 'contains a shell command' },
  {
    // Talking about secrets is fine (a code reviewer should flag leaked keys); reading them is not.
    id: 'secrets',
    // Exfiltration needs somewhere to send things, which the link and webhook rules already catch.
    re: /\b(process\.env|os\.environ|getenv)\b|\$\{?[A-Z][A-Z0-9_]*(KEY|TOKEN|SECRET|PASSWORD)\b|(^|[\s/])\.env\b/,
    message: 'reads keys, tokens or environment variables',
  },
  {
    id: 'override',
    re: /\b(ignore|disregard|forget)\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above|earlier|system)\s+(instructions|prompts?|rules)\b/i,
    message: 'tries to override other instructions',
  },
  {
    id: 'hidden-unicode',
    // Zero-width joiners (U+200C, U+200D) are allowed: Indic scripts and emoji need them.
    re: /[​‎‏‪-‮⁠-⁤⁦-⁩﻿\u{E0000}-\u{E007F}]/u,
    message: 'contains invisible or direction-changing characters',
  },
  { id: 'base64', re: /[A-Za-z0-9+/]{120,}={0,2}/, message: 'contains a long encoded blob' },
  { id: 'html', re: /<\/?[a-z][a-z0-9-]*(\s[^>]*)?>/i, message: 'contains HTML; use plain Markdown' },
];

const ALLOWED_FILES = new Set(Object.values(FILE_FOR_TYPE));
/** Names that would collide with site files (og/default.png). */
const RESERVED_NAMES = new Set(['default']);

export interface FolderInfo {
  dir: string;
  guildDir: string;
  folderName: string;
  files: string[];
}

/** Checks for one pattern on its own. */
export function lintPattern(p: Pattern, folder: FolderInfo): Issue[] {
  const issues: Issue[] = [];
  const err = (message: string) => issues.push({ level: 'error', path: p.path, message });
  const warn = (message: string) => issues.push({ level: 'warning', path: p.path, message });

  if (folder.folderName !== p.name) err(`folder is "${folder.folderName}" but name is "${p.name}"; they must match`);
  if (folder.guildDir !== p.guild) err(`sits in patterns/${folder.guildDir}/ but metadata.guild is "${p.guild}"`);

  for (const f of folder.files) {
    if (!ALLOWED_FILES.has(f)) err(`unexpected file "${f}"; a pattern folder holds one Markdown file and nothing else`);
  }

  for (const rule of UNSAFE_RULES) {
    if (rule.re.test(p.raw)) err(`${rule.message} [${rule.id}]`);
  }

  if (p.body.length < 200) err('body is too short to be useful (under 200 characters)');
  if (p.raw.length > 12000) warn('file is over 12,000 characters; consider splitting it into skills');

  if (p.type === 'agent') {
    if (!p.persona) err('an agent needs metadata.persona');
    if (p.skills.length === 0) err('an agent needs at least one skill in metadata.skills');
    if (p.starters.length < 3) err('an agent needs at least 3 lines under "## Try saying"');
  } else {
    if (p.persona) err('only agents can set metadata.persona');
    if (p.skills.length) err('only agents can set metadata.skills');
  }

  if (p.type === 'skill' && !/^##\s+Steps\b/im.test(p.body)) err('a skill needs a "## Steps" section');

  if (p.type !== 'skill' && getGuild(p.guild).requiresBoundaries && !/^##\s+Boundaries\b/im.test(p.body)) {
    err(`agents and personas in the ${getGuild(p.guild).name} guild need a "## Boundaries" section`);
  }

  return issues;
}

/** Checks that need the whole library: unique numbers and names, and agents pointing at real patterns. */
export function lintLibrary(all: Pattern[]): Issue[] {
  const issues: Issue[] = [];
  const seenNumber = new Map<string, Pattern>();
  const seenName = new Map<string, Pattern>();
  for (const p of all) {
    if (RESERVED_NAMES.has(p.name)) issues.push({ level: 'error', path: p.path, message: `"${p.name}" is a reserved name` });
    const n = seenNumber.get(p.number);
    if (n) issues.push({ level: 'error', path: p.path, message: `number ${p.number} is already used by ${n.path}` });
    else seenNumber.set(p.number, p);
    const m = seenName.get(p.name);
    if (m) issues.push({ level: 'error', path: p.path, message: `name "${p.name}" is already used by ${m.path}` });
    else seenName.set(p.name, p);
  }
  for (const p of all.filter((x) => x.type === 'agent')) {
    if (p.persona) {
      const target = seenName.get(p.persona);
      if (!target) issues.push({ level: 'error', path: p.path, message: `persona "${p.persona}" does not exist` });
      else if (target.type !== 'persona')
        issues.push({ level: 'error', path: p.path, message: `"${p.persona}" is a ${target.type}, not a persona` });
    }
    for (const s of p.skills) {
      const target = seenName.get(s);
      if (!target) issues.push({ level: 'error', path: p.path, message: `skill "${s}" does not exist` });
      else if (target.type !== 'skill')
        issues.push({ level: 'error', path: p.path, message: `"${s}" is a ${target.type}, not a skill` });
    }
  }
  return issues;
}
