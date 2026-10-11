import "@guiexpert/table/css/main.css";   // styles of the table (CSS variables --ge-table-*)
import "./style.css";
import { EventAdapter, SimpleDomService, TableOptions, TableScope } from "@guiexpert/table";
import { createOrders } from "./data/orders";
import { describeModel } from "./model/describe-model";
import { createOrderTableOptions } from "./model/order-table-options";
import { createOrdersModel } from "./model/order-table-model";

const params = new URLSearchParams(location.search);       // e.g. /?rows=1000000&scrollTo=50000
const rowCount = Number(params.get("rows") ?? 100_000);
const t0 = performance.now();
const orders = createOrders(rowCount);

// Episode 005 – the four building blocks: host div, table model, options, TableScope.
const host = document.querySelector<HTMLDivElement>(".table-div")!;
const options = params.has("defaults")                        // episode 019: /?defaults → before
  ? { ...new TableOptions() }
  : createOrderTableOptions();
const tableModel = createOrdersModel(orders, options);        // episode 012
const tableScope = new TableScope(
  host, tableModel, new SimpleDomService(), options, new EventAdapter());
tableScope.firstInit();

const tableApi = tableScope.getApi();
document.querySelector("#autosize")?.addEventListener("click", () => tableApi.autoResizeColumns());  // episode 019
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
});
