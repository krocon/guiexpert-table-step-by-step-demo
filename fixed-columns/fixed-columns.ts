// Episode 018 – ID fixed on the left, Total fixed on the right, 40 columns in between scroll horizontally.
import "@guiexpert/table/css/main.css";
import "../src/style.css";
import { EventAdapter, SimpleDomService, TableOptions, TableScope } from "@guiexpert/table";
import { createOrders } from "../src/data/orders";
import { describeModel } from "../src/model/describe-model";
import { createWideOrdersModel } from "../src/model/order-wide-model";

const rowCount = Number(new URLSearchParams(location.search).get("rows") ?? 100_000);
const tableModel = createWideOrdersModel(createOrders(rowCount));

const host = document.querySelector<HTMLDivElement>(".table-div")!;
const tableScope = new TableScope(host, tableModel, new SimpleDomService(), new TableOptions(), new EventAdapter());
tableScope.firstInit();

// (only for the demo)
requestAnimationFrame(() => {
  const nodes = host.getElementsByTagName("*").length;
  document.querySelector("#info")!.textContent =
    `${rowCount.toLocaleString("en")} orders · ${tableModel.getColumnCount()} columns · ${nodes.toLocaleString("en")} DOM elements`;
  document.querySelector("#model")!.textContent = describeModel(tableModel);
  (window as any).__stats = { nodes };
  (window as any).tableApi = tableScope.getApi();
});
