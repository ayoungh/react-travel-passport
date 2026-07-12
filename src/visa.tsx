import type { CSSProperties } from "react";
import { resolveCover } from "./countries";
import { Emblem } from "./emblems";
import type { Visa } from "./types";
import { countryName, jitter, mrzClean } from "./util";

function VisaField({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rtp-visa-field">
      <p className="rtp-visa-field-label">{label}</p>
      <p className={accent ? "rtp-visa-field-value rtp-visa-field-value--accent" : "rtp-visa-field-value"}>
        {value}
      </p>
    </div>
  );
}

/**
 * A full-page visa / permit sticker. Usable standalone:
 * `<VisaSticker visa={{ country: "IN", type: "e-Tourist", number: "VS-2210" }} />`
 */
export function VisaSticker({
  visa,
  index = 0,
  className,
  style,
}: {
  visa: Visa;
  index?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const cover = resolveCover(visa.country);
  const seed = visa.id ?? `${visa.type}|${visa.number ?? index}`;
  const accent = visa.accent ?? cover.accent ?? "#3c5a52";
  const name = countryName(visa.country);
  const title = visa.title ?? "Visa";
  const mrz1 = mrzClean(`V<${(name || "TRAVEL").replace(/\s+/g, "<")}<<${visa.type.replace(/\s+/g, "<")}`, 40);
  const mrz2 = mrzClean(
    `${visa.number ?? "0000000"}<<${(visa.entries ?? "SINGLE").replace(/\s+/g, "<")}<ENTRIES<<${(visa.expires ?? "").replace(/\s+/g, "<")}`,
    40,
  );

  return (
    <div
      className={["rtp-visa", className].filter(Boolean).join(" ")}
      style={
        {
          "--rtp-visa-accent": accent,
          "--rtp-visa-rotate": `${jitter(seed, 2.2)}deg`,
          ...style,
        } as CSSProperties
      }
    >
      <div className="rtp-visa-inner">
        <div className="rtp-visa-sheen" aria-hidden="true" />

        <div className="rtp-visa-header">
          <p className="rtp-visa-header-country">{name || "Travel Passport"}</p>
          <p className="rtp-visa-header-word">{title}</p>
        </div>

        <div className="rtp-visa-grid">
          <VisaField label="Visa type" value={visa.type} />
          {visa.number && <VisaField label="Visa no." value={visa.number} accent />}
          {visa.holder && <VisaField label="Holder" value={visa.holder} />}
          {visa.issued && <VisaField label="Issued" value={visa.issued} />}
          {visa.expires && <VisaField label="Valid until" value={visa.expires} />}
          {visa.entries && <VisaField label="Entries" value={visa.entries} />}
        </div>

        {visa.remarks && <p className="rtp-visa-remarks">Remarks: {visa.remarks}</p>}

        <div className="rtp-visa-seal" aria-hidden="true">
          <Emblem emblem={visa.emblem ?? cover.emblem} className="rtp-visa-seal-emblem" />
        </div>

        <div className="rtp-visa-mrz">
          <p>{mrz1}</p>
          <p>{mrz2}</p>
        </div>
      </div>
    </div>
  );
}
