# English Training - Adaptive Practice PWA

An English training PWA that blends deliberate practice with adaptive drills. Practice vocabulary, grammar, phrases, and reading, then use the Study English guide to reinforce what you learn.

## Features

- Adaptive mix mode that prioritizes weak skills and recent mistakes
- Targeted English drills with tips after wrong answers
- Study English menu with short lessons and routines
- Progress tracking, levels, and session summaries
- PWA-ready service worker and manifest

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- CSS Modules
- PWA-ready service worker and manifest

## Getting Started

```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production build

```bash
npm run build
npm run start
```

## Project Structure

```
english-training/
  src/
    app/
      layout.tsx
      page.tsx
      page.module.css
      globals.css
      sitemap.ts
      robots.ts
    config/
      app.ts
      features.ts
      training.ts
      seo.ts
      ads.ts
      pwa.ts
      study.ts
    components/
      ads/
        InlineScriptAdSlot.tsx
      PopUnderAd.tsx
      ServiceWorkerRegister.tsx
    features/
      training/
        providers/
          englishTrainingProvider.ts
        types.ts
        useTrainingSession.ts
    hooks/
      useThemeMode.ts
    lib/
      english.ts
      storage.ts
  public/
    manifest.json
    sw.js
    icons/
```

## Customization Overview

- Branding and metadata: `src/config/app.ts`, `src/config/seo.ts`
- Feature toggles (PWA/SEO/ads): `src/config/features.ts`
- Training flow + copy: `src/config/training.ts`
- Study content: `src/config/study.ts`
- Provider logic: `src/features/training/providers/`

## Deployment

For production, set:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Deploy to Vercel or any Node-compatible hosting.
