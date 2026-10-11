import { AreaModelObjectArray, SortItem, TableFactory, TableModelIf, TableOptionsIf } from "@guiexpert/table";
import { Order } from "../data/orders";
import { ORDER_COLUMNS } from "./order-columns";
import { OrderTotalsFooterModel } from "./order-totals-footer";

// Episode 012: TableFactory.createTableModel({ rows: orders, properties: [...] })
// Episode 013: TableFactory.buildByTypedRows<Order>(orders, ORDER_COLUMNS)
// Episode 016: plus a footer area model with totals
// Episode 019: tableOptions → row heights for header and body
export function createOrdersModel(orders: Order[], tableOptions?: TableOptionsIf): TableModelIf {
  const tableModel = TableFactory.createTableModel({
    rows: orders,
    columnDefs: ORDER_COLUMNS,
    tableOptions,
    footerAreaModel: new OrderTotalsFooterModel(
      () => tableModel.getBodyModel() as AreaModelObjectArray<Order>, ORDER_COLUMNS,
      tableOptions?.defaultRowHeights?.footer)
  });
  // Episode 020: sortState only sets the header icon – sort the rows once to match it
  const index = ORDER_COLUMNS.findIndex(c => c.sortState);
  if (index >= 0) tableModel.doSort([new SortItem(index, ORDER_COLUMNS[index].sortState!)]);
  return tableModel;
}
