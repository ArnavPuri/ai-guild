# Guild — open patterns for AI

**Hire an AI that already knows your job.**

Guild is an open library of copyable AI agents, skills and personas, written by people who do the work: teachers, doctors, developers, designers, sellers and marketers. Every pattern is plain Markdown, text-only, checked automatically for unsafe content, and reviewed by people before it earns the Hallmark.

Copy one into the AI you already use: ChatGPT, Claude, Gemini, Grok, OpenClaw, Hermes Agent, or any coding agent that reads `SKILL.md`.

## What's inside

| Kind | File | What it is |
| --- | --- | --- |
| Persona | `PERSONA.md` | Who the AI is: role, tone, boundaries |
| Skill | `SKILL.md` | How to do one job, step by step ([Agent Skills](https://agentskills.io/) compatible) |
| Agent | `AGENT.md` | A ready teammate: one persona + skills + starter prompts |

Patterns are grouped into guilds by profession:

| Code | Guild | For |
| --- | --- | --- |
| G-01 | Teachers | Teachers, tutors, school leaders |
| G-02 | Healers | Doctors, nurses, therapists, pharmacists |
| G-03 | Builders | Developers and engineers |
| G-04 | Makers | Designers |
| G-05 | Merchants | Sales and account teams |
| G-06 | Heralds | Marketing and content teams |

## Use a pattern

Open any pattern on the site and choose your tool under **Copy for…**. Each tool gets a version shaped for it: Custom GPT instructions and starters, a Claude Project, a Gemini Gem, a Grok agent trimmed to its 4,000-character limit, an OpenClaw `SOUL.md` plus skills, Hermes skill files, or a one-line install for coding agents:

```sh
npx skills add https://github.com/ArnavPuri/ai-guild/tree/main/patterns/builders/review-pull-request
```

## Add a pattern

Read [CONTRIBUTING.md](CONTRIBUTING.md). In short: add `patterns/<guild>/<name>/SKILL.md`, run `npm run check:patterns`, open a pull request.

## Develop

```sh
npm install
npm run dev              # local site at http://localhost:4321
npm run check:patterns   # validate every pattern (also runs in CI)
npm test                 # unit tests for the parser, safety checks and exporters
npm run build            # check patterns, then build the static site into dist/
```

The site is [Astro](https://astro.build), built entirely from the Markdown in `patterns/`. No database, no accounts.

```
patterns/<guild>/<name>/   one folder per pattern, one Markdown file inside
src/lib/schema.ts          frontmatter rules
src/lib/lint.ts            safety and structure checks
src/lib/exporters.ts       "Copy for…" output for each platform
src/pages/                 the site
scripts/check-patterns.ts  the checker CI runs
```

### Deploy

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`. Turn it on once under **Settings → Pages → Source: GitHub Actions**. For a custom domain, set `SITE` to the domain and `BASE` to `/` in that workflow. Any static host works too: build with `npm run build` and serve `dist/`.

## Licence

Patterns: [CC BY 4.0](patterns/LICENSE). Credit the pattern's Master. Code: [MIT](LICENSE).

An [ANYP Labs](https://github.com/ArnavPuri) project.
