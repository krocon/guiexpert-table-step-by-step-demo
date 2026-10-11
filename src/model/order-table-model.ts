import { TableFactory, TableModelIf } from "@guiexpert/table";
import { Order } from "../data/orders";

// Episode 012 – Array<T> → TableModel. keyof Order: a typo in a column name is a compile error.
const ORDER_PROPERTIES: (keyof Order)[] =
  ["id", "date", "customer", "country", "product", "quantity", "total", "status"];

export function createOrdersModel(orders: Order[]): TableModelIf {
  return TableFactory.createTableModel({ rows: orders, properties: ORDER_PROPERTIES });
}
