import { AreaModelObjectArray, ExcelService, TableApi } from "@guiexpert/table";
import { Order } from "./data/orders";

// Episode 024 – Excel without a library, two ways.

// 1. what the table shows: filtered rows, current sort order, header + footer, visible columns
export function downloadView(tableApi: TableApi): void {
  tableApi.downloadExcel("orders-view.xlsx", "GuiExpert");
}

// 2. all orders, ignoring filter and sorting – you choose the columns
export function downloadAll(tableApi: TableApi): void {
  const body = tableApi.getBodyModel() as AreaModelObjectArray<Order>;
  const matrix = [
    ["ID", "Date", "Customer", "Country", "Category", "Total", "Status"],
    ...body.getAllRows().map(o => [o.id, o.date, o.customer, o.country, o.category, o.total, o.status])
  ];
  new ExcelService().downloadExcel(matrix, "orders-all.xlsx", "GuiExpert");
}
