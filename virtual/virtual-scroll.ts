// Episode 002 – the principle behind every fast data grid: only draw what you see.
import { createOrders, Order } from "../src/data/orders";

const ROW_HEIGHT = 30;
const rowCount = Number(new URLSearchParams(location.search).get("rows") ?? 100_000);
const orders = createOrders(rowCount);

const viewport = document.querySelector<HTMLDivElement>(".viewport")!;
const spacer = document.querySelector<HTMLDivElement>(".spacer")!;
const rowsDiv = document.querySelector<HTMLDivElement>(".rows")!;
const stats = document.querySelector<HTMLSpanElement>("#stats")!;
document.querySelector("#count")!.textContent = rowCount.toLocaleString("en");

function renderRow(order: Order): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "row";
  for (const value of Object.values(order)) {
    row.appendChild(document.createElement("span")).textContent = String(value);
  }
  return row;
}

// 1. The spacer is as high as ALL rows together → the browser draws a real scrollbar.
spacer.style.height = `${rowCount * ROW_HEIGHT}px`;

// 2. On every scroll: which rows are visible? Only those go into the DOM.
function render(): void {
  const first = Math.floor(viewport.scrollTop / ROW_HEIGHT);
  const visible = Math.ceil(viewport.clientHeight / ROW_HEIGHT) + 1;
  const rows = orders.slice(first, first + visible);
  rowsDiv.style.transform = `translateY(${first * ROW_HEIGHT}px)`;
  rowsDiv.replaceChildren(...rows.map(renderRow));
}

// (only for the demo) how many DOM elements, how many milliseconds?
function renderAndMeasure(): void {
  const t0 = performance.now();
  render();
  const ms = Number((performance.now() - t0).toFixed(1));
  const nodes = viewport.getElementsByTagName("*").length;
  const first = Math.floor(viewport.scrollTop / ROW_HEIGHT);
  stats.textContent = `from row ${(first + 1).toLocaleString("en")} · ${nodes} DOM elements · ${ms} ms`;
  (window as any).__stats = { first, nodes, ms };
}

viewport.addEventListener("scroll", renderAndMeasure);
renderAndMeasure();
