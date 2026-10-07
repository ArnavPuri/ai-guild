import type { Pattern } from './schema';

/** GitHub repo that hosts the library; used in install commands. */
export const REPO = 'ArnavPuri/ai-guild';

export const PLATFORMS = [
  { id: 'chatgpt', name: 'ChatGPT', limit: 8000 },
  { id: 'claude', name: 'Claude', limit: undefined },
  { id: 'gemini', name: 'Gemini', limit: undefined },
  { id: 'grok', name: 'Grok', limit: 4000 },
  { id: 'openclaw', name: 'OpenClaw', limit: undefined },
  { id: 'hermes', name: 'Hermes Agent', limit: undefined },
  { id: 'coding', name: 'Coding agents', limit: undefined },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]['id'];

export interface ExportPart {
  label: string;
  content: string;
  kind: 'text' | 'command' | 'file';
  /** Where to save it, for kind "file". */
  filename?: string;
}

export interface ExportResult {
  platform: PlatformId;
  platformName: string;
  steps: string[];
  parts: ExportPart[];
  notes: string[];
}

/** What gets exported: one pattern, or an agent with its persona and skills looked up. */
export interface Bundle {
  main: Pattern;
  persona?: Pattern;
  skills: Pattern[];
}

/** Push every Markdown heading down by `by` levels (max h6), so embedded parts nest under ours. */
export function demote(md: string, by: number): string {
  let inFence = false;
  return md
    .split('\n')
    .map((line) => {
      if (/^(```|~~~)/.test(line.trim())) inFence = !inFence;
      if (inFence) return line;
      return line.replace(/^(#{1,6})(\s)/, (_, h: string, s: string) => '#'.repeat(Math.min(6, h.length + by)) + s);
    })
    .join('\n');
}

/** Remove one "## Heading" section (up to the next heading of the same or higher level). */
export function dropSection(md: string, heading: string): string {
  const re = new RegExp(`^##\\s+${heading}\\s*$[\\s\\S]*?(?=^#{1,2}\\s|(?![\\s\\S]))`, 'm');
  return md.replace(re, '').trim();
}

/** Keep only one "## Heading" section's content. */
export function keepSection(md: string, heading: string): string | null {
  const re = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^#{1,2}\\s|(?![\\s\\S]))`, 'm');
  const m = md.match(re);
  return m ? m[1].trim() : null;
}

/** Strip a leading "# Title" line; we write our own titles. */
function stripTitle(md: string): string {
  return md.replace(/^#\s+.*\n+/, '').trim();
}

type Detail = 'full' | 'steps' | 'summary';

function skillBlock(s: Pattern, detail: Detail): string {
  const head = `### ${s.title}\n${s.description}`;
  if (detail === 'summary') return head;
  if (detail === 'steps') {
    const steps = keepSection(stripTitle(s.body), 'Steps');
    return steps ? `${head}\n\n${steps}` : head;
  }
  return `${head}\n\n${demote(stripTitle(s.body), 2)}`;
}

/**
 * One block of plain instructions, the shape every chat product accepts
 * (Custom GPT instructions, Claude Project instructions, Gemini Gem instructions, Grok agents).
 */
export function composeInstructions(b: Bundle, detail: Detail | Detail[] = 'full'): string {
  const detailFor = (i: number): Detail => (Array.isArray(detail) ? (detail[i] ?? 'summary') : detail);
  const { main } = b;
  const intro = demote(dropSection(stripTitle(main.body), 'Try saying'), 0);
  const parts: string[] = [`# ${main.title}`, intro];

  if (main.type === 'agent') {
    if (b.persona) parts.push(`## Who you are\n\n${demote(stripTitle(b.persona.body), 1)}`);
    if (b.skills.length) parts.push(`## What you can do\n\n${b.skills.map((s, i) => skillBlock(s, detailFor(i))).join('\n\n')}`);
  }
  return parts.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Fit instructions under a character limit. First drop each skill to its steps, then summarise
 * skills one at a time from the last, so the most important skills keep their steps longest.
 */
export function fitInstructions(b: Bundle, limit?: number): { text: string; detail: Detail; truncated: boolean } {
  const full = composeInstructions(b, 'full');
  if (!limit || full.length <= limit) return { text: full, detail: 'full', truncated: false };
  const levels: Detail[] = b.skills.map(() => 'steps');
  for (let i = levels.length; i >= 0; i--) {
    if (i < levels.length) levels[i] = 'summary';
    const text = composeInstructions(b, levels);
    if (text.length <= limit) return { text, detail: levels.includes('steps') ? 'steps' : 'summary', truncated: false };
  }
  const text = composeInstructions(b, 'summary');
  const cut = text.slice(0, limit - 60).replace(/\s+\S*$/, '');
  return { text: `${cut}\n\n[Shortened to fit the ${limit}-character limit.]\n`, detail: 'summary', truncated: true };
}

/** A SKILL.md file exactly as the Agent Skills standard expects (name + description frontmatter). */
export function asSkillFile(name: string, description: string, body: string): string {
  const desc = description.replace(/\s+/g, ' ').trim();
  return `---\nname: ${name}\ndescription: ${JSON.stringify(desc)}\nlicense: CC-BY-4.0\n---\n\n${body.trim()}\n`;
}

/** Skill files for a bundle: the skills themselves, plus (for agents and personas) one skill that sets up the role. */
function skillFiles(b: Bundle, root: string): ExportPart[] {
  const files: ExportPart[] = [];
  if (b.main.type === 'skill') {
    files.push({ label: `${b.main.name}/SKILL.md`, kind: 'file', filename: `${root}/${b.main.name}/SKILL.md`, content: b.main.raw });
    return files;
  }
  const roleBody =
    b.main.type === 'agent'
      ? `${composeInstructions({ ...b, skills: b.skills }, 'summary')}\nFor each job above, follow the matching skill: ${b.skills.map((s) => s.name).join(', ')}.\n`
      : composeInstructions(b);
  files.push({
    label: `${b.main.name}/SKILL.md`,
    kind: 'file',
    filename: `${root}/${b.main.name}/SKILL.md`,
    content: asSkillFile(b.main.name, b.main.description, roleBody),
  });
  for (const s of b.skills) {
    files.push({ label: `${s.name}/SKILL.md`, kind: 'file', filename: `${root}/${s.name}/SKILL.md`, content: s.raw });
  }
  return files;
}

function starterNote(b: Bundle): ExportPart[] {
  if (!b.main.starters.length) return [];
  return [{ label: 'Conversation starters', kind: 'text', content: b.main.starters.slice(0, 4).join('\n') }];
}

export function exportFor(platform: PlatformId, b: Bundle): ExportResult {
  const meta = PLATFORMS.find((p) => p.id === platform)!;
  const notes: string[] = [];
  const base = { platform, platformName: meta.name };

  const instructions = () => {
    const fit = fitInstructions(b, meta.limit);
    if (fit.detail === 'steps') notes.push(`Shortened to fit ${meta.name}'s ${meta.limit?.toLocaleString('en')}-character limit: skills keep their steps, and some are summarised.`);
    if (fit.detail === 'summary') notes.push(`Shortened to fit ${meta.name}'s ${meta.limit?.toLocaleString('en')}-character limit: each skill is summarised in one line.`);
    if (fit.truncated) notes.push('Some text was cut. Try a single skill instead of the whole agent.');
    return fit.text;
  };

  switch (platform) {
    case 'chatgpt':
      return {
        ...base,
        steps: ['Open ChatGPT, go to GPTs and choose Create.', 'Open the Configure tab.', 'Paste the instructions below, and the starters into Conversation starters.'],
        parts: [{ label: 'Instructions', kind: 'text', content: instructions() }, ...starterNote(b)],
        notes,
      };
    case 'claude':
      return {
        ...base,
        steps: ['Open Claude and create a new Project.', 'Choose Set project instructions.', 'Paste the instructions below.'],
        parts: [{ label: 'Project instructions', kind: 'text', content: instructions() }, ...starterNote(b)],
        notes,
      };
    case 'gemini':
      return {
        ...base,
        steps: ['Open Gemini and go to Gems.', 'Choose New Gem and give it a name.', 'Paste the instructions below into Instructions.'],
        parts: [{ label: 'Gem instructions', kind: 'text', content: instructions() }, ...starterNote(b)],
        notes,
      };
    case 'grok':
      return {
        ...base,
        steps: ['Open Grok and go to Your Agents.', 'Create an agent and give it a name.', 'Paste the instructions below (they fit the 4,000-character limit).'],
        parts: [{ label: 'Agent instructions', kind: 'text', content: instructions() }],
        notes,
      };
    case 'openclaw': {
      const soulBody =
        b.main.type === 'skill' ? null : composeInstructions({ ...b, skills: [] });
      const parts: ExportPart[] = [];
      if (soulBody) parts.push({ label: 'SOUL.md', kind: 'file', filename: 'SOUL.md', content: soulBody });
      const skills = b.main.type === 'skill' ? [b.main] : b.skills;
      for (const s of skills) parts.push({ label: `skills/${s.name}/SKILL.md`, kind: 'file', filename: `skills/${s.name}/SKILL.md`, content: s.raw });
      return {
        ...base,
        steps: [
          soulBody ? 'Save SOUL.md in your OpenClaw workspace.' : 'Open your OpenClaw workspace.',
          'Save each skill at the path shown, inside the workspace skills folder.',
          'Start a new session so OpenClaw loads them.',
        ],
        parts,
        notes,
      };
    }
    case 'hermes':
      return {
        ...base,
        steps: ['Save each file below under ~/.hermes/skills/ at the path shown.', 'Start a new Hermes session; the skills load on start.'],
        parts: skillFiles(b, '~/.hermes/skills'),
        notes,
      };
    case 'coding': {
      const skills = b.main.type === 'skill' ? [b.main] : b.skills;
      const parts: ExportPart[] = [];
      if (skills.length) {
        // The skills CLI accepts a direct GitHub path to one skill folder.
        const cmds = skills.map((s) => `npx skills add https://github.com/${REPO}/tree/main/${s.path.replace(/\/SKILL\.md$/, '')}`);
        parts.push({ label: skills.length > 1 ? 'Install with the skills CLI (one line per skill)' : 'Install with the skills CLI', kind: 'command', content: cmds.join('\n') });
      }
      if (b.main.type !== 'skill') {
        parts.push(...skillFiles(b, '.agents/skills').slice(0, 1));
        notes.push('The CLI installs the skills. Save the role file too so the agent knows who to be.');
      }
      return {
        ...base,
        steps: ['Run the command in your project folder.', 'It works with Claude Code, Codex, Cursor, Copilot and other tools that read SKILL.md.'],
        parts,
        notes,
      };
    }
  }
}

export function exportAll(b: Bundle): ExportResult[] {
  return PLATFORMS.map((p) => exportFor(p.id, b));
}
