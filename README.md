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

---

## Folge 010 – Ein Modell, jedes Framework

Alle Demos unter `frameworks/` zeigen **dasselbe** Modell (`src/model/order-table.ts`) – nur die Event-Syntax unterscheidet sich:

| Framework | Paket | Events |
|---|---|---|
| Plain TS | `@guiexpert/table` | `EventAdapter` / eigener `EventListenerIf` |
| Web Component | `@guiexpert/webcomponent-table` | `addEventListener("tableReady", e => e.detail)` |
| React / Preact / Solid | `@guiexpert/react-table` / `preact-table` / `solid-table` | Props `tableReady={api => …}` |
| Vue 3 | `@guiexpert/vue3-table` | `@tableReady="onReady"` |
| Svelte 4 / 5 | `@guiexpert/svelte-table` | `on:tableReady` bzw. Svelte 5: `onTableReady={api => …}` |
| Angular 14–22 | `@guiexpert/angular-table@NN` | `(tableReady)="onReady($event)"` |

```bash
npm run dev:svelte   # Svelte 5 (Runes)
npm run dev:solid
npm run dev:preact
```

Solid: `resolve.dedupe: ["solid-js"]` in `vite.config.ts` – sonst landen zwei Solid-Laufzeiten im Bundle
(App und Wrapper), und die Tabelle startet nicht.

---

## Folge 011 – Das TableModel: drei mal drei Bereiche

Ein `TableModel` besteht aus **drei Area-Modellen** – `header`, `body`, `footer` – und den Spalten.
Jede Zeile ist zusätzlich in **west** (links fixiert), **center** (scrollt) und **east** (rechts fixiert) geteilt → 9 Bereiche.

```
           west      center (scrollt)      east
header   ┌───────┬────────────────────────┬───────┐
body     │       │                        │       │
footer   └───────┴────────────────────────┴───────┘
```

Ein Area-Modell beantwortet nur Fragen – `getRowCount()`, `getValueAt(row, col)`, `getRowHeight(row)` –
darum kann die Tabelle nur die sichtbaren Zellen abfragen (`src/model/describe-model.ts`, Ausgabe oben in der Leiste):

```ts
const body = tableModel.getAreaModel("body");
body.getRowCount();       // 100000
body.getValueAt(0, 2);    // "Dupont SA"
```

---

## Folge 012 – Array<T> → TableModel

```ts
// src/model/order-table-model.ts
const ORDER_PROPERTIES: (keyof Order)[] =
  ["id", "date", "customer", "country", "product", "quantity", "total", "status"];

export function createOrdersModel(orders: Order[]): TableModelIf {
  return TableFactory.createTableModel({ rows: orders, properties: ORDER_PROPERTIES });
}
```

1. Nur `rows` → jeder Key der ersten Zeile wird eine Spalte (Folge 005).
2. `properties` → Auswahl **und** Reihenfolge der Spalten.
3. `(keyof Order)[]` → ein Tippfehler im Spaltennamen ist ein Compile-Fehler.
4. Überschrift = Property in Großbuchstaben – eigene Überschriften, Breiten und Ausrichtung: Folge 013 (`ColumnDef`).

Weitere Fabrik-Methoden: `TableFactory.buildByTypedRows<T>(rows, columnDefs, options)`, `createByObjectArray`, `createByAreaModels`.

---

## Folge 013 – Spalten definieren mit ColumnDef

```ts
// src/model/order-columns.ts
new ColumnDef("customer", "Customer", px180, bodyLeft),           // property, Überschrift, Breite, CSS-Klassen
new ColumnDef("total", "Total", px120, allRight),                 // Zahlen rechtsbündig (Header + Body + Footer)
ColumnDef.create({ property: "category", headerLabel: "Category", isVisible: FalseFn }),   // ausgeblendet
ColumnDef.create({ property: "price", headerLabel: "Price", width: px100, minWidth: px80, maxWidth: px200, … }),
```

