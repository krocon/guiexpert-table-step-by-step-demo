import {
  ColumnDef, ColumnDefIf, TableApi, TableCellUpdateEvent, TableFactory, TableModelIf, allRight, bodyLeft, px100, px120, px200
} from "@guiexpert/table";

// Episode 032 – live data: prices change many times per second, only the changed cells are redrawn.

export interface Quote { symbol: string; name: string; price: number; change: number; volume: number }

const PREFIX = ["Nord", "Alpen", "Rhein", "Elbe", "Baltic", "Donau", "Main", "Isar"];
const SUFFIX = ["Tech", "Energy", "Logistics", "Pharma", "Bank", "Motors", "Foods", "Software"];

export function createQuotes(count: number): Quote[] {
  return Array.from({ length: count }, (_, i) => ({
    symbol: `GE${String(i + 1).padStart(4, "0")}`,
    name: `${PREFIX[i % PREFIX.length]} ${SUFFIX[(i * 7) % SUFFIX.length]} ${Math.floor(i / 64) + 1}`,
    price: Math.round((20 + ((i * 37) % 480) + (i % 100) / 100) * 100) / 100,
    change: 0,
    volume: (i * 7919) % 50_000
  }));
}

export const QUOTE_COLUMNS: ColumnDefIf[] = [
  new ColumnDef("symbol", "Symbol", px100, bodyLeft),
  new ColumnDef("name", "Name", px200, bodyLeft),
  new ColumnDef("price", "Price", px120, allRight),
  new ColumnDef("change", "Change %", px120, allRight),
  new ColumnDef("volume", "Volume", px120, allRight)
];

export function createQuoteModel(quotes: Quote[]): TableModelIf {
  return TableFactory.createTableModel({ rows: quotes, columnDefs: QUOTE_COLUMNS });
}

/** One tick: some quotes move – only their cells are updated. Returns the number of changed cells. */
export function tick(api: TableApi, quotes: Quote[], moves: number): number {
  const events: TableCellUpdateEvent[] = [];
  for (let n = 0; n < moves; n++) {
    const row = Math.floor(Math.random() * quotes.length);
    const q = quotes[row];
    const price = Math.max(1, Math.round(q.price * (1 + (Math.random() - 0.5) / 50) * 100) / 100);
    const change = Math.round((price - q.price) / q.price * 10000) / 100;
    const volume = q.volume + Math.floor(Math.random() * 500);
    const up = change >= 0;
    events.push(
      new TableCellUpdateEvent("body", row, 2, price, { "tick-up": up, "tick-down": !up }),
      new TableCellUpdateEvent("body", row, 3, change, { "tick-up": up, "tick-down": !up }),
      new TableCellUpdateEvent("body", row, 4, volume));
  }
  api.updateCells(events);              // writes the values into the model and redraws only these cells
  return events.length;
}
