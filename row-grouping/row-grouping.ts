// Chapter 36 – row grouping (since 1.1.94): flat orders grouped by country › city with totals per group, a total row,
// regrouping at runtime and a filter that the groups follow.
import {
  EventAdapter, RowGroupFactory, SimpleDomService, TableOptions, TableScope, px150,
  type RowGroupField, type TableApi, type TableOptionsIf
} from "@guiexpert/table";
import { createOrders, type Order } from "../src/data/orders";
import { createOrderColumns } from "../src/training/order-columns";
import { type DemoContext, fmt, since, runDemo } from "../src/training/demo-page";

const KEEP = ["id", "country", "city", "product", "category", "quantity", "price", "total"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BY_DATE: RowGroupField<Order>[] = [
  { name: "year", label: "Year", value: o => o.date.slice(0, 4), order: "desc" },
  { name: "month", label: "Month", value: o => Number(o.date.slice(5, 7)) - 1, format: m => MONTHS[m as number] }
];

function demo(ctx: DemoContext) {
  const orders = createOrders(100_000);
  const columns = createOrderColumns().filter(c => KEEP.includes(c.property)); // fewer columns: the totals stay in view
  columns[columns.length - 1].width = px150;          // the sums of the groups are wider than a single total
  let query = "";
  const t0 = performance.now();
  const tableModel = RowGroupFactory.createTableModel<Order>({
    rows: orders,
    columnDefs: columns,
    groupBy: ["country", "city"],                                   // levels, top first
    aggregations: { quantity: "sum", price: "avg", total: "sum" },  // per column, also the total row
    expanded: 1                                                     // countries open, cities closed
  });
  const tableOptions: TableOptionsIf = {
    ...new TableOptions(),
    externalFilterFunction: (o: Order) => !query || `${o.product} ${o.city}`.toLowerCase().includes(query)
  };
  const scope = new TableScope(ctx.host, tableModel, new SimpleDomService(), tableOptions, new EventAdapter());
  scope.firstInit();
  const api: TableApi = scope.getApi();
  ctx.info(`${fmt(orders.length)} orders grouped in ${since(t0)} ms`);

  const regroup = (label: string, groupBy: RowGroupField<Order>[]) => ctx.button(label, () => {
    const t1 = performance.now();
    api.setRowGroupBy(groupBy);          // no new model: expanded groups, filter and sorting stay
    ctx.info(`regrouped ${fmt(orders.length)} orders in ${since(t1)} ms`);
  });
  regroup("country › city", ["country", "city"]);
  regroup("category › product", ["category", "product"]);
  regroup("year › month", BY_DATE);
  regroup("no groups", []);
  ctx.button("collapse all", () => api.collapseAll());
  ctx.search("filter: product or city …", value => {
    query = value.trim().toLowerCase();
    api.externalFilterChanged();         // groups, counts and totals follow the filter
  });
  return () => scope.destroy();
}

runDemo(demo);
