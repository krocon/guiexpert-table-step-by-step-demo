import { TableModelIf } from "@guiexpert/table";

/** Episode 011 – a TableModel is three area models (header, body, footer) plus columns. */
export function describeModel(tableModel: TableModelIf): string {
  const header = tableModel.getAreaModel("header");
  const body = tableModel.getAreaModel("body");
  const footer = tableModel.getAreaModel("footer");
  const rows = `${header.getRowCount()} / ${body.getRowCount()} / ${footer.getRowCount()}`;
  const firstCustomer = body.getValueAt(0, 2);           // row 0, column 2
  const columns = tableModel.getColumnCount();
  return `rows (header / body / footer): ${rows} · ${columns} columns · first customer: ${firstCustomer}`;
}
