
# Fix: Slow Home Page Load on Navigation

## Problem
When switching from another page (like Gallery) back to the Home page, the hero section replays its fade-in animations (taking up to 1.2 seconds with staggered delays), and the product carousel appears empty or delayed because images need to reload. This makes the page feel sluggish.

## Root Causes
1. **Animations replay on every visit** -- The `heroFadeUp` animation has staggered delays (0s to 0.5s) using `animation-fill-mode: both`, so elements start invisible and fade in over ~1.2 seconds every time the component mounts.
2. **Short cache time for hero products** -- The hero product query uses `staleTime: 60s` while the global default is 5 minutes. This causes unnecessary re-fetching.
3. **Fallback images show briefly** -- While the DB query resolves, the carousel shows static fallback items, then switches to DB products causing a visual jump.

## Solution

### 1. Remove animation replay on return visits
Only play the `heroFadeUp` animation on the very first page load. Use a module-level flag (`hasAnimated`) that starts `false` and flips to `true` after the first render. On subsequent visits, skip all animation delays so content appears instantly.

### 2. Increase hero products cache time
Change `staleTime` from `60 * 1000` (1 min) to `5 * 60 * 1000` (5 min) to match the global setting. This way, returning to the home page reuses cached product data instantly.

### 3. Show fallback items without delay
Keep the fallback carousel visible while products load so there's no empty state, and use `placeholderData` in the query so the carousel never flickers between fallback and real data.

---

## Technical Details

**File: `src/components/HeroSection.tsx`**

- Add a module-level variable: `let hasAnimated = false;`
- In the component, check `hasAnimated`. If `true`, set all `animation` style props to `'none'` so content renders instantly. If `false`, keep the current staggered animations and set `hasAnimated = true` in a `useEffect`.
- Change `staleTime` on the `hero-products` query from `60 * 1000` to `5 * 60 * 1000`.

This is a single-file change that eliminates the perceived slowness without altering the visual design. First-time visitors still see the elegant fade-in; returning visitors get instant content.
