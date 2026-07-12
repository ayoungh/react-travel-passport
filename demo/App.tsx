import { useState } from "react";
import {
  COUNTRY_COVERS,
  Passport,
  PassportStamp,
  VisaSticker,
  type Stamp,
  type Visa,
} from "react-travel-passport";
import "react-travel-passport/styles.css";

/* ----------------------------- sample data ------------------------------ */

const stamps: Stamp[] = [
  { country: "JP", place: "Tokyo — Narita", date: "12 MAY 2023", kind: "entry" },
  { country: "JP", place: "Osaka — Kansai", date: "26 MAY 2023", kind: "exit" },
  { country: "FR", place: "Paris — CDG", date: "3 SEP 2023", kind: "entry" },
  { country: "FR", place: "Paris — CDG", date: "17 SEP 2023", kind: "exit" },
  { country: "BR", place: "São Paulo — GRU", date: "8 JAN 2024", kind: "entry" },
  { country: "TH", place: "Bangkok", date: "22 FEB 2024", kind: "transit" },
  { country: "NZ", place: "Auckland", date: "1 MAR 2024", kind: "entry" },
  { country: "CH", place: "Zürich", date: "11 JUN 2024", kind: "visit" },
  { country: "MX", place: "Mexico City", date: "30 OCT 2024", kind: "entry" },
];

const visas: Visa[] = [
  {
    country: "IN",
    type: "e-Tourist",
    number: "IN-ET-48122",
    holder: "The Traveler",
    issued: "2 APR 2024",
    expires: "1 APR 2025",
    entries: "Multiple",
    remarks: "Valid for entry through designated airports only.",
  },
  {
    country: "US",
    type: "B-2 · Visitor",
    number: "US-B2-90311",
    holder: "The Traveler",
    issued: "15 JUL 2023",
    expires: "14 JUL 2033",
    entries: "Multiple",
    remarks: "Ten-year visitor visa. Duration of stay set at port of entry.",
  },
];

/* ----------------------------- code snippets ---------------------------- */

const quickStartCode = `import { Passport } from "react-travel-passport";
import "react-travel-passport/styles.css";

export function TravelHistory() {
  return (
    <Passport
      country="US" // 26 cover presets: "JP", "GB", "FR", "IN", "BR", …
      holder={{
        name: "A. Traveler",
        number: "X1224588",
        nationality: "Everywhere",
        issued: "12 MAY 2022",
        expires: "11 MAY 2032",
      }}
      stamps={[
        { country: "JP", place: "Tokyo — Narita", date: "12 MAY 2023", kind: "entry" },
        { country: "JP", place: "Osaka — Kansai", date: "26 MAY 2023", kind: "exit" },
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
}`;

const stampCode = `import { PassportStamp } from "react-travel-passport";

// Works anywhere — not just inside the book
<PassportStamp
  stamp={{
    country: "BR",          // drives the default label
    place: "São Paulo — GRU",
    date: "8 JAN 2024",
    kind: "entry",           // entry | exit | transit | visit → ink color + status
    shape: "oval",           // round | oval | rect | arrow | dater (default: auto)
    // label, status, ink, rotate — all overridable
  }}
/>`;

const visaCode = `import { VisaSticker } from "react-travel-passport";

<VisaSticker
  visa={{
    country: "US",           // colors the header band + foil seal
    type: "B-2 · Visitor",
    number: "US-B2-90311",
    issued: "15 JUL 2023",
    expires: "14 JUL 2033",
    entries: "Multiple",
    remarks: "Duration of stay set at port of entry.",
  }}
/>`;

const themingCode = `// No preset needed — design your own cover
<Passport
  cover={{
    title: "REPUBLIC OF ADVENTURE",
    word: "PASSPORT",
    emblem: "globe",         // 11 built-ins, or pass your own <svg>
    background: "linear-gradient(168deg, #4a3f6b, #2c2545)",
    foil: "#e5d491",
    accent: "#4a3f6b",
  }}
/>

/* Fonts & paper are CSS custom properties */
.rtp-root {
  --rtp-font-serif: "Playfair Display", serif;
  --rtp-paper-hi: #fdfaf3;
  --rtp-paper-lo: #f4eee1;
}`;

const passportProps: [string, string, string][] = [
  ["country", "string", 'Cover preset by ISO code — "US", "JP", "GB", … (default "world")'],
  ["cover", "CoverTheme", "Override any part of the cover: title, word, emblem, colors"],
  ["holder", "Holder", "Identity page: name, number, nationality, dates, photo URL or node"],
  ["stamps", "Stamp[]", "Ink stamps, auto-scattered and auto-paginated"],
  ["visas", "Visa[]", "Full-page visa stickers, one per page"],
  ["stampsPerPage", "1 – 4", "Pagination density (default 3)"],
  ["notice", "string", "Text on the inside cover"],
  ["backCredit", "string", "Credit line on the back cover"],
  ["defaultOpen", "boolean", "Start on the first spread instead of closed"],
  ["showControls / showStatus", "boolean", "Toggle arrows, dots, and the caption"],
  ["labels", "PassportLabels", "Override any UI copy — handy for i18n"],
];

