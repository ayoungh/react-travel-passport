/** Small deterministic hash so stamps scatter the same way on every render. */
export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pick<T>(arr: readonly T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

/** -max..max degrees, deterministic. */
export function jitter(seed: string, max: number): number {
  return ((hash(seed) % (max * 20 + 1)) - max * 10) / 10;
}

let displayNames: Intl.DisplayNames | undefined;

export function countryName(code?: string): string {
  if (!code) return "";
  try {
    displayNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export const mrzClean = (value: string, len: number) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9<]/g, "<")
    .padEnd(len, "<")
    .slice(0, len);

/** Two machine-readable-zone lines in the style of a real TD3 passport. */
export function mrzLines(opts: {
  name: string;
  number?: string;
  nationality?: string;
}): [string, string] {
  const surnameish = opts.name.trim().replace(/\s+/g, "<");
  const nat = mrzClean(opts.nationality ?? "UTO", 3);
  const line1 = mrzClean(`P<${nat}${surnameish}<<`, 44);
  const line2 = mrzClean(
    `${opts.number ?? "XXXXXXXXX"}<${nat}${"<".repeat(8)}TRAVEL<PASSPORT`,
    44,
  );
  return [line1, line2];
}
