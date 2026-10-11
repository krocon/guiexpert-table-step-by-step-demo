// Episode 010 – Preact: same callback props as React.
import { GuiexpertTable } from "@guiexpert/preact-table";
import { GeMouseEvent, TableApi, TableOptions } from "@guiexpert/table";
import { useMemo, useState } from "preact/hooks";
import { createOrderTableModel } from "../../../src/model/order-table";

export function App() {
  const [info, setInfo] = useState("");
  const tableModel = useMemo(() => createOrderTableModel(100_000), []);
  const tableOptions = useMemo(() => ({ ...new TableOptions() }), []);
  return (
    <>
      <header class="app-header"><b>Preact</b> <span id="info">{info}</span></header>
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
