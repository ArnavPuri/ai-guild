/**
 * Validates every pattern under patterns/. Runs in CI on every pull request and before each build.
 * Usage: npm run check:patterns
 */
import fs from 'node:fs';
import path from 'node:path';
import { listPatternFolders, PATTERNS_DIR, typeOfFolder } from '../src/lib/patterns';
import { parsePattern, PatternError } from '../src/lib/parse';
import { lintLibrary, lintPattern, type Issue } from '../src/lib/lint';
import { FILE_FOR_TYPE, type Pattern } from '../src/lib/schema';

const issues: Issue[] = [];
const patterns: Pattern[] = [];

for (const folder of listPatternFolders()) {
  const types = typeOfFolder(folder.files);
  if (types.length !== 1) {
    issues.push({ level: 'error', path: folder.dir, message: 'needs exactly one of AGENT.md, SKILL.md or PERSONA.md' });
    continue;
  }
  const file = FILE_FOR_TYPE[types[0]];
  const rel = path.posix.join(folder.dir, file);
  const raw = fs.readFileSync(path.join(PATTERNS_DIR, folder.guildDir, folder.folderName, file), 'utf8');
  try {
    const p = parsePattern(raw, rel, types[0]);
    patterns.push(p);
    issues.push(...lintPattern(p, folder));
  } catch (e) {
    issues.push({ level: 'error', path: rel, message: e instanceof PatternError ? e.message.slice(rel.length + 2) : String(e) });
  }
}
issues.push(...lintLibrary(patterns));

const errors = issues.filter((i) => i.level === 'error');
const warnings = issues.filter((i) => i.level === 'warning');
for (const i of issues) {
  const tag = i.level === 'error' ? 'ERROR' : 'warn ';
  console.log(`${tag}  ${i.path}\n       ${i.message}`);
  // GitHub Actions annotation, so problems show on the pull request diff.
  if (process.env.GITHUB_ACTIONS) console.log(`::${i.level === 'error' ? 'error' : 'warning'} file=${i.path}::${i.message}`);
}
console.log(`\nChecked ${patterns.length} patterns: ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
