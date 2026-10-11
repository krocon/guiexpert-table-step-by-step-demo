import { TableFactory, TableModelIf } from "@guiexpert/table";
import { Order } from "../data/orders";
import { ORDER_COLUMNS } from "./order-columns";

// Episode 012: TableFactory.createTableModel({ rows: orders, properties: [...] })
// Episode 013: own column definitions – typed factory for an array of T
export function createOrdersModel(orders: Order[]): TableModelIf {
  return TableFactory.buildByTypedRows<Order>(orders, ORDER_COLUMNS);
}
