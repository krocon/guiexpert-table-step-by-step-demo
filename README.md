# GuiExpert Table – Schritt für Schritt (Demo-App)

Demo-App zur Videoreihe **„GuiExpert Table Schritt für Schritt“** (60-Sekunden-Folgen, DE + EN).
Jede Folge hat einen eigenen Stand: `git checkout ep-NNN`.

- Bibliothek: [`@guiexpert/table`](https://www.npmjs.com/package/@guiexpert/table) – MIT, null Runtime-Abhängigkeiten
- Doku & Showcases: https://gui.expert
- Quellcode der Bibliothek: https://github.com/guiexperttable/mono

```bash
git clone https://github.com/krocon/guiexpert-table-step-by-step-demo.git
cd guiexpert-table-step-by-step-demo
git checkout ep-001        # Stand einer Folge
npm i
npm run dev                # → http://localhost:5173
```

Testdaten: `src/data/orders.ts` erzeugt beliebig viele Bestellungen (`createOrders(n)`), immer dieselben (fester Seed).

---

## Folge 001 – Warum große Tabellen den Browser lahmlegen

Die „naive“ Tabelle: 100.000 Bestellungen, für jede Zeile ein `<tr>`, für jeden Wert ein `<td>`.

```bash
npm run dev   # → http://localhost:5173/naive/
```

Oben rechts steht, wie lange das erste Zeichnen dauert und wie viele DOM-Elemente entstehen.
Ein Klick auf einen Spaltenkopf sortiert – und baut dabei **alle** Zellen neu.

Für schwächere Rechner: `/naive/?rows=10000`.

Gemessen in Chromium (headless, Linux-VM, Okt. 2026) – auf deinem Rechner sind die Zahlen kleiner, der Verlauf ist gleich:

| Zeilen | DOM-Elemente | erstes Rendern | Sortieren (alles neu) |
|---:|---:|---:|---:|
| 1.000 | 12.014 | 0,2 s | 0,2 s |
| 10.000 | 120.014 | 2,7 s | 2,9 s |
| 25.000 | 300.014 | 11,7 s | 11,9 s |
| 50.000 | 600.014 | 41,5 s | 44,4 s |
| 100.000 | 1.200.014 | > 2 min (Browser blockiert) | – |

Doppelt so viele Zeilen ≠ doppelt so lange: Layout und Speicher wachsen schneller als die Zeilenzahl.
Und das ist nur **anzeigen** – fixierte Spalten, Spaltenbreiten, Tastatur, Auswahl, Kopieren und Export fehlen noch.

---

## Folge 002 – Virtual Scrolling: nur zeichnen, was man sieht

Dasselbe Problem, der Trick jeder schnellen Tabelle – selbst gebaut in rund 20 Zeilen (`virtual/virtual-scroll.ts`):

1. Ein leerer **Spacer** ist so hoch wie *alle* Zeilen zusammen → der Browser zeigt eine echte Scrollbar.
2. Bei jedem Scrollen: erste sichtbare Zeile = `scrollTop / Zeilenhöhe`, Anzahl = Fensterhöhe / Zeilenhöhe.
3. Nur diese Zeilen kommen ins DOM, um `first * Zeilenhöhe` nach unten verschoben.

```bash
npm run dev   # → http://localhost:5173/virtual/   (oder /virtual/?rows=1000000)
```

| Zeilen | DOM-Elemente | Laden | Rendern pro Scroll-Schritt |
|---:|---:|---:|---:|
| 100.000 | ≈ 360 | 0,2 s | ≈ 1 ms |
| 1.000.000 | ≈ 360 | 1,1 s | ≈ 1 ms |

(Chromium headless, Linux-VM.) Die Zahl der DOM-Elemente hängt nur noch von der **Fensterhöhe** ab, nicht von der Datenmenge.

**Warum dann eine Bibliothek?** Die 20 Zeilen können nur vertikal scrollen. Es fehlen: horizontales Virtual Scrolling
(nur sichtbare *Spalten*), fixierte Spalten und Kopfzeilen, Spaltenbreiten, Sortieren, Filtern, Auswahl, Tastatur,
Kopieren, Export – und Browser-Grenzen: Bei 1 Mio. Zeilen à 30 px ist der Spacer schon 30 Mio. Pixel hoch, Chrome
erlaubt etwa 33 Mio., Firefox deutlich weniger. Die GuiExpert Table macht beides virtuell (Zeilen **und** Spalten)
und deckelt die Scrollhöhe, damit auch 2 Mio. Zeilen sauber laufen.

---

## Folge 003 – Selbst bauen, ag-Grid oder GuiExpert Table?

Kein neuer Code – eine Entscheidungshilfe. Stand Oktober 2026, Angaben zu ag-Grid laut
[ag-grid.com: Community vs. Enterprise](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/)
und [Licensing](https://www.ag-grid.com/javascript-data-grid/licensing/) – vor einer Entscheidung dort selbst prüfen.

| | Selbst bauen | ag-Grid Community | ag-Grid Enterprise | GuiExpert Table |
|---|---|---|---|---|
| Lizenz | deine | MIT, kostenlos | kommerziell, pro Entwickler; ohne Key Wasserzeichen | MIT, kostenlos – auch kommerziell |
| Virtual Scrolling | selbst (Folge 002) | ✔ | ✔ | ✔ Zeilen **und** Spalten |
| Excel-Export | selbst | – | ✔ | ✔ ohne Zusatz-Library |
| Bereichsauswahl & Clipboard | selbst | – | ✔ | ✔ |
| Server-Side Row Model | selbst | – | ✔ | – (eigenes Area-Modell, Folge 017) |
| Row Grouping / Pivot | selbst | – | ✔ | – (Baumtabelle, Folge 030) |
| Filter-UI | selbst | ✔ | ✔ | – (Filterfunktion, UI gehört dir – Folge 021) |
| Frameworks | – | React, Angular, Vue, JS | React, Angular, Vue, JS | Angular 14–22, React, Vue, Svelte 4/5, Solid, Preact, Web Component, JS |
| Laufzeit-Abhängigkeiten | – | – | – | keine |

**Faustregel:** Brauchst du Pivot, Row Grouping oder ein Server-Side Row Model von der Stange, ist ag-Grid Enterprise
heute weiter. Brauchst du große Datenmengen, Export, Auswahl und volle Kontrolle über HTML/CSS – ohne Lizenzkosten und
in jedem Framework –, ist die GuiExpert Table eine schlanke Alternative.

---

## Folge 004 – Installation in zwei Minuten

```bash
npm create vite@latest my-table -- --template vanilla-ts   # oder ein bestehendes Projekt
npm i @guiexpert/table
```

```ts
// src/main.ts
import "@guiexpert/table/css/main.css";   // Styles der Tabelle (ab 1.1.85 als Bare Import)
```

```css
/* src/style.css – der Container braucht eine feste Höhe: ohne sie zeigt die Tabelle nur die Kopfzeile */
.table-div { height: calc(100vh - 40px); }
```

Ohne Build-Tool: Stylesheet per CDN `https://cdn.jsdelivr.net/npm/@guiexpert/table/css/main.css`.

Null Laufzeit-Abhängigkeiten:

```text
$ npm ls --all --omit=dev
`-- @guiexpert/table@1.1.86
  `-- tslib@2.8.1
```
