import {
  ColumnDef, ColumnDefIf, FalseFn, TrueFn, allRight, bodyLeft,
  px80, px100, px110, px120, px130, px160, px180, px200
} from "@guiexpert/table";
import { Order } from "../data/orders";

// Episode 020 – own comparators: names by locale ("Müller" before "Nordlicht"), status by workflow.
const STATUS_ORDER: Order["status"][] = ["open", "paid", "shipped", "cancelled"];
const byLocale = (a: string, b: string) => a.localeCompare(b, "de");
const rank = (s: Order["status"]) => STATUS_ORDER.indexOf(s);

// Episode 013 – property, header label, width, alignment per column.
export const ORDER_COLUMNS: ColumnDefIf[] = [
  new ColumnDef("id", "ID", px80, allRight),
  new ColumnDef("date", "Date", px110),                       // ISO dates sort correctly as text
  ColumnDef.create({ property: "customer", headerLabel: "Customer", width: px180,
    bodyClasses: ["ge-table-text-align-left"], sortable: TrueFn, sortComparator: byLocale }),
  new ColumnDef("country", "Country", px130, bodyLeft),
  new ColumnDef("city", "City", px110, bodyLeft),
  new ColumnDef("product", "Product", px160, bodyLeft),
  ColumnDef.create({ property: "category", headerLabel: "Category", isVisible: FalseFn }),
  new ColumnDef("quantity", "Qty", px80, allRight),
  ColumnDef.create({
    property: "price", headerLabel: "Price", width: px100,
    minWidth: px80, maxWidth: px200, sortable: TrueFn,
    headerClasses: ["ge-table-text-align-right"],
    bodyClasses: ["ge-table-text-align-right"]
  }),
  ColumnDef.create({ property: "status", headerLabel: "Status", width: px110,
    sortable: TrueFn, sortComparator: (a, b) => rank(a) - rank(b) }),
  ColumnDef.create({ property: "total", headerLabel: "Total", width: px120, sortable: TrueFn, sortState: "desc",
    headerClasses: ["ge-table-text-align-right"], bodyClasses: ["ge-table-text-align-right"] })
];

// Episode 020 – all other columns sortable too (double-click on the header: asc → desc → asc …).
// ColumnDef.create() needs `sortable` in its parameters, otherwise the sort icon stays hidden.
for (const column of ORDER_COLUMNS) column.sortable ??= TrueFn;
