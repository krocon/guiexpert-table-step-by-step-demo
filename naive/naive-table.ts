// Episode 001 – the "naive" way: one <tr> per order, 100,000 rows straight into the DOM.
import { createOrders, Order } from "../src/data/orders";

const rowCount = Number(new URLSearchParams(location.search).get("rows") ?? 100_000);   // e.g. /naive/?rows=10000
const orders = createOrders(rowCount);
const table = document.querySelector<HTMLTableElement>("#orders")!;
const stats = document.querySelector<HTMLSpanElement>("#stats")!;
document.querySelector("#count")!.textContent = rowCount.toLocaleString("en");
const columns = Object.keys(orders[0]) as (keyof Order)[];

function render(rows: Order[]): void {
  table.innerHTML = "";
  const header = table.createTHead().insertRow();
  for (const col of columns) {
    const th = document.createElement("th");
    th.textContent = col;
    th.onclick = () => sortBy(col);
    header.appendChild(th);
  }
  const tbody = table.createTBody();
  for (const order of rows) {                       // ← the code shown in the video
    const tr = tbody.insertRow();
    for (const value of Object.values(order)) {
      tr.insertCell().textContent = String(value);
    }
  }
}

/** Measures until the browser has really painted (layout of 1 million cells included). */
function measure(label: string, work: () => void): void {
  const t0 = performance.now();
  work();
  requestAnimationFrame(() => setTimeout(() => {
    const ms = Math.round(performance.now() - t0);
    const nodes = table.getElementsByTagName("*").length;
    stats.textContent = `${label}: ${ms.toLocaleString("en")} ms · ${nodes.toLocaleString("en")} DOM elements`;
    (window as any).__stats = { label, ms, nodes };
  }));
}

let sortCol: keyof Order | undefined;
let asc = true;
function sortBy(col: keyof Order): void {
  asc = col === sortCol ? !asc : true;
  sortCol = col;
  // sorting itself is fast – the expensive part is building one million cells again:
  measure(`sort by ${col}`, () => {
    orders.sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * (asc ? 1 : -1));
    render(orders);
  });
}

measure("first render", () => render(orders));
