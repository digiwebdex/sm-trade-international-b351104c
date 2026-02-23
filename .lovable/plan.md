

# 3D Cube Product Carousel for Hero Section

Replace the current flat horizontal carousel on the right side of the hero with an interactive 3D cube-style carousel that rotates to display products on its faces.

---

## What Changes

The right column of the hero section currently shows a flat scrolling strip of product cards. This will be replaced with a **CSS 3D cube carousel** where:

- A central card faces the viewer head-on (large, bright, fully visible)
- Side cards are rotated in 3D perspective, creating a cube-like depth effect
- The cube auto-rotates through products with smooth 3D transitions
- Navigation controls (prev/next, dots, pause/play) remain functional
- Hover pauses rotation, just like today

## Visual Effect

The carousel will use CSS `perspective` and `rotateY` transforms to create a 3D cube illusion:
- **Center card**: scale 1.0, rotateY(0), full opacity, white background with soft shadow
- **Left card**: rotateY(-45deg), translateX left, slightly smaller, reduced opacity
- **Right card**: rotateY(45deg), translateX right, slightly smaller, reduced opacity
- **Hidden cards**: further rotated and fully transparent

A subtle reflection/glow effect remains beneath the cube.

---

## Technical Details

### File modified:
- **src/components/HeroSection.tsx** -- Replace the infinite strip carousel with a CSS 3D perspective carousel

### Implementation approach:
1. Wrap the carousel area in a container with `perspective: 1200px`
2. Show 3 visible cards at a time (left, center, right) using CSS `transform: rotateY() translateZ()`
3. Use the existing `current` state and auto-advance timer (no logic changes needed)
4. Each card gets a computed `rotateY` and `translateX` based on its offset from the active index
5. Cards beyond offset +/-1 get `opacity: 0` and `pointer-events: none`
6. Keep all existing product images, labels, navigation controls, and pause/play functionality

### No new dependencies needed -- pure CSS 3D transforms with React state management already in place.

