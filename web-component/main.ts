// Episode 006 – the table as a custom element: works in any HTML page and any framework.
import "@guiexpert/table/css/main.css";
import { GuiexpertTable } from "@guiexpert/webcomponent-table";
import { TableApi, TableOptions } from "@guiexpert/table";
import { createOrderTableModel } from "../src/model/order-table";

function showInfo(api: TableApi): void {
  const rows = api.getBodyModel().getRowCount();
  document.querySelector("#info")!.textContent = `${rows.toLocaleString("en")} orders`;
}

const tableModel = createOrderTableModel();
const tableOptions = { ...new TableOptions() };

// the package does not register the element itself; events are bubbling CustomEvents
customElements.define("guiexpert-table", GuiexpertTable);
const table = document.querySelector<GuiexpertTable>("guiexpert-table")!;
table.addEventListener("tableReady", (e) => {
  const api = (e as CustomEvent<TableApi>).detail;
  showInfo(api);
});
table.data = { tableModel, tableOptions };