- Breiten als Konstanten `px0` … `px500`, Ausrichtung mit `bodyLeft`, `bodyRight`, `allRight` …
- `ColumnDef.create({ … })` mit benannten Parametern für alles Weitere (Renderer, Sortierung, Editieren …).
- Spalte ausblenden: `isVisible: FalseFn` (die API-Methode `setColumnVisible` ist noch ein leerer Stub).
- Mit eigenen Spalten: `TableFactory.buildByTypedRows<Order>(orders, ORDER_COLUMNS)`.

---

## Folge 014 – Array of Arrays: Header, Body und Footer als Daten

Keine Objekte nötig – jeder Bereich ist ein zweidimensionales Array (hier aus `public/data/orders.csv`):

```ts
// csv/csv-table.ts
const [header, ...rows] = await loadCsv("/data/orders.csv");
const tableModel = TableFactory.createTableModel({
  headerData: [header],
  bodyData: rows,
  footerData: [totalsRow(rows)],
  columnSizes: [70, 110, 160, 120, 110, 150, 110, 70, 90, 100, 100]
});
```

- `headerData` / `footerData` dürfen mehrere Zeilen haben (Folge 015/016), Werte sind Strings.
- `columnSizes` statt `ColumnDef`s, wenn nur die Breiten zählen.

```bash
npm run dev   # → http://localhost:5173/csv/
```

---

## Folge 015 – Header-Modelle: mehrzeilig und gruppiert

Der Header ist ein eigenes Area-Modell. `AreaModelCellGroups` baut aus einer Gruppen-Beschreibung einen
mehrzeiligen Header; Gruppen mit `toggle: true` lassen sich per ❯ auf- und zuklappen (`header-groups/header-groups.ts`):

```ts
const groups: CellGroupIf[] = [
  { data: "Customer", toggle: true, children: [
    { data: "Customer", property: "customer", visibility: "always" },   // bleibt beim Zuklappen
    { data: "Country", property: "country" },
    { data: "City", property: "city" }] },
  …
];
const columnDefs = CellgroupFactory.buildColumnDefs(CellgroupFactory.buildGroupExts(groups));
const header = new AreaModelCellGroups("header", groups, columnDefs, 34);
const body = new AreaModelObjectArrayWithColumndefs<Order>("body", orders, columnDefs, 34);
```

Einfacher ohne Gruppen: mehrere Zeilen per `headerData: [[…], […]]` (Folge 014).
Beim Auf-/Zuklappen bleiben die Spaltenbreiten erst ab `@guiexpert/table@1.1.88` erhalten.

```bash
npm run dev   # → http://localhost:5173/header-groups/
```

---

## Folge 016 – Footer-Modelle: Summen und Kennzahlen

Der Footer ist ein eigenes `AreaModel`. `OrderTotalsFooterModel` (`src/model/order-totals-footer.ts`) liest
die Zeilen, die der Body **gerade zeigt** (`getFilteredRows()`), und summiert Menge und Gesamtbetrag –
der Footer folgt also Filter und Sortierung (Folge 021):

```ts
export class OrderTotalsFooterModel extends AreaModel {
  override getRowCount() { return 1; }
  override getValueAt(_row: number, col: number) {
    const t = this.totals();                 // einmal pro Filterergebnis gerechnet
    if (col === 2) return `${t.length} orders`;
    if (col === 7) return t.qty;
    if (col === 10) return Math.round(t.total * 100) / 100;
    return "";
  }
}

const tableModel = TableFactory.createTableModel({
  rows: orders, columnDefs: ORDER_COLUMNS,
  footerAreaModel: new OrderTotalsFooterModel(() => tableModel.getBodyModel() as AreaModelObjectArray<Order>)
});
```

Spalten-Index = Position in `ORDER_COLUMNS` (versteckte Spalten zählen mit).

```bash
npm run dev   # → http://localhost:5173/
```

---

## Folge 017 – Eigenes AreaModel: zwei Millionen Zeilen ohne Array

Ein `AreaModel` muss nur Fragen beantworten. `TwoMillionRows` (`src/model/large-model.ts`) hat kein Array –
jeder Wert wird erst berechnet, wenn die Tabelle ihn für eine **sichtbare** Zelle braucht:

