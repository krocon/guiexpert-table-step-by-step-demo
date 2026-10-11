// Episode 010 – Solid: callback props like React.
import { GuiexpertTable } from "@guiexpert/solid-table";
import { GeMouseEvent, TableApi, TableOptions } from "@guiexpert/table";
import { createSignal } from "solid-js";
import { createOrderTableModel } from "../../../src/model/order-table";

export function App() {
  const [info, setInfo] = createSignal("");
  const tableModel = createOrderTableModel(100_000);
  const tableOptions = { ...new TableOptions() };
  return (
    <>
      <header class="app-header"><b>Solid</b> <span id="info">{info()}</span></header>
      <div class="table-div">
        <GuiexpertTable
          tableModel={tableModel}
          tableOptions={tableOptions}
          tableReady={(api: TableApi) => setInfo(`${api.getBodyModel().getRowCount()} orders`)}
          mouseClicked={(evt: GeMouseEvent) => setInfo(`row ${evt.rowIndex}, column ${evt.columnIndex}`)}
        />
      </div>
    </>
  );
}
