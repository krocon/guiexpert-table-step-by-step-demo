import { AreaModel } from "@guiexpert/table";

// Episode 017 – a body without an array: every value is computed when the table asks for it.
const COUNTRIES = ["Germany", "Austria", "Switzerland", "France", "Italy", "Spain", "Poland", "Czechia"];
const STATUS = ["open", "paid", "shipped", "cancelled"];
const DAY = 86_400_000, START = Date.UTC(2020, 0, 1);

// cheap, deterministic "random" number per row and column (same row → same value, every time)
function hash(row: number, col: number): number {
  let h = Math.imul(row ^ (col << 24), 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  return (h ^ (h >>> 13)) >>> 0;
}

export class TwoMillionRows extends AreaModel {
  constructor(private readonly rows = 2_000_000) {
    super();
    this.areaIdent = "body";
  }
  override getRowCount(): number { return this.rows; }
  override getRowHeight(_rowIndex: number): number { return 34; }
  override getConstantRowHeight(): number { return 34; }   // all rows equally high → O(1) while scrolling

  override getValueAt(row: number, col: number): any {
    switch (col) {
      case 0: return row + 1;                                                        // ID
      case 1: return new Date(START + (row % 2_400) * DAY).toISOString().slice(0, 10); // date
      case 2: return COUNTRIES[hash(row, 2) % COUNTRIES.length];                       // country
      case 3: return (hash(row, 3) % 100_000) / 100;                                   // amount
      case 4: return STATUS[hash(row, 4) % STATUS.length];                             // status
    }
    return "";
  }
}
