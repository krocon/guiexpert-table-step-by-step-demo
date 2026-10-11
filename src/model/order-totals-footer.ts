import { AreaModel, AreaModelObjectArray, ColumnDefIf } from "@guiexpert/table";
import { Order } from "../data/orders";

// Episode 016 – a footer that follows filter and sorting: it reads the rows the body currently shows.
export class OrderTotalsFooterModel extends AreaModel {
  constructor(
    private readonly getBody: () => AreaModelObjectArray<Order>,
    private readonly columnDefs: ColumnDefIf[]) {
    super();
    this.areaIdent = "footer";
  }
  override getRowCount(): number { return 1; }
  override getRowHeight(_rowIndex: number): number { return 34; }

  private cache?: { rows: Order[]; length: number; qty: number; total: number };

  override getValueAt(_rowIndex: number, columnIndex: number): any {
    const t = this.totals();
    switch (this.columnDefs[columnIndex]?.property) {     // by property, not by position
      case "customer": return `${t.length.toLocaleString("en")} orders`;
      case "quantity": return t.qty;
      case "total": return Math.round(t.total * 100) / 100;
    }
    return "";
  }

  // sum once per filter result, not once per repaint
  private totals() {
    const rows = this.getBody().getFilteredRows();
    if (this.cache?.rows !== rows || this.cache.length !== rows.length) {
      let qty = 0, total = 0;
      for (const o of rows) { qty += o.quantity; total += o.total; }
      this.cache = { rows, length: rows.length, qty, total };
    }
    return this.cache;
  }
}
