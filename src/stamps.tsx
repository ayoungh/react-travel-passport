import { useId, type CSSProperties, type ReactElement } from "react";
import type { Stamp, StampKind, StampShape } from "./types";
import { countryName, jitter, pick } from "./util";

const INKS: Record<StampKind, readonly string[]> = {
  entry: ["#3f5b7a", "#56705c", "#3f6e68", "#4d5e7a"],
  exit: ["#8a4f43", "#7c3d4a", "#8a6c3c"],
  transit: ["#6b5877", "#55517e"],
  visit: ["#3f6e68", "#5a6b78"],
};

const STATUS: Record<StampKind, string> = {
  entry: "Admitted",
  exit: "Departed",
  transit: "Transit",
  visit: "Visited",
};

const SHAPES: readonly StampShape[] = ["round", "oval", "rect", "arrow", "dater"];

export interface ResolvedStamp {
  key: string;
  shape: StampShape;
  kind: StampKind;
  ink: string;
  rotate: number;
  place: string;
  date: string;
  status: string;
  label: string;
}

export function resolveStamp(stamp: Stamp, index: number): ResolvedStamp {
  const seed = stamp.id ?? `${stamp.place}|${stamp.date}|${index}`;
  const kind = stamp.kind ?? "entry";
  const country = countryName(stamp.country);
  return {
    key: seed,
    kind,
    shape: stamp.shape ?? pick(SHAPES, seed + "shape"),
    ink: stamp.ink ?? pick(INKS[kind], seed + "ink"),
    rotate: stamp.rotate ?? jitter(seed + "rot", 9),
    place: stamp.place,
    date: stamp.date,
    status: stamp.status ?? STATUS[kind],
    label: stamp.label ?? (country ? `${country} · Immigration` : "Immigration"),
  };
}

const inkStyle = (stamp: ResolvedStamp): CSSProperties =>
  ({
    color: stamp.ink,
    "--rtp-stamp-rotate": `${stamp.rotate}deg`,
  }) as CSSProperties;

function RoundStamp({ stamp }: { stamp: ResolvedStamp }) {
  const id = useId();
  const name = stamp.place;
  return (
    <svg viewBox="0 0 120 120" className="rtp-stamp-round" aria-hidden="true">
      <circle cx="60" cy="60" r="57.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="60" cy="60" r="33.5" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <defs>
        <path id={`${id}-top`} d="M 17.5 60 A 42.5 42.5 0 0 1 102.5 60" />
        <path id={`${id}-bottom`} d="M 17.5 60 A 42.5 42.5 0 0 0 102.5 60" />
      </defs>
      <text fill="currentColor" fontSize="7.6" fontWeight="700" letterSpacing="2">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {stamp.label.toUpperCase()}
        </textPath>
      </text>
      <text fill="currentColor" fontSize="7.6" fontWeight="700" letterSpacing="2">
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          {`· ${stamp.status.toUpperCase()} ·`}
        </textPath>
      </text>
      <circle cx="17.5" cy="60" r="1.6" fill="currentColor" />
      <circle cx="102.5" cy="60" r="1.6" fill="currentColor" />
      <text
        x="60"
        y="57"
        textAnchor="middle"
        fill="currentColor"
        fontWeight="800"
        letterSpacing="0.8"
        fontSize={name.length > 9 ? 8.4 : 11.5}
      >
        {name.toUpperCase()}
      </text>
      <line x1="42" y1="62.5" x2="78" y2="62.5" stroke="currentColor" strokeWidth="0.7" />
      <text x="60" y="71.5" textAnchor="middle" fill="currentColor" fontSize="7.2" fontWeight="600" letterSpacing="1.4">
        {stamp.date.toUpperCase()}
      </text>
    </svg>
  );
}

