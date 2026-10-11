import { ColumnDefIf, SelectCellRenderer, TrueFn, ValueLabel, editInputPipeForNumber } from "@guiexpert/table";
import { Order } from "../data/orders";

// Episode 031 – edit quantity and status right in the table (double-click or Enter on the focused cell).
export function applyOrderEditing(columns: ColumnDefIf[]): void {
  const column = (property: keyof Order) => columns.find(c => c.property === property)!;

  const quantity = column("quantity");
  quantity.editable = TrueFn;
  quantity.editInputPipe = editInputPipeForNumber;             // the input text becomes a number

  const status = column("status");
  status.editable = TrueFn;
  status.getEditRenderer = () => new SelectCellRenderer(       // a <select> instead of a text input
    ["open", "paid", "shipped", "cancelled"].map(s => new ValueLabel(s, s)));
}

/** After an edit: recalculate the derived value. */
export function recalcOrder(order: Order): void {
  order.total = Math.round(order.quantity * order.price * 100) / 100;
}
