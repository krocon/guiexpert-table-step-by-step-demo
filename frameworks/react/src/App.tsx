// Episode 007 – the same orders model, rendered by the React wrapper.
import { ComponentRendererWrapper, GuiexpertTable } from "@guiexpert/react-table";
import { GeMouseEvent, TableApi, TableOptions } from "@guiexpert/table";
import { useMemo, useState } from "react";
import { createOrderTableModel } from "../../../src/model/order-table";
import { StatusChip } from "./StatusChip";

export function App() {
  const [rows, setRows] = useState(100_000);
  const [info, setInfo] = useState("");

  // a NEW model object rebuilds the table → keep model and options stable
  const model = useMemo(() => createOrderTableModel(rows, {
    status: new ComponentRendererWrapper(StatusChip)            // episode 026: React component per cell
  }), [rows]);
  const options = useMemo(() => ({ ...new TableOptions() }), []);

  const onReady = (api: TableApi) =>
    setInfo(`${api.getBodyModel().getRowCount().toLocaleString("en")} orders`);
  const onClick = (evt: GeMouseEvent) =>
    setInfo(`row ${evt.rowIndex}, column ${evt.columnIndex}`);

  return (
    <>
      <header className="app-header">
        <b>React</b>
        <button onClick={() => setRows(rows === 100_000 ? 1_000 : 100_000)}>
          {rows === 100_000 ? "1,000 rows" : "100,000 rows"}
        </button>
        <span id="info">{info}</span>
      </header>
      <div className="table-div">
        <GuiexpertTable
          tableModel={model} tableOptions={options}
          tableReady={onReady} mouseClicked={onClick}
        />
      </div>
    </>
  );
}
