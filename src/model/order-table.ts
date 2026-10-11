import { CellRendererIf, ColumnDef, TableFactory, TableModelIf } from "@guiexpert/table";
import { createOrders, Order } from "../data/orders";

/**
 * The orders table used by the framework demos (episodes 006–010) – one model for every framework.
 * Episode 026: optional body renderers per property, e.g. a framework component for "status".
 */
export function createOrderTableModel(
  rowCount = 100_000,
  bodyRenderers: Partial<Record<keyof Order, CellRendererIf>> = {}): TableModelIf {

  const rows = createOrders(rowCount);
  if (!Object.keys(bodyRenderers).length) return TableFactory.createTableModel({ rows });

  const properties = Object.keys(rows[0] ?? {}) as (keyof Order)[];
  const columnDefs = properties.map(property => ColumnDef.create({
    property, headerLabel: property.toUpperCase(), bodyRenderer: bodyRenderers[property]
  }));
  return TableFactory.createTableModel({ rows, columnDefs });
}