```ts
export class TwoMillionRows extends AreaModel {
  override getRowCount() { return 2_000_000; }
  override getRowHeight() { return 34; }
  override getConstantRowHeight() { return 34; }     // alle Zeilen gleich hoch → O(1) beim Scrollen
  override getValueAt(row: number, col: number) {
    if (col === 0) return row + 1;
    …
  }
}
const tableModel = TableFactory.createTableModel({ bodyAreaModel: new TwoMillionRows(), columnDefs });
```

Genauso lassen sich Daten seitenweise vom Server holen: `getValueAt()` liefert aus einem Cache und lädt fehlende
Seiten nach. `getConstantRowHeight()` gibt es ab `@guiexpert/table@1.1.85`.

```bash
npm run dev   # → http://localhost:5173/two-million/   (?rows=10000000 für 10 Mio.)
```

---

## Folge 018 – Spalten links und rechts fixieren

Fixierte Spalten gehören ins **Modell**, nicht in die Options. `createWideOrdersModel()`
(`src/model/order-wide-model.ts`) zeigt 41 Spalten – ID bleibt links, Total rechts stehen:

```ts
const tableModel = TableFactory.createTableModel({
  rows: widenOrders(orders),
  columnDefs: WIDE_COLUMNS,          // ID, …, 30 Monatsspalten, Total
  fixedLeftColumnCount: 1,           // west
  fixedRightColumnCount: 1,          // east
  footerAreaModel: new OrderTotalsFooterModel(() => …, WIDE_COLUMNS)
});
```

Das sind die Seiten `west` / `center` / `east` aus Folge 011 – in Header, Body **und** Footer.
Auch horizontal wird virtuell gerendert: nur sichtbare Spalten liegen im DOM.
Der Footer aus Folge 016 sucht seine Spalten jetzt über die Property statt über die Position.

```bash
npm run dev   # → http://localhost:5173/fixed-columns/
```

---

## Folge 019 – TableOptions: Verhalten und Optik

Optionen sind ein einfaches Objekt. Muster: alle Standardwerte übernehmen, nur Abweichungen setzen
(`src/model/order-table-options.ts`):

```ts
export function createOrderTableOptions(): TableOptionsIf {
  return {
    ...new TableOptions(),
    hoverColumnVisible: false,
    verticalBorderVisible: false,
    defaultRowHeights: { header: 40, body: 30, footer: 36 }
  };
}
const options = createOrderTableOptions();
const tableModel = createOrdersModel(orders, options);   // Zeilenhöhen gehen ins Modell
new TableScope(host, tableModel, new SimpleDomService(), options, new EventAdapter()).firstInit();
```

Der Button „auto-size columns“ ruft `tableApi.autoResizeColumns()`. Ab `@guiexpert/table@1.1.88` misst die
Methode den echten Text (inkl. Header und Footer) – vorher wurden Datum und Summen abgeschnitten.

```bash
npm run dev   # → http://localhost:5173/            (mit Options)
              # → http://localhost:5173/?defaults   (vorher: nur Standardwerte)
```

---

## Folge 020 – Sortieren per Doppelklick und mit eigenem Comparator

Sortiert wird per **Doppelklick** auf den Spaltenkopf (asc → desc → asc …). Pro Spalte (`src/model/order-columns.ts`):

```ts
const STATUS_ORDER = ["open", "paid", "shipped", "cancelled"];
ColumnDef.create({ property: "customer", …, sortable: TrueFn,
  sortComparator: (a, b) => a.localeCompare(b, "de") });          // „Müller“ vor „Nordlicht“
ColumnDef.create({ property: "status", …, sortable: TrueFn,
  sortComparator: (a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b) });
ColumnDef.create({ property: "total", …, sortable: TrueFn, sortState: "desc" });
```

- `sortState` setzt nur das Symbol – einmal passend sortieren: `tableModel.doSort([new SortItem(index, "desc")])`.
- `ColumnDef.create()` braucht `sortable` direkt in den Parametern, sonst bleibt das Sortier-Symbol unsichtbar.
- Per eigenem Button: `tableApi.sortByColumn("status")` – wie ein Doppelklick auf den Kopf (mit Symbol,
  ohne Richtung wird umgeschaltet; `sortByColumn("total", "desc")` setzt sie fest). Ab 1.1.90.