/* --------------------------------- page ---------------------------------- */

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="demo-section" id={id}>
      <h2>{title}</h2>
      {lede && <p className="demo-lede">{lede}</p>}
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="demo-code">
      <code>{children}</code>
    </pre>
  );
}

export function App() {
  const [country, setCountry] = useState("world");

  return (
    <div className="demo">
      <header className="demo-header">
        <h1>react-travel-passport</h1>
        <p>
          A configurable, animated passport book for React. Show the places
          you&apos;ve been — country covers, ink entry &amp; exit stamps, and
          visa stickers in a 3D page-flipping booklet. Zero runtime
          dependencies.
        </p>
        <div className="demo-badges">
          <code className="demo-install">npm install react-travel-passport</code>
          <nav className="demo-links">
            <a href="https://github.com/ayoungh/react-travel-passport">GitHub</a>
            <a href="https://www.npmjs.com/package/react-travel-passport">npm</a>
          </nav>
        </div>
      </header>

      <main>
        <div className="demo-stage">
          <label className="demo-picker">
            Cover preset
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {Object.keys(COUNTRY_COVERS).map((code) => (
                <option key={code} value={code}>
                  {COUNTRY_COVERS[code].title}
                </option>
              ))}
            </select>
          </label>
          <p className="demo-hint">
            Click the cover to open it · flip pages with the arrows, dots, or
            arrow keys · hover the stamps and visa
          </p>
          <Passport
            key={country}
            country={country}
            holder={{
              name: "A. Traveler",
              number: "X1224588",
              nationality: "Everywhere",
              dateOfBirth: "01 JAN 1990",
              issued: "12 MAY 2022",
              expires: "11 MAY 2032",
            }}
            stamps={stamps}
            visas={visas}
            backCredit="react-travel-passport"
          />
        </div>

        <Section
          id="quick-start"
          title="Quick start"
          lede="Install the package, import the stylesheet once, and hand <Passport /> your travel data. The identity page, stamp pages, and visa pages are all generated for you."
        >
          <Code>{quickStartCode}</Code>
        </Section>

        <Section
          id="stamps"
          title="Stamps"
          lede="Five shapes — round, oval, rect, arrow, dater. Unset shapes, inks, and rotations are picked deterministically from the stamp's content, so the same data always renders the same passport. Entries ink blue-green, exits rust-red, like the real thing."
        >
          <div className="demo-swatches" aria-label="Stamp shape examples">
            <PassportStamp stamp={{ country: "JP", place: "Tokyo", date: "12 MAY 2023", kind: "entry", shape: "round", rotate: -6 }} />
            <PassportStamp stamp={{ country: "FR", place: "Paris — CDG", date: "17 SEP 2023", kind: "exit", shape: "oval", rotate: 4 }} />
            <PassportStamp stamp={{ country: "BR", place: "São Paulo", date: "8 JAN 2024", kind: "entry", shape: "arrow", rotate: -3 }} />
            <PassportStamp stamp={{ country: "TH", place: "Bangkok", date: "22 FEB 2024", kind: "transit", shape: "rect", rotate: 5 }} />
            <PassportStamp stamp={{ country: "NZ", place: "Auckland", date: "1 MAR 2024", kind: "visit", shape: "dater", rotate: -2 }} />
          </div>
          <Code>{stampCode}</Code>
        </Section>

        <Section
          id="visas"
          title="Visa stickers"
          lede="Full-page stickers with a country-colored header band, foil seal, machine-readable zone, and a holographic sheen on hover. One page per visa inside the book — or render them standalone."
        >
          <div className="demo-visa-row">
            <div className="demo-visa-example">
              <VisaSticker visa={visas[1]} />
            </div>
            <Code>{visaCode}</Code>
          </div>
        </Section>

        <Section
          id="theming"
          title="Covers & theming"
          lede="26 country presets (stylized colors and generic line-art emblems — no official insignia), or build a fully custom cover. Fonts and paper tones are plain CSS custom properties."
        >
          <Code>{themingCode}</Code>
        </Section>

        <Section id="props" title="<Passport /> props">
          <div className="demo-table-wrap">
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {passportProps.map(([prop, type, desc]) => (
                  <tr key={prop}>
                    <td><code>{prop}</code></td>
                    <td><code>{type}</code></td>
                    <td>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="demo-note">
            Keyboard navigation, screen-reader labels, and{" "}
            <code>prefers-reduced-motion</code> are supported out of the box.
            Full types ship with the package.
          </p>
        </Section>
      </main>

      <footer className="demo-footer">
        <p>
          MIT © Anthony Young ·{" "}
          <a href="https://github.com/ayoungh/react-travel-passport">
            github.com/ayoungh/react-travel-passport
          </a>
        </p>
      </footer>
    </div>
  );
}
