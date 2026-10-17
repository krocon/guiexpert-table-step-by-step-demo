// Chapter 39 – calculated columns, „Show values as“ and formulas (since 1.1.95).
// 1,000 orders (shares of 100,000 orders would all be 0.00 %): net, VAT and gross are computed (valueGetter / formula), the share of the net total and the rank use
// „Show values as“, the last column takes a formula typed into the search field. The orders themselves stay unchanged.
import {
  ColumnDef, EventAdapter, FORMULA_FUNCTION_NAMES, SimpleDomService, TableFactory, TableOptions, TableScope,
  px70, px80, px100, px110, px120, type ColumnDefIf, type ShowValuesAs, type TableApi,
  type TableOptionsIf
} from "@guiexpert/table";
import { createOrders, type Order } from "../src/data/orders";
import { type DemoContext, fmt, runDemo } from "../src/training/demo-page";

const right = { headerClasses: ["ge-table-text-align-right"], bodyClasses: ["ge-table-text-align-right"],
  footerClasses: ["ge-table-text-align-right"] };

function demo(ctx: DemoContext) {
  const orders = createOrders(1_000);
  let onlyGermany = false;
  const columnDefs: ColumnDefIf[] = [
    ColumnDef.create({ property: "customer", headerLabel: "Customer", width: px120 }),
    ColumnDef.create({ property: "product", headerLabel: "Product", width: px110 }),
    ColumnDef.create({ property: "quantity", headerLabel: "Qty", width: px70, ...right }),
    ColumnDef.create({ property: "price", headerLabel: "Price", width: px80, ...right }),
    ColumnDef.create({                                      // a function: fast, typed, your code
      property: "net", headerLabel: "Net", width: px120, ...right,
      valueGetter: (o: Order) => Math.round(o.quantity * o.price * 100) / 100
    }),
    ColumnDef.create({                                      // a formula: a text – could come from your users
      property: "gross", headerLabel: "Gross", width: px120, ...right,
      formula: "ROUND([net] * 1.19, 2)"
    }),
    ColumnDef.create({                                      // the same value, shown as a share of the column total
      property: "share", headerLabel: "Share of net", width: px100, ...right,
      valueGetter: (o: Order, c) => c.getValue(o, "net"),
      showValuesAs: { mode: "percentOfColumnTotal", fractionDigits: 2 }
    }),
    ColumnDef.create({ property: "custom", headerLabel: "Your formula", width: px120, ...right,
      formula: 'IF([quantity] >= 10, "bulk", "single")' })
  ];
  const tableModel = TableFactory.createTableModel({
    rows: orders,
    columnDefs,
    footerAggregates: { quantity: "sum", net: "sum", gross: "sum" }    // sums of the computed values
  });
  const tableOptions: TableOptionsIf = {
    ...new TableOptions(),
    externalFilterFunction: (o: Order) => !onlyGermany || o.country === "Germany"
  };
  const scope = new TableScope(ctx.host, tableModel, new SimpleDomService(), tableOptions, new EventAdapter());
  scope.firstInit();
  const api: TableApi = scope.getApi();

  const hint = `functions: ${FORMULA_FUNCTION_NAMES.slice(0, 8).join(", ")} …`;
  const input = ctx.search("formula, e.g. [gross] - [net]", source => {
    const error = api.setColumnFormula("custom", source || '""');   // compiled, no eval – repaints the column
    ctx.info(error ? `${error.code} ${error.message}` : hint);
  });
  input.value = 'IF([quantity] >= 10, "bulk", "single")';

  const modes: ShowValuesAs[] = ["percentOfColumnTotal", "runningTotal", "rank"];
  const label: Record<string, string> = { percentOfColumnTotal: "share", runningTotal: "running total", rank: "rank" };
  let mode = 0;
  ctx.button("net as → running total", button => {
    mode = (mode + 1) % modes.length;
    api.setShowValuesAs("share", { mode: modes[mode], fractionDigits: 2 });
    button.textContent = `net as → ${label[modes[(mode + 1) % modes.length]]}`;
  });
  ctx.toggle("only Germany", false, checked => {
    onlyGermany = checked;
    api.externalFilterChanged();                              // shares, ranks and totals follow the filter
  });
  ctx.info(`${fmt(orders.length)} orders · ${hint}`);
  return () => scope.destroy();
}

runDemo(demo);