- Aus dem Code: `tableApi.sort((a, b) => b.date.localeCompare(a.date))` (Button „newest first“, mit Zeitmessung);
  nach Datenänderungen `tableApi.reSort()`.
- Die Sortierung ist stabil: erst Kunde, dann Status → innerhalb eines Status bleiben die Kunden sortiert.

```bash
npm run dev   # → http://localhost:5173/   (Doppelklick auf „Status“)
```

---

## Folge 021 – Filtern mit einer Live-Suche

Die Filter-UI gehört dir, die Tabelle fragt nur: „Diese Zeile zeigen?“ (`src/order-filter.ts`):

```ts
export const orderFilter = { text: "", minTotal: 0 };
export function matchesOrder(order: Order): boolean {
  if (order.total < orderFilter.minTotal) return false;
  const query = orderFilter.text.trim().toLowerCase();
  return !query || `${order.customer} ${order.country} ${order.city} ${order.product}`
    .toLowerCase().includes(query);
}

options.externalFilterFunction = matchesOrder;               // vor dem Start
search.addEventListener("input", () => {                     // bei jeder Eingabe
  orderFilter.text = search.value;
  tableApi.externalFilterChanged();
});
```

- Der Footer aus Folge 016 rechnet automatisch mit (`getFilteredRows()`).
- Ab `@guiexpert/table@1.1.88` bleibt beim Filtern die Sortierung erhalten (vorher fiel die Tabelle auf die
  Originalreihenfolge zurück, das Sortier-Symbol blieb aber stehen).

```bash
npm run dev   # → http://localhost:5173/?q=berlin
```

---

## Folge 022 – Zellen, Zeilen, Bereiche auswählen und kopieren

Ein Selection-Model pro Tabelle (`src/model/order-table-options.ts`):

```ts
const selectionModel = new SelectionModel("range", "multi");   // "cell" | "row" | "column" | "range"
return { ...new TableOptions(), getSelectionModel: () => selectionModel };
```

- Maus: ziehen = Bereich (ab 1.1.88), Shift-Klick = Bereich bis hierher, ⌘/Strg-Klick = weitere Zelle.
- Tastatur: ⌘/Strg+C kopiert, ⌘/Strg+A wählt alles, Pfeiltasten bewegen den Fokus.
- Event: `onSelectionChanged(model)` in `src/order-events.ts` (`class OrderEvents extends EventAdapter`).
- Button „copy“: `await tableApi.copyToClipboard()` – Text mit Tabs und Zeilenumbrüchen, passt direkt in Excel.
  Versteckte Spalten (Category) werden ab 1.1.88 nicht mitkopiert.

```bash
npm run dev   # → http://localhost:5173/   (Bereich ziehen, dann „copy“)
```

---

## Folge 023 – Events und ein eigenes Kontextmenü

Events kommen über einen `EventAdapter` – nur überschreiben, was du brauchst (`src/order-events.ts`):

```ts
export class OrderEvents extends EventAdapter {
  override onMouseClicked(evt: GeMouseEvent) {           // rowIndex, columnIndex, areaIdent, clickCount
    if (evt.areaIdent === "body" && evt.clickCount === 2) this.onRowDoubleClick?.(evt.rowIndex);
  }
  override onContextmenu(evt: GeMouseEvent) {
    if (evt.areaIdent === "body" && evt.rowIndex > -1) this.onMenu?.(evt);
  }
}
```

Ein Kontextmenü ist nicht eingebaut – das eigene (`src/context-menu.ts`, ~30 Zeilen) sieht aus und arbeitet, wie du willst.
Die Aktionen nutzen die API:

