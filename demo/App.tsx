import { useState } from "react";
import {
  COUNTRY_COVERS,
  Passport,
  type Stamp,
  type Visa,
} from "react-travel-passport";
import "react-travel-passport/styles.css";

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

const coverOptions = Object.keys(COUNTRY_COVERS);

export function App() {
  const [country, setCountry] = useState("world");

  return (
    <div className="demo">
      <header className="demo-header">
        <h1>react-travel-passport</h1>
        <p>
          A configurable passport book for React — country covers, entry &amp;
          exit stamps, and visa stickers. Click the cover, flip the pages.
        </p>
        <label className="demo-picker">
          Cover
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            {coverOptions.map((code) => (
              <option key={code} value={code}>
                {COUNTRY_COVERS[code].title}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main className="demo-stage">
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
      </main>

      <footer className="demo-footer">
        <code>npm install react-travel-passport</code>
      </footer>
    </div>
  );
}
