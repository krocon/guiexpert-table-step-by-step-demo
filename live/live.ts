// Episode 032 – live data without rebuilding the table.
import "@guiexpert/table/css/main.css";
import "../src/style.css";
import "./live.css";
import { EventAdapter, SimpleDomService, TableOptions, TableScope } from "@guiexpert/table";
import { createQuoteModel, createQuotes, tick } from "../src/model/ticker";

const quotes = createQuotes(1_000);
const host = document.querySelector<HTMLDivElement>(".table-div")!;
const scope = new TableScope(host, createQuoteModel(quotes), new SimpleDomService(),
  { ...new TableOptions(), hoverColumnVisible: false }, new EventAdapter()).firstInit();
const api = scope.getApi();

// 50 quotes move every 100 ms → 1,500 cell updates per second
let cells = 0, frames = 0, last = performance.now();
let timer = window.setInterval(() => cells += tick(api, quotes, 50), 100);

const info = document.querySelector("#info")!;
(function measure(now: number) {
  frames++;
  if (now - last >= 1000) {
    info.textContent = `${quotes.length.toLocaleString("en")} quotes · ${cells.toLocaleString("en")} cell updates/s · ${frames} fps`;
    (window as any).__stats = { cells, frames };
    cells = 0; frames = 0; last = now;
  }
  requestAnimationFrame(measure);
})(last);

document.querySelector("#toggle")!.addEventListener("click", e => {
  if (timer) { clearInterval(timer); timer = 0; } else timer = window.setInterval(() => cells += tick(api, quotes, 50), 100);
  (e.target as HTMLButtonElement).textContent = timer ? "pause" : "play";
});
