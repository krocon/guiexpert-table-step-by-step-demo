import {
  ColumnDef, ColumnDefIf, FalseFn, allRight, bodyLeft,
  px80, px100, px110, px120, px130, px160, px180, px200
} from "@guiexpert/table";

// Episode 013 – property, header label, width, alignment per column.
export const ORDER_COLUMNS: ColumnDefIf[] = [
  new ColumnDef("id", "ID", px80, allRight),
  new ColumnDef("date", "Date", px110),
  new ColumnDef("customer", "Customer", px180, bodyLeft),
  new ColumnDef("country", "Country", px130, bodyLeft),
  new ColumnDef("city", "City", px110, bodyLeft),
  new ColumnDef("product", "Product", px160, bodyLeft),
  ColumnDef.create({ property: "category", headerLabel: "Category", isVisible: FalseFn }),
  new ColumnDef("quantity", "Qty", px80, allRight),
  ColumnDef.create({
    property: "price", headerLabel: "Price", width: px100,
    minWidth: px80, maxWidth: px200,
    headerClasses: ["ge-table-text-align-right"],
    bodyClasses: ["ge-table-text-align-right"]
  }),
  new ColumnDef("status", "Status", px110),
  new ColumnDef("total", "Total", px120, allRight)
];
