import type { FC, ReactNode } from "react";
import type { EmblemName } from "./types";

interface EmblemProps {
  className?: string;
}

const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const Globe: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <circle cx="24" cy="24" r="20" />
    <ellipse cx="24" cy="24" rx="8.5" ry="20" />
    <path d="M6.2 16 H41.8" strokeWidth="1" />
    <path d="M4 24 H44" strokeWidth="1" />
    <path d="M6.2 32 H41.8" strokeWidth="1" />
  </svg>
);

const Laurel: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <path d="M16 42 C9 34 8 22 14 10" />
    <path d="M32 42 C39 34 40 22 34 10" />
    <path d="M13.5 15 C10 14 8 12 7.5 9.5 C10.5 9.5 12.8 11 13.5 15 Z" />
    <path d="M12.5 23 C9 22.5 6.5 20.5 5.5 17.5 C9 17.5 11.6 19 12.5 23 Z" />
    <path d="M13 31 C9.5 31 6.8 29.5 5.5 26.5 C9 26 11.8 27.5 13 31 Z" />
    <path d="M15.5 38.5 C12 39 9 38 7 35.5 C10.3 34.5 13.3 35.5 15.5 38.5 Z" />
    <path d="M34.5 15 C38 14 40 12 40.5 9.5 C37.5 9.5 35.2 11 34.5 15 Z" />
    <path d="M35.5 23 C39 22.5 41.5 20.5 42.5 17.5 C39 17.5 36.4 19 35.5 23 Z" />
    <path d="M35 31 C38.5 31 41.2 29.5 42.5 26.5 C39 26 36.2 27.5 35 31 Z" />
    <path d="M32.5 38.5 C36 39 39 38 41 35.5 C37.7 34.5 34.7 35.5 32.5 38.5 Z" />
    <circle cx="24" cy="21" r="4.5" strokeWidth="1" />
  </svg>
);

const Bird: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <circle cx="24" cy="13" r="3" />
    <path d="M24 16.5 V33" />
    <path d="M24 20 C18 13 10 12 4 16 C9 18 12 21 13.5 25 C17 22.5 21 21 24 22.5" />
    <path d="M24 20 C30 13 38 12 44 16 C39 18 36 21 34.5 25 C31 22.5 27 21 24 22.5" />
    <path d="M19 38 L24 33 L29 38" />
    <path d="M20.5 41.5 L24 38 L27.5 41.5" strokeWidth="1" />
  </svg>
);

const Shield: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <path d="M24 5 L40 11 V25 C40 35 33 41.5 24 45 C15 41.5 8 35 8 25 V11 Z" />
    <path d="M24 7.5 V42.5" strokeWidth="0.9" />
    <path d="M10 23 H38" strokeWidth="0.9" />
    <circle cx="17" cy="15.5" r="2" strokeWidth="0.9" />
    <circle cx="31" cy="15.5" r="2" strokeWidth="0.9" />
    <path d="M15 31 C17 29 21 29 24 31 C27 29 31 29 33 31" strokeWidth="0.9" />
  </svg>
);

const Star: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <circle cx="24" cy="24" r="21" strokeWidth="1" />
    <polygon points="24,6 28.4,17.9 41.1,18.4 31.1,26.3 34.6,38.6 24,31.5 13.4,38.6 16.9,26.3 6.9,18.4 19.6,17.9" />
  </svg>
);

const Sun: FC<EmblemProps> = ({ className }) => {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return (
      <line
        key={i}
        x1={24 + 14 * Math.cos(a)}
        y1={24 + 14 * Math.sin(a)}
        x2={24 + 20 * Math.cos(a)}
        y2={24 + 20 * Math.sin(a)}
      />
    );
  });
  return (
    <svg viewBox="0 0 48 48" className={className} {...svgProps}>
      <circle cx="24" cy="24" r="9.5" />
      {rays}
    </svg>
  );
};

const Bloom: FC<EmblemProps> = ({ className }) => {
  const petals = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const x1 = 24 + 8 * Math.cos(a - 0.22);
    const y1 = 24 + 8 * Math.sin(a - 0.22);
    const x2 = 24 + 8 * Math.cos(a + 0.22);
    const y2 = 24 + 8 * Math.sin(a + 0.22);
    const tx = 24 + 20 * Math.cos(a);
    const ty = 24 + 20 * Math.sin(a);
    return (
      <path
        key={i}
        d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${tx.toFixed(1)} ${ty.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`}
      />
    );
  });
  return (
    <svg viewBox="0 0 48 48" className={className} {...svgProps}>
      <circle cx="24" cy="24" r="5" />
      {petals}
    </svg>
  );
};

/** The original therapy-passport leaf, kept for calm non-country passports. */
const Leaf: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 40 56" className={className} {...svgProps}>
    <path d="M20 3 C30.5 13 34 27 20 53 C6 27 9.5 13 20 3 Z" />
    <path d="M20 9 V47" />
    <path d="M20 20 C16 18 13.5 15.5 12.5 12.5" />
    <path d="M20 20 C24 18 26.5 15.5 27.5 12.5" />
    <path d="M20 30 C15.5 28 12.5 25 11.5 21.5" />
    <path d="M20 30 C24.5 28 27.5 25 28.5 21.5" />
    <path d="M20 40 C16.5 38.5 14.5 36 13.5 33" />
    <path d="M20 40 C23.5 38.5 25.5 36 26.5 33" />
  </svg>
);

const Wheel: FC<EmblemProps> = ({ className }) => {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return (
      <line
        key={i}
        x1={24 + 4.5 * Math.cos(a)}
        y1={24 + 4.5 * Math.sin(a)}
        x2={24 + 17 * Math.cos(a)}
        y2={24 + 17 * Math.sin(a)}
        strokeWidth="1"
      />
    );
  });
  return (
    <svg viewBox="0 0 48 48" className={className} {...svgProps}>
      <circle cx="24" cy="24" r="19" />
      <circle cx="24" cy="24" r="3" />
      {spokes}
    </svg>
  );
};

const Spiral: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <path d="M24 44 C13 44 6 36 6 26 C6 16 13 9 23 9 C31 9 37 15 37 23 C37 30 32 35 25 35 C19 35 15 31 15 25 C15 20 18.5 17 23 17 C26.5 17 29 19.5 29 23" />
  </svg>
);

const Cross: FC<EmblemProps> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} {...svgProps}>
    <circle cx="24" cy="24" r="21" strokeWidth="1" />
    <path d="M20 10 H28 V20 H38 V28 H28 V38 H20 V28 H10 V20 H20 Z" />
  </svg>
);

export const EMBLEMS: Record<EmblemName, FC<EmblemProps>> = {
  globe: Globe,
  laurel: Laurel,
  bird: Bird,
  shield: Shield,
  star: Star,
  sun: Sun,
  bloom: Bloom,
  leaf: Leaf,
  wheel: Wheel,
  spiral: Spiral,
  cross: Cross,
};

export function Emblem({
  emblem,
  className,
}: {
  emblem?: EmblemName | ReactNode;
  className?: string;
}) {
  if (emblem == null) return null;
  if (typeof emblem === "string" && emblem in EMBLEMS) {
    const Component = EMBLEMS[emblem as EmblemName];
    return <Component className={className} />;
  }
  return <span className={className}>{emblem}</span>;
}
