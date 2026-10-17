// Episode 040 – a spreadsheet in the browser: cell formulas with A1 references, copy & paste with Excel, undo.
import "@guiexpert/table/css/main.css";
import "../src/style.css";
import "./spreadsheet.css";
import { EventAdapter, FormulaBar, SimpleDomService, SpreadsheetFactory, TableScope } from "@guiexpert/table";
import type { GeUndoEvent } from "@guiexpert/table";

// inputs: numbers, texts and formulas ("=…") – the sheet calculates them
const data: unknown[][] = [
  ["Item", "Jan", "Feb", "Mar", "Total"],
  ["Rent", 950, 950, 950, "=SUM(B2:D2)"],
  ["Food", 410, 385, 432, "=SUM(B3:D3)"],
  ["Transport", 89, 89, 120, "=SUM(B4:D4)"],
  ["Fun", 120, 60, 210, "=SUM(B5:D5)"],
  ["Sum", "=SUM(B2:B5)", "=SUM(C2:C5)", "=SUM(D2:D5)", "=SUM(E2:E5)"],
];

// one call: column letters, row numbers, Excel-style editing, clipboard, undo, cell formulas, fill handle
const { tableModel, tableOptions } = SpreadsheetFactory.create({ data, rowCount: 1_000, columnWidth: 110 });

const undo = document.querySelector<HTMLButtonElement>("#undo")!;
const redo = document.querySelector<HTMLButtonElement>("#redo")!;
const listener = new EventAdapter();
listener.onUndoStackChanged = (evt: GeUndoEvent) => {
  undo.disabled = !evt.canUndo;
  redo.disabled = !evt.canRedo;
};

const host = document.querySelector<HTMLDivElement>(".table-div")!;
const scope = new TableScope(host, tableModel, new SimpleDomService(), tableOptions, listener);
scope.firstInit();
const api = scope.getApi();

// optional: address box + the formula of the active cell (plain DOM, works in every framework)
new FormulaBar(document.querySelector<HTMLDivElement>(".formula-bar")!, api);

undo.addEventListener("click", () => api.undo());
redo.addEventListener("click", () => api.redo());
document.querySelector("#insert")!.addEventListener("click", () => {
  const [row, col] = api.getActiveCell() ?? [0, 1];
  const address = api.getCellAddress(row, Math.max(col, 1)) ?? "A1";   // "B3" – the row number of the sheet
  api.insertRows(Number(address.replace(/^[A-Z]+/, "")) - 1, 1);       // =SUM(B2:B5) becomes =SUM(B2:B6)
});
document.querySelector("#excel")!.addEventListener("click",
  () => api.downloadExcel("budget.xlsx", "", { cellFormulas: true }));  // real formulas, not only numbers

document.querySelector("#info")!.textContent = "select B3, type 500, Enter – the sums follow";
host.focus();
