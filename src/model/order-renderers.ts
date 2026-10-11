import {
  AreaIdent, AreaModelIf, CellRendererIf, ColumnDefIf, DateToLocaleDateCellRenderer, DomServiceIf,
  NumberCellProgressBarCellRenderer, RendererCleanupFnType
} from "@guiexpert/table";
import { Order } from "../data/orders";

// Episode 025 – a renderer decides how a cell LOOKS. The value stays the same:
// sorting, filter, copy and Excel keep working with the raw value.

/** Status as a coloured badge – plain DOM, no innerHTML. */
export class StatusBadgeRenderer implements CellRendererIf {
  render(cellDiv: HTMLDivElement, _rowIndex: number, _columnIndex: number, _areaIdent: AreaIdent,
         _areaModel: AreaModelIf, cellValue: Order["status"], dom: DomServiceIf): RendererCleanupFnType | undefined {
    const badge = dom.createElement<HTMLSpanElement>("span");
    dom.addClass(badge, "status-badge");
    dom.addClass(badge, `status-${cellValue}`);
    badge.textContent = cellValue;
    dom.appendChild(cellDiv, badge);
    return undefined;                       // optional: a cleanup function, called before the cell is redrawn
  }
}

const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

/** Amount as euro, right-aligned. */
export class EuroRenderer implements CellRendererIf {
  render(cellDiv: HTMLDivElement, _rowIndex: number, _columnIndex: number, _areaIdent: AreaIdent,
         _areaModel: AreaModelIf, cellValue: number, dom: DomServiceIf): RendererCleanupFnType | undefined {
    const label = dom.createElement<HTMLDivElement>("div");
    dom.addClass(label, "ge-table-label");
    label.textContent = EUR.format(cellValue);
    dom.appendChild(cellDiv, label);
    return undefined;
  }
}

export function applyOrderRenderers(columns: ColumnDefIf[]): void {
  const column = (property: keyof Order) => columns.find(c => c.property === property)!;
  column("date").rendererMap.body = new DateToLocaleDateCellRenderer();               // built in
  column("quantity").rendererMap.body = new NumberCellProgressBarCellRenderer(20, false); // built in, max 20
  column("status").rendererMap.body = new StatusBadgeRenderer();                      // own
  column("price").rendererMap.body = new EuroRenderer();                              // own
  column("total").rendererMap.body = new EuroRenderer();
  column("total").rendererMap.footer = new EuroRenderer();                            // footer too
}
