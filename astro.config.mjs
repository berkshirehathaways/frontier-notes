// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// https://astro.build/config
const skipKeystatic = process.env.SKIP_KEYSTATIC === 'true';

export default defineConfig({
  site: 'https://frontier-notes.vercel.app',
  integrations: [mdx(), react(), ...(skipKeystatic ? [] : [keystatic()])],
});
