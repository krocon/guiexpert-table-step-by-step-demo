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

---

## Folge 005 – Die erste Tabelle in Plain TypeScript

Vier Bausteine: Host-`<div>`, Tabellenmodell, Optionen, `TableScope` (`src/main.ts`).

```ts
import { EventAdapter, SimpleDomService, TableFactory, TableOptions, TableScope } from "@guiexpert/table";
import { createOrders } from "./data/orders";

const orders = createOrders(100_000);
const host = document.querySelector<HTMLDivElement>(".table-div")!;
const tableModel = TableFactory.createTableModel({ rows: orders });
const options = { ...new TableOptions() };
const tableScope = new TableScope(
  host, tableModel, new SimpleDomService(), options, new EventAdapter());
tableScope.firstInit();
tableScope.getApi().scrollToIndex(0, 50_000);   // Spalte 0, Zeile 50.000
```

Ohne `columnDefs` werden die Keys der ersten Zeile zu Spalten, die Überschrift ist der Key in Großbuchstaben
(eigene Spalten: Folge 012/013).

```bash
npm run dev   # → http://localhost:5173/   ·  /?rows=1000000   ·  /?scrollTo=50000
```

| | Naive Tabelle (Folge 001) | GuiExpert Table |
|---|---:|---:|
| 100.000 Zeilen – DOM-Elemente | 1.200.014 | ≈ 1.150 |
| 100.000 Zeilen – bis zur ersten Anzeige | > 2 min | 0,16 s |
| 1.000.000 Zeilen – bis zur ersten Anzeige | – | 1,6 s (davon das meiste: Testdaten erzeugen) |

(Chromium headless, Linux-VM.) Nur sichtbare Zeilen **und** Spalten landen im DOM – von 11 Spalten sind bei
1.400 px Breite 7 gerendert.

---

## Folge 006 – Ohne Framework: Web Component und CDN

`@guiexpert/webcomponent-table` macht die Tabelle zum Custom Element – nutzbar in jeder HTML-Seite und in jedem Framework.

```ts
// web-component/main.ts
import { GuiexpertTable } from "@guiexpert/webcomponent-table";

customElements.define("guiexpert-table", GuiexpertTable);   // das Paket registriert sich nicht selbst
const table = document.querySelector<GuiexpertTable>("guiexpert-table")!;
table.addEventListener("tableReady", (e) => console.log((e as CustomEvent<TableApi>).detail));
table.data = { tableModel: createOrderTableModel(), tableOptions: { ...new TableOptions() } };
```

- Das Element braucht `display: block` und eine Höhe.
- Events (`tableReady`, `mouseClicked`, `selectionChanged` …) kommen als **bubbling `CustomEvent`**, Nutzlast in `detail`.
- Erst den Listener registrieren, dann `data` setzen – `tableReady` feuert sofort.

**Ganz ohne npm und Build:** `public/cdn/index.html` lädt Stylesheet und Module per Import-Map von jsDelivr.

```bash
npm run dev   # → http://localhost:5173/web-component/   und   http://localhost:5173/cdn/
```

---

## Folge 007 – GuiExpert Table in React

Ein Workspace pro Framework unter `frameworks/` – alle nutzen **dasselbe** Modell aus `src/model/order-table.ts`.

```bash
npm i                 # einmal im Wurzelordner, installiert alle Workspaces
npm run dev:react     # → http://localhost:5173/
```

```tsx
// frameworks/react/src/App.tsx
const model = useMemo(() => createOrderTableModel(rows), [rows]);
const options = useMemo(() => ({ ...new TableOptions() }), []);

<GuiexpertTable tableModel={model} tableOptions={options}
                tableReady={onReady} mouseClicked={onClick} />
```

- Ein **neues** `tableModel`- oder `tableOptions`-Objekt baut die Tabelle neu auf (ab 18.1.86) – darum `useMemo`.
  Der Knopf oben schaltet zwischen 100.000 und 1.000 Zeilen um: neues Modell → neue Tabelle, `tableReady` feuert erneut.
- Callbacks als Props: `tableReady`, `mouseClicked`, `selectionChanged`, `contextmenu`, `modelChanged` …
- Typen der Callbacks (`(evt) => void`) ab `@guiexpert/react-table@18.1.88`.

---

## Folge 008 – GuiExpert Table in Vue 3

```bash
npm run dev:vue       # → http://localhost:5173/
```

```vue
<!-- frameworks/vue/src/App.vue -->
<GuiexpertTable
  :tableModel="tableModel"
  :tableOptions="tableOptions"
  @tableReady="onReady"
  @mouseClicked="onClick" />
```

- Modell und Optionen sind normale Objekte – kein `ref()` nötig (die Tabelle hält ihren Zustand selbst).
- Events sind Vue-Events (`@tableReady`, `@mouseClicked`, `@selectionChanged` …), Nutzlast direkt als Argument.
- `mouseClicked` ist um `debounceMouseClickDelay` (Standard 150 ms) entprellt, damit ein Doppelklick nicht zwei Klicks meldet.
- Global registrieren statt importieren: `app.use(GuiexpertTablePlugin)` (Default-Export von `@guiexpert/vue3-table`).

---

## Folge 009 – GuiExpert Table in Angular 14 bis 22

```bash
npm run dev:angular   # → http://localhost:4200/   (Angular CLI 22 braucht Node ≥ 22.22.3)
```

```ts
// frameworks/angular/src/app/app.ts
readonly rows = signal(100_000);
readonly model = computed(() => createOrderTableModel(this.rows()));
```
```html
<guiexpert-table class="table-div" [tableModel]="model()" [tableOptions]="options"
                 (tableReady)="onReady($event)" (mouseClicked)="onClick($event)" />
```

- Paket-Major = Angular-Major: `npm i @guiexpert/angular-table@22` (für Angular 17: `@17` bzw. Dist-Tag `a17`).
  Ein Quellcode, neun Builds (Angular 14–22).
- `TableComponent` ist standalone, `OnPush`, rendert außerhalb der Angular-Zone; das Tabellen-CSS ist eingebaut.
- Ein neues Modell (hier per `computed()` aus einem Signal) baut die Tabelle neu auf (`ngOnChanges`, ab 1.1.86).
- Das Element braucht `display: block` und eine Höhe (`src/styles.css`).
