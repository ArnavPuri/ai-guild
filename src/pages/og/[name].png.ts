import type { APIRoute, GetStaticPaths } from 'astro';
import { defaultCard, patternCard, renderPng } from '../../lib/og';
import { allPatterns } from '../../lib/site';
import type { Pattern } from '../../lib/schema';

/** One share card per pattern at /og/<name>.png, plus /og/default.png for every other page. */
export const getStaticPaths: GetStaticPaths = () => [
  { params: { name: 'default' }, props: { pattern: null } },
  ...allPatterns().map((p) => ({ params: { name: p.name }, props: { pattern: p } })),
];

export const GET: APIRoute = async ({ props }) => {
  const { pattern } = props as { pattern: Pattern | null };
  const png = await renderPng(pattern ? patternCard(pattern) : defaultCard());
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
};
