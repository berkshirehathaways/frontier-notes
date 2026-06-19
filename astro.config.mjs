// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// SKIP_KEYSTATIC=true (npm run build): 완전 정적 빌드, /keystatic 라우트 없음.
// 기본 (npm run build:full / astro dev): Keystatic 활성화.
// Keystatic의 /keystatic, /api/keystatic 라우트는 prerender:false라서
// 프로덕션에서는 Vercel 어댑터가 필요합니다. 그 외 페이지는 모두 정적 프리렌더 유지.
const skipKeystatic = process.env.SKIP_KEYSTATIC === 'true';

export default defineConfig({
  site: 'https://frontiernote.com',
  integrations: [mdx(), react(), ...(skipKeystatic ? [] : [keystatic()])],
  adapter: skipKeystatic ? undefined : vercel(),
});
