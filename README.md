# react-travel-passport

A configurable, animated **passport book** component for React. Show the places
you (or your users) have been — with country covers, ink entry & exit stamps,
and full-page visa stickers, all in a 3D page-flipping booklet.

**[Live demo → react-travel-passport.vercel.app](https://react-travel-passport.vercel.app/)**

- 🛂 **25+ country cover presets** (US, UK, Japan, EU members, Brazil, India, …) plus a neutral "Citizen of the World" default
- 🖋 **Five stamp shapes** — round, oval, rectangular, arrow, and dater — with textured ink, deterministic scatter, and hover glow
- 🏷 **Visa stickers** with foil seals, machine-readable zones, and a holographic sheen
- 📖 **3D page-flip animation** in pure CSS — no framer-motion, no Tailwind, zero runtime dependencies
- ♿ Keyboard navigation, screen-reader labels, and `prefers-reduced-motion` support
- 🎨 Fully themeable: override any cover, ink color, font, or label

## Install

```bash
npm install react-travel-passport
```

## Quick start

```tsx
import { Passport } from "react-travel-passport";
import "react-travel-passport/styles.css";

export function TravelHistory() {
  return (
    <Passport
      country="US"
      holder={{ name: "A. Traveler", number: "X1224588" }}
      stamps={[
        { country: "JP", place: "Tokyo — Narita", date: "12 MAY 2023", kind: "entry" },
        { country: "JP", place: "Osaka — Kansai", date: "26 MAY 2023", kind: "exit" },
        { country: "FR", place: "Paris — CDG", date: "3 SEP 2023", kind: "entry" },
      ]}
      visas={[
        {
          country: "IN",
          type: "e-Tourist",
          number: "IN-ET-48122",
          issued: "2 APR 2024",
          expires: "1 APR 2025",
          entries: "Multiple",
        },
      ]}
    />
  );
}
```

The identity page, stamp pages (auto-paginated), visa pages, and covers are all
generated from your data.

## `<Passport />` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `country` | `string` | `"world"` | ISO 3166-1 alpha-2 code selecting a built-in cover preset (`"US"`, `"JP"`, `"GB"`, …). |
| `cover` | `CoverTheme` | — | Merge overrides onto the preset: `title`, `word`, `topLine`, `emblem`, `background`, `foil`, `accent`, `inside`. |
| `holder` | `Holder` | — | Identity page data: `name`, `number`, `nationality`, `dateOfBirth`, `issued`, `expires`, `photo` (URL or ReactNode), extra `fields`. |
| `stamps` | `Stamp[]` | `[]` | Ink stamps, auto-scattered across pages. |
| `visas` | `Visa[]` | `[]` | Full-page visa stickers, one per page. |
| `stampsPerPage` | `1–4` | `3` | Pagination density. |
| `notice` | `string` | built-in | Text on the inside cover. |
| `backCredit` | `string` | — | Credit line on the back cover. |
| `showControls` | `boolean` | `true` | Prev/next arrows + dot navigation. |
| `showStatus` | `boolean` | `true` | Caption under the book. |
| `defaultOpen` | `boolean` | `false` | Start on the first spread instead of the closed cover. |
| `labels` | `PassportLabels` | — | Override any UI copy (also useful for i18n). |

### `Stamp`

```ts
{
  country?: string;   // "JP" — drives the default label + name
  place: string;      // "Tokyo — Narita"
  date: string;       // rendered as given
  kind?: "entry" | "exit" | "transit" | "visit";  // drives ink color + status word
  shape?: "round" | "oval" | "rect" | "arrow" | "dater"; // default: deterministic pick
  label?: string;     // override "JAPAN · IMMIGRATION"
  status?: string;    // override "ADMITTED"
  ink?: string;       // any CSS color
  rotate?: number;    // degrees
}
```

Unset shapes, inks, and rotations are picked **deterministically** from the
stamp's content, so the same data always renders the same passport.

### `Visa`

```ts
{
  country?: string;   // issuing state — colors the sticker header + seal
  type: string;       // "B-2 · Visitor"
  title?: string;     // header word, default "VISA"
  number?: string; holder?: string; issued?: string; expires?: string;
  entries?: string;   // "Multiple"
  remarks?: string;
  accent?: string;    // override header color
  emblem?: EmblemName; // override the foil-seal emblem
}
```

## Standalone pieces

The stamps and stickers work outside the book too:

```tsx
import { PassportStamp, VisaSticker } from "react-travel-passport";

<PassportStamp stamp={{ country: "BR", place: "São Paulo", date: "8 JAN 2024" }} />
<VisaSticker visa={{ country: "US", type: "B-2 · Visitor", number: "US-90311" }} />
```

## Theming

Covers can be fully custom — no preset required:

```tsx
<Passport
  cover={{
    title: "REPUBLIC OF ADVENTURE",
    word: "PASSPORT",
    emblem: "globe", // or any ReactNode (your own SVG)
    background: "linear-gradient(168deg, #4a3f6b, #2c2545)",
    foil: "#e5d491",
    accent: "#4a3f6b",
  }}
/>
```

Fonts and paper colors are CSS custom properties on `.rtp-root`:

```css
.rtp-root {
  --rtp-font-serif: "Playfair Display", serif;
  --rtp-paper-hi: #fdfaf3;
  --rtp-paper-lo: #f4eee1;
}
```

Note: the country presets are stylized approximations with generic line-art
emblems — no official coats of arms or government insignia are reproduced.

## Development

```bash
pnpm install
pnpm dev        # demo playground at localhost:5173
pnpm typecheck
pnpm build      # emits dist/ (esm + cjs + d.ts + styles.css)
pnpm demo:build # builds the demo site (deployed at react-travel-passport.vercel.app)
```

## Roadmap

- Custom pages API (`pages` prop for arbitrary spreads)
- More cover presets & emblems
- Optional world-map endpaper
- SSR-friendly static (no-flip) rendering mode

## License

MIT © Anthony Young
