# Guild (ai-guild)

Open library of copyable AI agents, skills and personas. Static Astro site built from Markdown in `patterns/`.

- Patterns: `patterns/<guild>/<name>/{AGENT,SKILL,PERSONA}.md`, one file per folder. Frontmatter rules in `src/lib/schema.ts`; Guild-specific fields live under `metadata` as strings so SKILL.md stays valid under the Agent Skills spec.
- Safety and structure checks: `src/lib/lint.ts`, run by `npm run check:patterns` (also part of `npm run build` and CI).
- "Copy for…" exporters: `src/lib/exporters.ts` (Grok has a 4,000-character limit; keep the test for it).
- Design: "Field Manual" look, all tokens and components in `src/styles/global.css`. Space Grotesk + IBM Plex Mono, paper #f2f1ec, ink #111110, accent #ff7a2f, 2px black rules.
- Always run `npm run check:patterns && npm test && npx astro build` before committing.
- Internal links go through `href()` in `src/lib/site.ts` so the site works under a sub-path (GitHub Pages uses BASE=/ai-guild).
- Share cards: `src/lib/og.ts` + `src/pages/og/[name].png.ts`, drawn with Satori (loaded via require; its ESM build breaks in Astro) and resvg. Fonts come from @fontsource .woff files.
