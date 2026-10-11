import { AreaModelObjectArray, TableFactory, TableModelIf } from "@guiexpert/table";
import { Order } from "../data/orders";
import { ORDER_COLUMNS } from "./order-columns";
import { OrderTotalsFooterModel } from "./order-totals-footer";

// Episode 012: TableFactory.createTableModel({ rows: orders, properties: [...] })
// Episode 013: TableFactory.buildByTypedRows<Order>(orders, ORDER_COLUMNS)
// Episode 016: plus a footer area model with totals
export function createOrdersModel(orders: Order[]): TableModelIf {
  const tableModel = TableFactory.createTableModel({
    rows: orders,
    columnDefs: ORDER_COLUMNS,
    footerAreaModel: new OrderTotalsFooterModel(
      () => tableModel.getBodyModel() as AreaModelObjectArray<Order>, ORDER_COLUMNS)
  });
  return tableModel;
}
