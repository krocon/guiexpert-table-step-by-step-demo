import { AreaModelObjectArray, ColumnDef, ColumnDefIf, TableFactory, TableModelIf, allRight, px90 } from "@guiexpert/table";
import { Order } from "../data/orders";
import { ORDER_COLUMNS } from "./order-columns";
import { OrderTotalsFooterModel } from "./order-totals-footer";

// Episode 018 – 40 columns: the orders plus 30 months of (made-up) follow-up revenue.
export type WideOrder = Order & Record<string, number | string>;

const MONTHS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2024, i, 1));
  return d.toISOString().slice(0, 7);                         // "2024-01" … "2026-06"
});

export function widenOrders(orders: Order[]): WideOrder[] {
  return orders.map(o => {
    const wide: WideOrder = { ...o };
    MONTHS.forEach((m, i) => wide[m] = Math.round(o.total * ((o.id * 7919 + i * 104_729) % 97) / 200));
    return wide;
  });
}

const monthColumns = MONTHS.map(m => new ColumnDef(m, m, px90, allRight));
const total = ORDER_COLUMNS.find(c => c.property === "total")!;
export const WIDE_COLUMNS: ColumnDefIf[] = [
  ...ORDER_COLUMNS.filter(c => c !== total), ...monthColumns, total   // total is the last column
];

export function createWideOrdersModel(orders: Order[]): TableModelIf {
  const tableModel = TableFactory.createTableModel({
    rows: widenOrders(orders),
    columnDefs: WIDE_COLUMNS,
    fixedLeftColumnCount: 1,        // ID stays on the left
    fixedRightColumnCount: 1,       // Total stays on the right
    footerAreaModel: new OrderTotalsFooterModel(
      () => tableModel.getBodyModel() as AreaModelObjectArray<Order>, WIDE_COLUMNS)
  });
  return tableModel;
}
