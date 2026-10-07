import type { APIRoute } from 'astro';
import { allPatterns, REPO_URL } from '../lib/site';

/** Machine-readable index of every pattern, for tools and agents. */
export const GET: APIRoute = () => {
  const patterns = allPatterns().map(({ body, raw, starters, ...p }) => ({
    ...p,
    starters,
    source: `${REPO_URL}/blob/main/${p.path}`,
    raw_url: `${REPO_URL.replace('github.com', 'raw.githubusercontent.com')}/main/${p.path}`,
  }));
  return new Response(JSON.stringify({ version: 1, count: patterns.length, patterns }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
