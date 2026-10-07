// @ts-check
import { defineConfig } from 'astro/config';

// SITE: the public URL once deployed (used for canonical links and share tags).
// BASE: set to "/ai-guild" when hosting under a sub-path such as GitHub Pages.
export default defineConfig({
  site: process.env.SITE || undefined,
  base: process.env.BASE || '/',
  trailingSlash: 'always',
});
