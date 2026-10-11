// Episode 027 – heatmap: revenue per city and month, colour per cell from the value.
import "@guiexpert/table/css/main.css";
import "../src/style.css";
import { EventAdapter, SimpleDomService, TableFactory, TableOptions, TableScope } from "@guiexpert/table";
import { createOrders } from "../src/data/orders";
import { RevenueHeatmapModel, revenueByCityAndMonth } from "../src/model/revenue-heatmap";

const matrix = revenueByCityAndMonth(createOrders(100_000));
const tableModel = TableFactory.createTableModel({
  headerData: [["City (k€)", ...matrix.months]],
  bodyAreaModel: new RevenueHeatmapModel(matrix),
  columnSizes: [150, ...matrix.months.map(() => 80)],
  fixedLeftColumnCount: 1
});

const host = document.querySelector<HTMLDivElement>(".table-div")!;
new TableScope(host, tableModel, new SimpleDomService(),
  { ...new TableOptions(), hoverColumnVisible: false }, new EventAdapter()).firstInit();
document.querySelector("#info")!.textContent =
  `${matrix.rows.length} cities × ${matrix.months.length} months · ${matrix.min}–${matrix.max} k€`;
(window as any).__stats = {};
