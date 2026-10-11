// Episode 014 – no objects needed: header, body and footer as two-dimensional arrays (here from a CSV file).
import "@guiexpert/table/css/main.css";
import { EventAdapter, SimpleDomService, TableFactory, TableOptions, TableScope } from "@guiexpert/table";

async function loadCsv(url: string): Promise<string[][]> {
  const text = await (await fetch(url)).text();
  return text.trim().split("\n").map(line => line.split(","));
}

function totalsRow(rows: string[][]): string[] {
  const total = rows.reduce((sum, row) => sum + Number(row[9]), 0);   // column 9 = total
  return ["", "", "", "", "", "", "", "", "Σ", total.toFixed(2), `${rows.length} rows`];
}

async function main(): Promise<void> {
  const [header, ...rows] = await loadCsv("/data/orders.csv");
  const tableModel = TableFactory.createTableModel({
    headerData: [header],
    bodyData: rows,
    footerData: [totalsRow(rows)],
    columnSizes: [70, 110, 160, 120, 110, 150, 110, 70, 90, 100, 100]
  });
  const host = document.querySelector<HTMLDivElement>(".table-div")!;
  new TableScope(host, tableModel, new SimpleDomService(), { ...new TableOptions() }, new EventAdapter())
    .firstInit();
  document.querySelector("#info")!.textContent = `${rows.length} rows from orders.csv`;
}

main();
