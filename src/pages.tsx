import type { CSSProperties, ReactNode } from "react";
import { Emblem } from "./emblems";
import { PassportStamp } from "./stamps";
import type { CoverTheme, Holder, Stamp, Visa } from "./types";
import { mrzLines } from "./util";
import { VisaSticker } from "./visa";

export function PageHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="rtp-page-heading">
      <span className="rtp-page-heading-title">{title}</span>
      <span className="rtp-page-heading-number">{number}</span>
    </div>
  );
}

function IdentityField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rtp-field">
      <p className="rtp-field-label">{label}</p>
      <p className="rtp-field-value">{value}</p>
    </div>
  );
}

/* --------------------------------- covers --------------------------------- */

export function CoverFront({
  cover,
  onOpen,
  openLabel,
  hint,
}: {
  cover: CoverTheme;
  onOpen: () => void;
  openLabel: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={openLabel}
      className="rtp-cover rtp-cover--front"
      style={{ background: cover.background, color: cover.foil }}
    >
      <div className="rtp-cover-frame rtp-cover-frame--front" aria-hidden="true" />
      {cover.topLine ? (
        <p className="rtp-cover-topline">{cover.topLine}</p>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="rtp-cover-center">
        <h3 className="rtp-cover-title">{cover.title}</h3>
        <Emblem emblem={cover.emblem} className="rtp-cover-emblem" />
        <p className="rtp-cover-word">{cover.word}</p>
      </div>
      <p className="rtp-cover-hint">{hint}</p>
    </button>
  );
}

export function CoverInside({
  cover,
  notice,
  onClose,
  closeLabel,
}: {
  cover: CoverTheme;
  notice: string;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={closeLabel}
      className="rtp-cover-inside"
      style={{ background: cover.inside ?? cover.accent, color: cover.foil }}
    >
      <p className="rtp-cover-inside-top">{cover.word}</p>
      <div className="rtp-cover-inside-center">
        <Emblem emblem={cover.emblem} className="rtp-cover-inside-emblem" />
        <p className="rtp-cover-inside-notice">{notice}</p>
      </div>
      <p className="rtp-cover-inside-bottom">Page 01 · Notice</p>
    </button>
  );
}

export function BackCover({
  cover,
  credit,
  onReopen,
  reopenLabel,
}: {
  cover: CoverTheme;
  credit?: string;
  onReopen: () => void;
  reopenLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onReopen}
      aria-label={reopenLabel}
      className="rtp-cover rtp-cover--back"
      style={{ background: cover.background, color: cover.foil }}
    >
      <div className="rtp-cover-frame rtp-cover-frame--back" aria-hidden="true" />
      <p className="rtp-cover-topline">{cover.word}</p>
      <Emblem emblem={cover.emblem} className="rtp-cover-emblem rtp-cover-emblem--back" />
      <div className="rtp-cover-back-credit">
        {credit && <p className="rtp-cover-back-credit-line">{credit}</p>}
        <p className="rtp-cover-hint rtp-cover-hint--back">Click to reopen</p>
      </div>
    </button>
  );
}

/* ---------------------------------- pages --------------------------------- */

export function IdentityPage({
  holder,
  cover,
  title,
}: {
  holder: Holder;
  cover: CoverTheme;
  title: string;
}) {
  const [mrz1, mrz2] = mrzLines({
    name: holder.name,
    number: holder.number,
    nationality: holder.nationality,
  });
  const fields: { label: string; value: string }[] = [
    { label: "Holder", value: holder.name },
    ...(holder.nationality ? [{ label: "Nationality", value: holder.nationality }] : []),
    ...(holder.dateOfBirth ? [{ label: "Date of birth", value: holder.dateOfBirth }] : []),
    ...(holder.issued ? [{ label: "Date of issue", value: holder.issued }] : []),
    ...(holder.expires ? [{ label: "Date of expiry", value: holder.expires }] : []),
    ...(holder.fields ?? []),
  ];

  return (
    <div className="rtp-page rtp-page--identity">
      <PageHeading number="01" title={title} />
      <div className="rtp-identity-top">
        <div className="rtp-identity-photo">
          {typeof holder.photo === "string" ? (
            <img src={holder.photo} alt={holder.name} className="rtp-identity-photo-img" />
          ) : (
            holder.photo ?? (
              <Emblem emblem={cover.emblem} className="rtp-identity-photo-emblem" />
            )
          )}
        </div>
        <div className="rtp-identity-meta">
          <IdentityField label="Type" value="P" />
          {holder.number && <IdentityField label="Passport no." value={holder.number} />}
        </div>
      </div>
      <div className="rtp-identity-grid">
        {fields.map((field) => (
          <IdentityField key={field.label} label={field.label} value={field.value} />
        ))}
      </div>
      <div className="rtp-mrz">
        <p>{mrz1}</p>
        <p>{mrz2}</p>
      </div>
    </div>
  );
}

/** Deterministic scatter slots, alternating layouts for visual variety. */
const SLOT_LAYOUTS: CSSProperties[][][] = [
  // one stamp
  [[{ top: "26%", left: "12%" }], [{ top: "30%", right: "8%" }]],
  // two stamps
  [
    [{ top: "6%", left: "4%" }, { bottom: "14%", right: "2%" }],
    [{ top: "8%", right: "2%" }, { bottom: "12%", left: "4%" }],
  ],
  // three stamps
  [
    [{ top: "3%", left: "2%" }, { top: "33%", right: "0%" }, { bottom: "4%", left: "8%" }],
    [{ top: "4%", right: "0%" }, { top: "34%", left: "2%" }, { bottom: "3%", right: "6%" }],
  ],
  // four stamps
  [
    [
      { top: "2%", left: "2%" },
      { top: "24%", right: "0%" },
      { bottom: "22%", left: "4%" },
      { bottom: "0%", right: "4%" },
    ],
    [
      { top: "2%", right: "2%" },
      { top: "24%", left: "0%" },
      { bottom: "22%", right: "4%" },
      { bottom: "0%", left: "4%" },
    ],
  ],
];

export function StampsPage({
  stamps,
  pageNumber,
  pageIndex,
  title,
  footnote,
}: {
  stamps: Stamp[];
  pageNumber: string;
  pageIndex: number;
  title: string;
  footnote?: string;
}) {
  const layoutsForCount = SLOT_LAYOUTS[Math.min(stamps.length, 4) - 1];
  const slots = layoutsForCount[pageIndex % layoutsForCount.length];
  return (
    <div className="rtp-page">
      <PageHeading number={pageNumber} title={title} />
      <div className="rtp-stamps-area">
        {stamps.map((stamp, i) => (
          <PassportStamp
            key={stamp.id ?? `${stamp.place}-${stamp.date}-${i}`}
            stamp={stamp}
            index={pageIndex * 4 + i}
            className="rtp-stamps-slot"
            style={slots[Math.min(i, slots.length - 1)]}
          />
        ))}
        {footnote && <p className="rtp-stamps-footnote">{footnote}</p>}
      </div>
    </div>
  );
}

export function VisaPage({
  visa,
  pageNumber,
  index,
  title,
}: {
  visa: Visa;
  pageNumber: string;
  index: number;
  title: string;
}) {
  return (
    <div className="rtp-page">
      <PageHeading number={pageNumber} title={title} />
      <div className="rtp-visa-page-body">
        <VisaSticker visa={visa} index={index} />
        {visa.issued && (
          <p className="rtp-visa-affixed">Affixed {visa.issued}</p>
        )}
      </div>
    </div>
  );
}

export function BlankPage({
  pageNumber,
  title,
  cover,
  note,
}: {
  pageNumber: string;
  title: string;
  cover: CoverTheme;
  note: string;
}) {
  return (
    <div className="rtp-page">
      <PageHeading number={pageNumber} title={title} />
      <div className="rtp-blank-body">
        <Emblem emblem={cover.emblem} className="rtp-blank-emblem" />
        <p className="rtp-blank-note">{note}</p>
      </div>
    </div>
  );
}

/* ------------------------------- page face -------------------------------- */

export function PageFace({
  side,
  onClick,
  ariaLabel,
  children,
}: {
  side: "left" | "right";
  onClick?: () => void;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const className = `rtp-face rtp-face--${side}`;
  if (!onClick) {
    return (
      <div className={className}>
        <div className={`rtp-face-spine rtp-face-spine--${side}`} aria-hidden="true" />
        {children}
      </div>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={`${className} rtp-face--button`}>
      <div className={`rtp-face-spine rtp-face-spine--${side}`} aria-hidden="true" />
      {children}
    </button>
  );
}