```ts
showContextMenu(evt.originalEvent!, [
  { label: `Show order #${order.id}`, action: () => showOrder(order) },
  { label: "Copy selection", action: () => tableApi.copyToClipboard() },
  { label: `Only ${order.customer}`, action: () => { search.value = order.customer; filterChanged(); } },
  { label: "Export view as Excel", action: () => tableApi.downloadExcel("orders.xlsx", "GuiExpert") }
]);
```

`rowIndex` ist die **angezeigte** Zeile (nach Filter und Sortierung) → `tableModel.getBodyModel().getRowByIndex(rowIndex)`.
In den Framework-Wrappern heißen die Events `mouseClicked`, `contextmenu` … (Props bzw. Outputs).

```bash
npm run dev   # → http://localhost:5173/   (Doppelklick auf eine Zeile, Rechtsklick)
```

---

## Folge 024 – Excel-Export ohne Library

Der Core hat einen eigenen XLSX-Writer – keine Zusatz-Bibliothek. Zwei Wege (`src/order-excel.ts`):

```ts
// 1. die aktuelle Sicht: gefilterte Zeilen, aktuelle Sortierung, Header + Footer, sichtbare Spalten
tableApi.downloadExcel("orders-view.xlsx", "GuiExpert");

// 2. alle Daten, unabhängig von Filter und Sortierung – Spalten wählst du selbst
const body = tableApi.getBodyModel() as AreaModelObjectArray<Order>;
const matrix = [["ID", "Date", "Customer", "Country", "Category", "Total", "Status"],
  ...body.getAllRows().map(o => [o.id, o.date, o.customer, o.country, o.category, o.total, o.status])];
new ExcelService().downloadExcel(matrix, "orders-all.xlsx", "GuiExpert");
```

- Zahlen bleiben Zahlen, Text bleibt Text (Datum als ISO-Text).
- Die Summenzeile aus Folge 016 landet in Weg 1 automatisch mit im Export.
- Ab 1.1.86 gültige Dateien (CRC, Blattgröße); ab 1.1.88 ohne versteckte Spalten.
- Ab 1.1.90 komprimiert (DEFLATE über den eingebauten `CompressionStream`, ohne Library):
  100.000 Zeilen ≈ 3,9 MB statt 40 MB. `downloadExcel()` liefert jetzt ein Promise.

```bash
npm run dev   # → http://localhost:5173/?q=berlin   („xlsx: view“ und „xlsx: all“)
```

---

## Folge 025 – Zellen gestalten mit Cell-Renderern

Ein Renderer bestimmt, wie eine Zelle **aussieht** – der Wert bleibt gleich (Sortieren, Filter, Kopieren und Excel
arbeiten weiter mit dem Rohwert). `src/model/order-renderers.ts`:

```ts
export class StatusBadgeRenderer implements CellRendererIf {
  render(cellDiv, rowIndex, columnIndex, areaIdent, areaModel, cellValue, dom) {
    const badge = dom.createElement<HTMLSpanElement>("span");
    dom.addClass(badge, `status-${cellValue}`);
    badge.textContent = cellValue;
    dom.appendChild(cellDiv, badge);
    return undefined;                     // optional: Cleanup-Funktion
  }
}

