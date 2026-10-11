// Episode 015 – a header is an area model too: multi-row header with groups you can collapse.
import "@guiexpert/table/css/main.css";
import {
  AreaModelCellGroups, AreaModelObjectArrayWithColumndefs, CellGroupIf, CellgroupFactory,
  EventAdapter, SimpleDomService, TableFactory, TableOptions, TableScope, px80, px110, px160
} from "@guiexpert/table";
import { createOrders, Order } from "../src/data/orders";

const groups: CellGroupIf[] = [
  { data: "Order", children: [{ data: "ID", property: "id" }, { data: "Date", property: "date" }] },
  { data: "Customer", toggle: true, children: [
    { data: "Customer", property: "customer", visibility: "always" },
    { data: "Country", property: "country" },
    { data: "City", property: "city" }] },
  { data: "Product", toggle: true, children: [
    { data: "Product", property: "product", visibility: "always" },
    { data: "Category", property: "category" }] },
  { data: "Amount", children: [
    { data: "Qty", property: "quantity" }, { data: "Price", property: "price" }, { data: "Total", property: "total" }] }
];

const columnDefs = CellgroupFactory.buildColumnDefs(CellgroupFactory.buildGroupExts(groups));
for (const def of columnDefs) {                      // default width is 100 px
  def.width = ["customer", "product"].includes(def.property) ? px160 : def.property === "id" ? px80 : px110;
}
const header = new AreaModelCellGroups("header", groups, columnDefs, 34);
const body = new AreaModelObjectArrayWithColumndefs<Order>("body", createOrders(10_000), columnDefs, 34);
const tableModel = TableFactory.createTableModel({ headerAreaModel: header, bodyAreaModel: body, columnDefs });

const host = document.querySelector<HTMLDivElement>(".table-div")!;
new TableScope(host, tableModel, new SimpleDomService(), { ...new TableOptions() }, new EventAdapter()).firstInit();
