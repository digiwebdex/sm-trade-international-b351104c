

# E-commerce Style Product Cards

Currently product cards only show an image with a title overlay. To make them look like proper e-commerce product listings, the card layout will be redesigned to show product details below the image.

---

## What Changes

### Product Card Redesign
Each card will change from "image-only with overlay title" to a proper e-commerce card structure:

- **Image area** (top) -- square image with hover zoom, category badge, gold corner accents (kept from current design)
- **Details area** (below image) -- white card body with:
  - Product name (bold, 2-line clamp)
  - Category tag (small emerald pill)
  - Description text (muted color, 2-line clamp)
  - "Request Quote" or "View Details" call-to-action link with gold accent
- Remove the frosted-glass title overlay from the image (title moves to the card body instead)

### Lightbox Enhancement
- Add a "Request Quote" button inside the lightbox that scrolls to the contact/quote section
- Better structured layout with title, category, and full description clearly separated

---

## Technical Details

### File to modify:
- **src/components/ProductsSection.tsx** -- Restructure the product card JSX from image-only to image + details body layout

### No new dependencies or database changes needed. The existing data fields (title, description, category) are already available -- they just need to be displayed below the image instead of hidden until lightbox click.

