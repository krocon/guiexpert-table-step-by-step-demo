// Episode 017 – own AreaModel: two million rows, no array behind it.
import "@guiexpert/table/css/main.css";
import { ColumnDef, EventAdapter, SimpleDomService, TableFactory, TableOptions, TableScope, allRight, bodyLeft, px120, px160 } from "@guiexpert/table";
import { TwoMillionRows } from "../src/model/large-model";

const rowCount = Number(new URLSearchParams(location.search).get("rows") ?? 2_000_000);
const t0 = performance.now();

const tableModel = TableFactory.createTableModel({
  bodyAreaModel: new TwoMillionRows(rowCount),
  columnDefs: [
    new ColumnDef("id", "ID", px120, allRight),
    new ColumnDef("date", "Date", px120),
    new ColumnDef("country", "Country", px160, bodyLeft),
    new ColumnDef("amount", "Amount", px120, allRight),
    new ColumnDef("status", "Status", px120)
  ]
});

const host = document.querySelector<HTMLDivElement>(".table-div")!;
const scope = new TableScope(host, tableModel, new SimpleDomService(), new TableOptions(), new EventAdapter()).firstInit();
const api = scope.getApi();

// (only for the demo) numbers in the header bar
const ms = Math.round(performance.now() - t0);
const dom = () => host.getElementsByTagName("*").length.toLocaleString("en");
const info = document.querySelector("#info")!;
info.textContent = `${rowCount.toLocaleString("en")} rows · ${ms} ms · ${dom()} DOM elements`;
(window as any).__stats = { rowCount, ms };

document.querySelector("#end")!.addEventListener("click", () => api.ensureRowIsVisible(rowCount - 1));
document.querySelector("#top")!.addEventListener("click", () => api.ensureRowIsVisible(0));

// frames per second while scrolling
const fps = document.querySelector("#fps")!;
let frames = 0, last = performance.now();
(function tick(now: number) {
  frames++;
  if (now - last >= 1000) { fps.textContent = `${frames} fps · ${dom()} DOM elements`; frames = 0; last = now; }
  requestAnimationFrame(tick);
})(last);
