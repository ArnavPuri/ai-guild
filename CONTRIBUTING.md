# Contributing to Guild

Guild grows when people who do a job write down how they do it. You do not need to be a developer. If GitHub is new to you, open an issue titled "Pattern idea: …" with your steps in plain text and a maintainer will turn it into a pattern with your name on it.

## Add a pattern

1. **Pick one job.** A skill does one job well. Write a skill before you write an agent.
2. **Create the folder** `patterns/<guild>/<name>/` with one file in it: `SKILL.md`, `PERSONA.md` or `AGENT.md`. The folder name is the pattern's `name`.
3. **Fill in the frontmatter.** Take the next free `metadata.number` (the contribute page on the site shows it). Leave `metadata.hallmark` empty; reviewers set it.
4. **Write it like you would teach a new colleague.** Recommended skill sections: `## Ask first`, `## Steps` (required), `## Output`, `## Check before replying`.
5. **Try it** in at least two AIs with three real requests. Fix what goes wrong.
6. **Run the checker:** `npm run check:patterns`.
7. **Open a pull request.** The template asks what you tested.

The full format is on the site's Spec page and in `src/lib/schema.ts`.

## What the checker refuses

Patterns are text people paste into an AI that may have access to their files, email or code. So a pattern is refused if it contains web links, webhooks, download, install or shell commands, reads of environment variables or keys, attempts to override other instructions, invisible Unicode, long encoded blobs, HTML, or any file other than its one Markdown file.

Agents need `metadata.persona`, at least one skill, and three or more lines under `## Try saying`. Agents and personas in the Healers' Guild need a `## Boundaries` section.

## The Hallmark

A pattern earns the Hallmark when two reviewers have checked that:

- it does one clear job, and the description says when to use it;
- it asks for missing information instead of inventing it;
- it never asks for names, IDs or other identifying details about patients, clients or children;
- professional patterns say they support a professional and do not replace one;
- it was tried in at least two AIs and the output was good enough to use;
- nothing in it would embarrass the person using it if their client or boss read it;
- the automated checker passes.

For the Healers' Guild, one reviewer must work in healthcare.

## Proposing a new guild

Open an issue with the profession, who it serves and three skills you would want on day one. A guild opens once it has three reviewed patterns and one reviewer from that profession.

## Code changes

`npm test` must pass. Keep the site static and the design in `src/styles/global.css`. Exporters live in `src/lib/exporters.ts`; add a test when you change one.

By contributing a pattern you agree to license it under CC BY 4.0, and code under MIT.