column("date").rendererMap.body = new DateToLocaleDateCellRenderer();                  // eingebaut
column("quantity").rendererMap.body = new NumberCellProgressBarCellRenderer(20, false); // eingebaut
column("status").rendererMap.body = new StatusBadgeRenderer();                         // eigener
column("total").rendererMap.footer = new EuroRenderer();                               // auch im Footer
```

- Eingebaut u. a.: `NumberCellRenderer`, `ProgressBarCellRenderer`, `StarRatingCellRenderer`, `DateToLocaleDateCellRenderer`.
- Renderer werden nur für **sichtbare** Zellen aufgerufen.
- Ein eigenes Area-Modell (Footer aus Folge 016) wählt seine Renderer selbst: `getCellRenderer(row, col)`.
- Alternativ beim Anlegen: `ColumnDef.create({ …, bodyRenderer: new EuroRenderer() })`.

```bash
npm run dev   # → http://localhost:5173/
```

---

## Folge 026 – Framework-Komponenten als Zelle

Statt HTML von Hand: eine echte React- oder Angular-Komponente pro Zelle. Das gemeinsame Modell
(`src/model/order-table.ts`) nimmt dafür optional Renderer pro Property an.

**React** (`frameworks/react/src/StatusChip.tsx` – Hooks funktionieren):

```tsx
export function StatusChip({ cellValue }: { cellValue: string }) {
  const [hover, setHover] = useState(false);
  return <span className={`status-badge status-${cellValue}`} …>{cellValue}</span>;
}
const model = useMemo(() => createOrderTableModel(rows, {
  status: new ComponentRendererWrapper(StatusChip)
}), [rows]);
```

**Angular** (`frameworks/angular/src/app/status-chip.ts` – `ComponentRendererIf.setData()`):

```ts
export class StatusChip implements ComponentRendererIf<StatusChip> {
  readonly status = signal("");
  setData(rowIndex, columnIndex, areaIdent, areaModel, cellValue) { this.status.set(cellValue); return undefined; }
}
private readonly statusRenderer = inject(RenderWrapperFactory).create(StatusChip, inject(ChangeDetectorRef));
readonly model = computed(() => createOrderTableModel(this.rows(), { status: this.statusRenderer }));
```

Komponenten entstehen nur für **sichtbare** Zellen und werden beim Wegscrollen wieder abgebaut
(getestet: nach 20 Scroll-Schritten weiterhin 19 Komponenten im DOM). Vue, Svelte, Solid und Preact haben je einen
`ComponentRendererWrapper` im Wrapper-Paket.

```bash
npm run dev:react     # bzw. npm run dev:angular
```

---

## Folge 027 – Heatmap und bedingte Formatierung

Umsatz pro Stadt und Monat (aus den 100.000 Orders aggregiert), die Farbe kommt aus dem Wert
(`src/model/revenue-heatmap.ts`):

```ts
export class RevenueHeatmapModel extends AreaModelArrayOfArrays<string | number> {
  private readonly gradient = new ThreeColorGradientArg(
    min, new ColorRgb(255, 255, 255), mid, new ColorRgb(244, 114, 182), max, new ColorRgb(79, 70, 229));

  override getCustomStyleAt(rowIndex: number, columnIndex: number) {      // nur für sichtbare Zellen
    const value = Number(this.getValueAt(rowIndex, columnIndex));
    return { "background-color": GeCssColorUtil.getThreeColorGradientRGB(value, this.gradient) };
  }
}
```

- `getCustomStyleAt` → Inline-Styles, `getCustomClassesAt` → CSS-Klassen (z. B. `negative`, `overdue`).
- Farb-Helfer aus dem Core: `GeCssColorUtil.getTwoColorGradientRGB` / `getThreeColorGradientRGB`, `ColorRgb`.
- Header als `headerData`, Body als eigenes Modell, Stadt-Spalte fixiert (`fixedLeftColumnCount: 1`).

```bash
npm run dev   # → http://localhost:5173/heatmap/
```

---

## Folge 028 – Theming und Dark Mode mit CSS-Variablen

Alles an der Tabelle ist eine CSS-Variable (`--ge-table-*`, über 100 Stück). Eigener Look in `src/theme.css`,
geladen **nach** `@guiexpert/table/css/main.css`:

```css
html[data-theme="light"] {
  --ge-table-header-center-bg: #eef2ff;
  --ge-table-header-center-text: #3730a3;
  --ge-table-body-center-text: #111827;      /* sonst folgt der Body der Header-Farbe */
  --ge-table-row-even-bg: #fdf2f8;           /* Zebra */
  --ge-table-hover-row-bg: rgba(244, 114, 182, 0.18);
  --ge-table-focus-border: #db2777;
}
html[data-theme="dark"] { --ge-table-header-center-text: #f9a8d4; … }
```

Light und Dark sind eingebaut – umgeschaltet wird mit einem Attribut:
`document.documentElement.dataset.theme = "dark"` (Button „light / dark“, gemerkt in `localStorage`).
Alle Variablen: `node_modules/@guiexpert/table/css/table-color-vars.css`.

```bash
npm run dev   # → http://localhost:5173/?theme=dark
```
