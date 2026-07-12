"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { resolveCover } from "./countries";
import {
  BackCover,
  BlankPage,
  CoverFront,
  CoverInside,
  IdentityPage,
  PageFace,
  StampsPage,
  VisaPage,
} from "./pages";
import type { PassportProps, Stamp } from "./types";

const PAGE_W = 300;
const PAGE_H = 430;
const SPREAD_W = PAGE_W * 2;

const DEFAULT_NOTICE =
  "This passport is the property of its holder. May every page fill with somewhere new.";

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="rtp-nav-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

interface InteriorPage {
  node: ReactNode;
  label: string;
}

export function Passport({
  country,
  cover: coverOverrides,
  holder = { name: "The Traveler" },
  stamps = [],
  visas = [],
  stampsPerPage = 3,
  notice = DEFAULT_NOTICE,
  backCredit,
  showControls = true,
  showStatus = true,
  defaultOpen = false,
  labels,
  className,
}: PassportProps) {
  const cover = useMemo(
    () => resolveCover(country, coverOverrides),
    [country, coverOverrides],
  );

  const text = {
    closed: labels?.closed ?? "Closed",
    identity: labels?.identity ?? "Identity",
    stamps: labels?.stamps ?? "Stamps",
    visas: labels?.visas ?? "Visas",
    end: labels?.end ?? "The end",
    stampPageTitle: labels?.stampPageTitle ?? "Visas",
    visaPageTitle: labels?.visaPageTitle ?? "Visas",
    hintOpen: labels?.hintOpen ?? "Click the passport to open it",
    hintEnd: labels?.hintEnd ?? "The end · Click the cover to reopen",
  };

  /* ------------------------------ page building ----------------------------- */

  const pages = useMemo<InteriorPage[]>(() => {
    const list: InteriorPage[] = [];
    let pageNo = 1;
    const num = () => String(++pageNo).padStart(2, "0");

    list.push({
      label: text.identity,
      node: <IdentityPage holder={holder} cover={cover} title={text.identity} />,
    });

    const stampChunks = chunk<Stamp>(stamps, Math.max(1, Math.min(4, stampsPerPage)));
    stampChunks.forEach((chunkStamps, i) => {
      list.push({
        label: stampChunks.length > 1 ? `${text.stamps} ${i + 1}` : text.stamps,
        node: (
          <StampsPage
            stamps={chunkStamps}
            pageNumber={num()}
            pageIndex={i}
            title={text.stampPageTitle}
            footnote={
              i === stampChunks.length - 1 ? "Stamps continue with your travels" : undefined
            }
          />
        ),
      });
    });

    visas.forEach((visa, i) => {
      list.push({
        label: visas.length > 1 ? `${text.visas} ${i + 1}` : text.visas,
        node: (
          <VisaPage visa={visa} pageNumber={num()} index={i} title={text.visaPageTitle} />
        ),
      });
    });

    // Interior page count must be odd so the final sheet's back is the back cover.
    if (list.length % 2 === 0) {
      list.push({
        label: text.end,
        node: (
          <BlankPage
            pageNumber={num()}
            title={text.stampPageTitle}
            cover={cover}
            note="Reserved for journeys ahead"
          />
        ),
      });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holder, cover, stamps, visas, stampsPerPage, labels]);

  const sheetCount = (pages.length + 1) / 2 + 1;

  /* -------------------------------- book state ------------------------------ */

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [flipped, setFlipped] = useState(defaultOpen ? 1 : 0);
  const [activeSheet, setActiveSheet] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const atStart = flipped === 0;
  const atEnd = flipped === sheetCount;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / (SPREAD_W + 32)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(sheetCount, next));
    if (clamped === flipped) return;
    setActiveSheet(clamped > flipped ? flipped : clamped);
    setFlipped(clamped);
  };

  /* ------------------------------- pointer tilt ------------------------------ */

  const tiltRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !tiltRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current.style.setProperty("--rtp-tilt-y", `${(x * 10).toFixed(2)}deg`);
    tiltRef.current.style.setProperty("--rtp-tilt-x", `${(-y * 8).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    tiltRef.current?.style.setProperty("--rtp-tilt-y", "0deg");
    tiltRef.current?.style.setProperty("--rtp-tilt-x", "0deg");
  };

  /* --------------------------------- sheets --------------------------------- */

  const sheets: { front: ReactNode; back: ReactNode; isCover?: boolean; isBackCover?: boolean }[] =
    useMemo(() => {
      const sheetsInit: { front: ReactNode; back: ReactNode; isCover?: boolean; isBackCover?: boolean }[] = [];

      sheetsInit.push({
        isCover: true,
        front: (
          <CoverFront
            cover={cover}
            onOpen={() => goTo(1)}
            openLabel={`Open the ${cover.title} passport`}
            hint="Click to open"
          />
        ),
        back: (
          <CoverInside
            cover={cover}
            notice={notice}
            onClose={() => goTo(0)}
            closeLabel="Close the passport"
          />
        ),
      });

      const interiorSheets = (pages.length + 1) / 2;
      for (let k = 1; k <= interiorSheets; k++) {
        const frontPage = pages[2 * k - 2];
        const backPage = pages[2 * k - 1];
        const isLast = k === interiorSheets;
        sheetsInit.push({
          isBackCover: isLast,
          front: (
            <PageFace
              side="right"
              onClick={() => goTo(k + 1)}
              ariaLabel={isLast ? "Close the passport on its back cover" : "Turn the page forward"}
            >
              {frontPage.node}
            </PageFace>
          ),
          back: isLast ? (
            <BackCover
              cover={cover}
              credit={backCredit}
              onReopen={() => goTo(sheetCount - 1)}
              reopenLabel="Reopen the passport"
            />
          ) : (
            <PageFace side="left" onClick={() => goTo(k)} ariaLabel="Turn the page back">
              {backPage.node}
            </PageFace>
          ),
        });
      }
      return sheetsInit;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages, cover, notice, backCredit, sheetCount]);

  /* ------------------------------ status labels ----------------------------- */

  const positionLabels = useMemo(() => {
    const labelsOut: string[] = [text.closed];
    for (let p = 1; p < sheetCount; p++) {
      labelsOut.push(pages[2 * p - 2]?.label ?? text.stamps);
    }
    labelsOut.push(text.end);
    return labelsOut;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, sheetCount, labels]);

  const status = atStart ? text.hintOpen : atEnd ? text.hintEnd : positionLabels[flipped];

  /* ---------------------------------- render --------------------------------- */

  const pos = atStart ? "start" : atEnd ? "end" : "open";

  return (
    <div
      ref={containerRef}
      className={["rtp-root", className].filter(Boolean).join(" ")}
      data-pos={pos}
      style={{ "--rtp-accent": cover.accent } as CSSProperties}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") goTo(flipped + 1);
        if (event.key === "ArrowLeft") goTo(flipped - 1);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="rtp-stage" style={{ height: (PAGE_H + 46) * scale }}>
        <div
          className="rtp-perspective"
          style={{
            width: SPREAD_W,
            height: PAGE_H,
            transform: `translateX(-50%) scale(${scale})`,
          }}
        >
          <div className="rtp-shift">
            <div ref={tiltRef} className="rtp-tilt">
              <div className="rtp-glow" aria-hidden="true" />
              <div className="rtp-ground-shadow" aria-hidden="true" />

              <div className="rtp-edges rtp-edges--right" aria-hidden="true">
                {[10, 6, 3].map((offset, i) => (
                  <div
                    key={offset}
                    className="rtp-edge rtp-edge--right"
                    style={{ top: 3 + i * 1.5, bottom: 3 + i * 1.5, width: PAGE_W - 4 + offset }}
                  />
                ))}
              </div>
              <div className="rtp-edges rtp-edges--left" aria-hidden="true">
                {[10, 6, 3].map((offset, i) => (
                  <div
                    key={offset}
                    className="rtp-edge rtp-edge--left"
                    style={{ top: 3 + i * 1.5, bottom: 3 + i * 1.5, width: PAGE_W - 4 + offset }}
                  />
                ))}
              </div>

              {sheets.map((sheet, index) => {
                const isFlipped = index < flipped;
                const zIndex =
                  activeSheet === index ? 60 : isFlipped ? 30 + index : 20 - index;
                return (
                  <div
                    key={index}
                    className={[
                      "rtp-sheet",
                      sheet.isCover || sheet.isBackCover ? "rtp-sheet--cover" : "",
                      isFlipped ? "rtp-sheet--flipped" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{ width: PAGE_W, zIndex }}
                    onTransitionEnd={(event) => {
                      if (event.propertyName !== "transform") return;
                      setActiveSheet((current) => (current === index ? null : current));
                    }}
                  >
                    <div
                      className={[
                        "rtp-sheet-face rtp-sheet-face--front",
                        sheet.isCover ? "rtp-sheet-face--coverfront" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {sheet.front}
                    </div>
                    <div
                      className={[
                        "rtp-sheet-face rtp-sheet-face--back",
                        sheet.isCover || sheet.isBackCover ? "rtp-sheet-face--coverback" : "",
                        sheet.isBackCover ? "rtp-sheet-face--backcover" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {sheet.back}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="rtp-controls">
          <button
            type="button"
            onClick={() => goTo(flipped - 1)}
            disabled={atStart}
            aria-label="Previous page"
            className="rtp-nav"
          >
            <Chevron direction="left" />
          </button>

          <div className="rtp-dots" role="presentation">
            {positionLabels.map((label, index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${label.toLowerCase()}`}
                className={index === flipped ? "rtp-dot rtp-dot--active" : "rtp-dot"}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(flipped + 1)}
            disabled={atEnd}
            aria-label="Next page"
            className="rtp-nav"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}

      {showStatus && (
        <p className="rtp-status" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}