function OvalStamp({ stamp }: { stamp: ResolvedStamp }) {
  const id = useId();
  const name = stamp.place;
  return (
    <svg viewBox="0 0 150 96" className="rtp-stamp-oval" aria-hidden="true">
      <ellipse cx="75" cy="48" rx="71" ry="44" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="75" cy="48" rx="66" ry="39" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <defs>
        <path id={`${id}-top`} d="M 16 48 A 59 32 0 0 1 134 48" />
        <path id={`${id}-bottom`} d="M 16 48 A 59 32 0 0 0 134 48" />
      </defs>
      <text fill="currentColor" fontSize="7" fontWeight="700" letterSpacing="1.8">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {stamp.label.toUpperCase()}
        </textPath>
      </text>
      <text fill="currentColor" fontSize="7" fontWeight="700" letterSpacing="1.8">
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          {`· ${stamp.status.toUpperCase()} ·`}
        </textPath>
      </text>
      <circle cx="16" cy="48" r="1.4" fill="currentColor" />
      <circle cx="134" cy="48" r="1.4" fill="currentColor" />
      <text
        x="75"
        y="47.5"
        textAnchor="middle"
        fill="currentColor"
        fontWeight="800"
        letterSpacing="0.8"
        fontSize={name.length > 11 ? 7.8 : 9.6}
      >
        {name.toUpperCase()}
      </text>
      <line x1="52" y1="52.5" x2="98" y2="52.5" stroke="currentColor" strokeWidth="0.6" />
      <text x="75" y="61" textAnchor="middle" fill="currentColor" fontSize="6.6" fontWeight="600" letterSpacing="1.3">
        {stamp.date.toUpperCase()}
      </text>
    </svg>
  );
}

function RectStamp({ stamp }: { stamp: ResolvedStamp }) {
  return (
    <div className="rtp-stamp-rect">
      <div className="rtp-stamp-rect-inner">
        <p className="rtp-stamp-rect-label">« {stamp.label} »</p>
        <p className="rtp-stamp-rect-name">{stamp.place}</p>
        <p className="rtp-stamp-rect-meta">
          {stamp.status} · {stamp.date}
        </p>
      </div>
    </div>
  );
}

function ArrowStamp({ stamp }: { stamp: ResolvedStamp }) {
  const flip = stamp.kind === "exit";
  return (
    <svg
      viewBox="0 0 176 66"
      className="rtp-stamp-arrow"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path d="M 3 3 H 143 L 172 33 L 143 63 H 3 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M 8 8 H 140.5 L 164.5 33 L 140.5 58 H 8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 2.2"
        strokeLinejoin="round"
      />
      <g style={flip ? { transform: "scaleX(-1)", transformOrigin: "88px 33px" } : undefined}>
        <text x="76" y="19" textAnchor="middle" fill="currentColor" fontSize="6.8" fontWeight="700" letterSpacing="2">
          {stamp.place.toUpperCase()}
        </text>
        <text x="76" y="39" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="800" letterSpacing="1">
          {stamp.date.toUpperCase()}
        </text>
        <text x="76" y="53" textAnchor="middle" fill="currentColor" fontSize="6.4" fontWeight="600" letterSpacing="1.6">
          {flip ? `« ${stamp.status.toUpperCase()}` : `${stamp.status.toUpperCase()} »`}
        </text>
      </g>
    </svg>
  );
}

function DaterStamp({ stamp }: { stamp: ResolvedStamp }) {
  return (
    <div className="rtp-stamp-dater">
      <p className="rtp-stamp-dater-top">
        {stamp.place} · {stamp.date}
      </p>
      <p className="rtp-stamp-dater-bottom">
        {stamp.label} · {stamp.status}
      </p>
    </div>
  );
}

/**
 * A single ink stamp. Usable standalone anywhere in your app:
 * `<PassportStamp stamp={{ place: "Tokyo — Narita", date: "12 MAY 2023", country: "JP" }} />`
 */
export function PassportStamp({
  stamp,
  index = 0,
  className,
  style,
}: {
  stamp: Stamp;
  index?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const resolved = resolveStamp(stamp, index);
  const bodies: Record<StampShape, ReactElement> = {
    round: <RoundStamp stamp={resolved} />,
    oval: <OvalStamp stamp={resolved} />,
    rect: <RectStamp stamp={resolved} />,
    arrow: <ArrowStamp stamp={resolved} />,
    dater: <DaterStamp stamp={resolved} />,
  };
  return (
    <div
      className={["rtp-stamp", `rtp-stamp--${resolved.shape}`, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...inkStyle(resolved), ...style }}
    >
      {bodies[resolved.shape]}
      <span className="rtp-sr-only">
        {`${resolved.label}: ${resolved.place}, ${resolved.status}, ${resolved.date}`}
      </span>
    </div>
  );
}
