import "@guiexpert/table/css/main.css";   // styles of the table (CSS variables --ge-table-*)
import "./style.css";
import { SimpleDomService, TableOptions, TableScope } from "@guiexpert/table";
import { createOrders, Order } from "./data/orders";
import { describeModel } from "./model/describe-model";
import { createOrderTableOptions } from "./model/order-table-options";
import { matchesOrder, orderFilter } from "./order-filter";
import { OrderEvents } from "./order-events";
import { showContextMenu } from "./context-menu";
import { downloadAll, downloadView } from "./order-excel";
import { createOrdersModel } from "./model/order-table-model";

const params = new URLSearchParams(location.search);       // e.g. /?rows=1000000&scrollTo=50000
const showInfo = (text: string) => document.querySelector("#info")!.textContent = text;
const rowCount = Number(params.get("rows") ?? 100_000);
const t0 = performance.now();
const orders = createOrders(rowCount);

// Episode 005 – the four building blocks: host div, table model, options, TableScope.
const host = document.querySelector<HTMLDivElement>(".table-div")!;
const options = params.has("defaults")                        // episode 019: /?defaults → before
  ? { ...new TableOptions() }
  : createOrderTableOptions();
options.externalFilterFunction = matchesOrder;                // episode 021
const tableModel = createOrdersModel(orders, options);        // episode 012
// Episode 023 – events: double-click shows the order, right-click opens our own menu
const orderAt = (rowIndex: number) => tableModel.getBodyModel().getRowByIndex(rowIndex) as Order;
const showOrder = (o: Order) =>
  showInfo(`#${o.id} · ${o.date} · ${o.customer}, ${o.city} · ${o.quantity} × ${o.product} = ${o.total}`);
const events = new OrderEvents(showInfo, row => showOrder(orderAt(row)), evt => {
  const order = orderAt(evt.rowIndex);
  showContextMenu(evt.originalEvent!, [
    { label: `Show order #${order.id}`, action: () => showOrder(order) },
    { label: "Copy selection", action: () => tableApi.copyToClipboard() },
    { label: `Only ${order.customer}`, action: () => { search.value = order.customer; filterChanged(); } },
    { label: "Export view as Excel", action: () => downloadView(tableApi) }
  ]);
});
const tableScope = new TableScope(host, tableModel, new SimpleDomService(), options, events);
tableScope.firstInit();

const tableApi = tableScope.getApi();
document.querySelector("#autosize")?.addEventListener("click", () => tableApi.autoResizeColumns());  // episode 019
// Episode 020 – sort from your own button: same as a double click on the header (icon included)
document.querySelector("#by-status")?.addEventListener("click", () => tableApi.sortByColumn("status"));
// Episode 020 – sort from code: newest orders first
document.querySelector("#newest")?.addEventListener("click", () => {
  const t = performance.now();
  tableApi.sort((a: Order, b: Order) => b.date.localeCompare(a.date));
  const ms = Math.round(performance.now() - t);
  document.querySelector("#info")!.textContent = `${rowCount.toLocaleString("en")} orders sorted in ${ms} ms`;
});
// Episode 021 – live search + minimum total
const search = document.querySelector<HTMLInputElement>("#search")!;
const minTotal = document.querySelector<HTMLInputElement>("#min-total")!;
function filterChanged(): void {
  orderFilter.text = search.value;
  orderFilter.minTotal = Number(minTotal.value);
  const t = performance.now();
  tableApi.externalFilterChanged();
  const ms = Math.round(performance.now() - t);
  const shown = tableApi.getBodyModel().getRowCount();
  document.querySelector("#info")!.textContent =
    `${shown.toLocaleString("en")} of ${rowCount.toLocaleString("en")} orders · ≥ ${orderFilter.minTotal} · ${ms} ms`;
}
search.addEventListener("input", filterChanged);
minTotal.addEventListener("input", filterChanged);
// Episode 022 – copy the selection (same as ⌘/Ctrl+C)
document.querySelector("#copy")?.addEventListener("click", async () => {
  const text = await tableApi.copyToClipboard();
  showInfo(`copied ${text.split("\n").length.toLocaleString("en")} lines to the clipboard`);
});
// Episode 024 – Excel: the current view or all data
document.querySelector("#xlsx-view")?.addEventListener("click", () => downloadView(tableApi));
document.querySelector("#xlsx-all")?.addEventListener("click", () => downloadAll(tableApi));
if (params.has("scrollTo")) tableApi.scrollToIndex(0, Number(params.get("scrollTo")));

// (only for the demo) show what it cost
requestAnimationFrame(() => {
  const ms = Math.round(performance.now() - t0);
  const nodes = host.getElementsByTagName("*").length;
  document.querySelector("#info")!.textContent =
    `${rowCount.toLocaleString("en")} orders · ${ms} ms · ${nodes.toLocaleString("en")} DOM elements`;
  document.querySelector("#model")!.textContent = describeModel(tableModel);   // episode 011
  (window as any).__stats = { ms, nodes };
  (window as any).tableApi = tableApi;
  if (params.has("q")) { search.value = params.get("q")!; filterChanged(); }   // e.g. /?q=berlin
});
