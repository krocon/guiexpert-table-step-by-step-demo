import { TableFactory, TableModelIf } from "@guiexpert/table";
import { createOrders } from "../data/orders";

/** The orders table used by the framework demos (episodes 006–010) – one model for every framework. */
export function createOrderTableModel(rowCount = 100_000): TableModelIf {
  return TableFactory.createTableModel({ rows: createOrders(rowCount) });
}
