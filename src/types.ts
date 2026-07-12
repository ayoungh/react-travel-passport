import type { ReactNode } from "react";

/** Built-in emblem line-art. Any of these can be used on covers, seals, and pages. */
export type EmblemName =
  | "globe"
  | "laurel"
  | "bird"
  | "shield"
  | "star"
  | "sun"
  | "bloom"
  | "leaf"
  | "wheel"
  | "spiral"
  | "cross";

export type StampShape = "round" | "oval" | "rect" | "arrow" | "dater";

export type StampKind = "entry" | "exit" | "transit" | "visit";

export interface Stamp {
  /** Stable key. Falls back to place + date. */
  id?: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "JP". Drives the default label. */
  country?: string;
  /** Port of entry / city, e.g. "Tokyo — Narita". */
  place: string;
  /** Display date. Rendered as given, e.g. "12 MAY 2023". */
  date: string;
  /** Defaults to "entry". Drives the default ink color and status word. */
  kind?: StampKind;
  /** Defaults to a shape picked deterministically per stamp. */
  shape?: StampShape;
  /** Override the arced/top label, e.g. "IMMIGRATION OFFICER 042". */
  label?: string;
  /** Override the status word, e.g. "ADMITTED". */
  status?: string;
  /** Override the ink color (any CSS color). */
  ink?: string;
  /** Override the rotation in degrees. */
  rotate?: number;
}

export interface Visa {
  id?: string;
  /** ISO country code of the issuing state. Drives header + default title. */
  country?: string;
  /** Header word, defaults to "VISA". */
  title?: string;
  /** Visa class, e.g. "B-2 · Tourist". */
  type: string;
  number?: string;
  holder?: string;
  issued?: string;
  expires?: string;
  /** e.g. "Multiple" */
  entries?: string;
  remarks?: string;
  /** Sticker header color (any CSS color). Defaults to the issuing country's cover color. */
  accent?: string;
  /** Emblem on the foil seal. */
  emblem?: EmblemName;
}

export interface Holder {
  name: string;
  /** Document number, e.g. "X1234567". */
  number?: string;
  nationality?: string;
  dateOfBirth?: string;
  issued?: string;
  expires?: string;
  /** Photo URL, or any ReactNode for a custom portrait. */
  photo?: string | ReactNode;
  /** Extra fields rendered on the identity page. */
  fields?: { label: string; value: string }[];
}

export interface CoverTheme {
  /** State name on the cover, e.g. "UNITED STATES OF AMERICA". */
  title: string;
  /** The word for "passport", e.g. "PASSEPORT". */
  word: string;
  /** Small line above the title, e.g. "EUROPEAN UNION". */
  topLine?: string;
  /** Built-in emblem name, or your own ReactNode (an SVG works best). */
  emblem?: EmblemName | ReactNode;
  /** Cover background — any CSS background value (gradients welcome). */
  background?: string;
  /** Foil / text color on the cover. */
  foil?: string;
  /** A solid color representing the cover; used for accents (dots, visa headers). */
  accent?: string;
  /** Inside-cover background. Defaults to a darkened accent. */
  inside?: string;
}

export interface PassportLabels {
  /** Dot-nav / status label when closed. Default "Closed". */
  closed?: string;
  identity?: string;
  stamps?: string;
  visas?: string;
  end?: string;
  /** Page heading on stamp pages. Default "VISAS". */
  stampPageTitle?: string;
  visaPageTitle?: string;
  hintOpen?: string;
  hintEnd?: string;
}

export interface PassportProps {
  /** ISO country code selecting a built-in cover preset, e.g. "US", "JP". */
  country?: string;
  /** Override any part of the cover theme (merged over the preset). */
  cover?: CoverTheme;
  holder?: Holder;
  stamps?: Stamp[];
  visas?: Visa[];
  /** 1–4 stamps per page. Default 3. */
  stampsPerPage?: 1 | 2 | 3 | 4;
  /** Text on the inside cover. */
  notice?: string;
  /** Line at the bottom of the back cover, e.g. your product name. */
  backCredit?: string;
  /** Show prev/next arrows + dot navigation. Default true. */
  showControls?: boolean;
  /** Show the status caption under the book. Default true. */
  showStatus?: boolean;
  /** Open the book on mount (skips the closed cover state). */
  defaultOpen?: boolean;
  /** Override UI copy. */
  labels?: PassportLabels;
  className?: string;
}
