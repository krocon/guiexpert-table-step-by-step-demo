import {
  type AreaIdent, type AreaModelIf, type CellRendererIf, ColumnDef, type ColumnDefIf, DateToLocaleDateCellRenderer,
  type DomServiceIf, FalseFn, NumberCellProgressBarCellRenderer, type RendererCleanupFnType, TrueFn,
  allRight, bodyLeft, px80, px100, px110, px120, px130, px160, px180, px200
} from "@guiexpert/table";
import type { Order } from "../data/orders";

/**
 * The order columns of the training (chapter 13), with the comparators of chapter 20.
 * A factory instead of a constant: the table writes column widths back into its ColumnDefs,
 * so every table gets its own array.
 */
export function createOrderColumns(options: { renderers?: boolean } = {}): ColumnDefIf[] {
  const STATUS_ORDER: Order["status"][] = ["open", "paid", "shipped", "cancelled"];
  const rank = (s: Order["status"]) => STATUS_ORDER.indexOf(s);
  const columns: ColumnDefIf[] = [
    new ColumnDef("id", "ID", px80, allRight),
    new ColumnDef("date", "Date", px120),
    ColumnDef.create({
      property: "customer", headerLabel: "Customer", width: px180,
      bodyClasses: ["ge-table-text-align-left"], sortable: TrueFn,
      sortComparator: (a: string, b: string) => a.localeCompare(b, "de")
    }),
    new ColumnDef("country", "Country", px130, bodyLeft),
    new ColumnDef("city", "City", px110, bodyLeft),
    new ColumnDef("product", "Product", px160, bodyLeft),
    ColumnDef.create({ property: "category", headerLabel: "Category", isVisible: FalseFn }),
    new ColumnDef("quantity", "Qty", px80, allRight),
    ColumnDef.create({
      property: "price", headerLabel: "Price", width: px100, minWidth: px80, maxWidth: px200, sortable: TrueFn,
      headerClasses: ["ge-table-text-align-right"], bodyClasses: ["ge-table-text-align-right"]
    }),
    ColumnDef.create({
      property: "status", headerLabel: "Status", width: px110, sortable: TrueFn,
      sortComparator: (a: Order["status"], b: Order["status"]) => rank(a) - rank(b)
    }),
    ColumnDef.create({
      property: "total", headerLabel: "Total", width: px120, sortable: TrueFn,
      headerClasses: ["ge-table-text-align-right"], bodyClasses: ["ge-table-text-align-right"]
    })
  ];
  for (const column of columns) column.sortable ??= TrueFn;
  if (options.renderers) applyOrderRenderers(columns);
  return columns;
}

/** Status as a coloured badge (chapter 25). */
export class StatusBadgeRenderer implements CellRendererIf {
  render(cellDiv: HTMLDivElement, _rowIndex: number, _columnIndex: number, _areaIdent: AreaIdent,
         _areaModel: AreaModelIf, cellValue: Order["status"], dom: DomServiceIf): RendererCleanupFnType | undefined {
    if (!cellValue) return undefined;
    const badge = dom.createElement<HTMLSpanElement>("span");
    dom.addClass(badge, "status-badge");
    dom.addClass(badge, `status-${cellValue}`);
    badge.textContent = cellValue;
    dom.appendChild(cellDiv, badge);
    return undefined;
  }
}

const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

/** Amount as euro (chapter 25). */
export class EuroRenderer implements CellRendererIf {
  render(cellDiv: HTMLDivElement, _rowIndex: number, _columnIndex: number, _areaIdent: AreaIdent,
         _areaModel: AreaModelIf, cellValue: number, dom: DomServiceIf): RendererCleanupFnType | undefined {
    const label = dom.createElement<HTMLDivElement>("div");
    dom.addClass(label, "ge-table-label");
    label.textContent = typeof cellValue === "number" ? EUR.format(cellValue) : "";
    dom.appendChild(cellDiv, label);
    return undefined;
  }
}

export function applyOrderRenderers(columns: ColumnDefIf[]): void {
  const column = (property: keyof Order) => columns.find(c => c.property === property)!;
  column("date").rendererMap.body = new DateToLocaleDateCellRenderer();
  column("quantity").rendererMap.body = new NumberCellProgressBarCellRenderer(20, false);
  column("status").rendererMap.body = new StatusBadgeRenderer();
  column("price").rendererMap.body = new EuroRenderer();
  column("total").rendererMap.body = new EuroRenderer();
  column("total").rendererMap.footer = new EuroRenderer();
}
