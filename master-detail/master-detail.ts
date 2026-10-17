// Chapter 38 – master/detail (since 1.1.97): 100,000 orders; ▸ or Enter opens an order and its items appear below it
// as a second GuiExpert table over the full width. A second mode shows a small form whose height is measured ("auto").
import {
  EventAdapter, FocusModel, SelectionModel, SimpleDomService, TableFactory, TableOptions, TableScope, px100, px120, px200,
  ColumnDef, type DetailRenderFnType, type GeDetailEvent, type TableApi, type TableOptionsIf
} from "@guiexpert/table";
import { createOrders, type Order } from "../src/data/orders";
import { createOrderColumns } from "../src/training/order-columns";
import { itemsOf } from "../src/training/order-items";
import { type DemoContext, fmt, runDemo } from "../src/training/demo-page";

const KEEP = ["id", "date", "customer", "city", "product", "status", "total"];

/** The detail: the items of the order as a nested table (destroyed with the detail row). */
const itemTable: DetailRenderFnType<Order> = (_container, order, ctx) => {
  ctx.createTable({
    tableModel: TableFactory.createTableModel({
      rows: itemsOf(order),
      columnDefs: [
        ColumnDef.create({ property: "sku", headerLabel: "SKU", width: px120 }),
        ColumnDef.create({ property: "product", headerLabel: "Product", width: px200 }),
        ColumnDef.create({ property: "quantity", headerLabel: "Qty", width: px100 }),
        ColumnDef.create({ property: "price", headerLabel: "Price", width: px100 })
      ]
    })
  });
};

/** Another detail: a form – texts via textContent/value, never innerHTML. Its height is measured ("auto"). */
const noteForm: DetailRenderFnType<Order> = (container, order, ctx) => {
  const label = document.createElement("label");
  label.textContent = `Note for order ${order.id} (${order.customer})`;
  const note = document.createElement("textarea");
  note.rows = 2;
  note.style.cssText = "display:block; width:min(480px, 100%); margin-top:4px";
  note.addEventListener("change", () => ctx.tableApi.announce("Note saved"), { signal: ctx.signal });
  label.append(note);
  container.append(label);
};

function demo(ctx: DemoContext) {
  const orders = createOrders(100_000);
  const columns = createOrderColumns().filter(c => KEEP.includes(c.property));
  const focusModel = new FocusModel("cell");
  const selectionModel = new SelectionModel("row", "multi");
  let scope: TableScope | undefined;
  let api: TableApi | undefined;

  const create = (form: boolean) => {
    scope?.destroy();
    const tableModel = TableFactory.createTableModel({ rows: orders, columnDefs: columns, fixedLeftColumnCount: 1 });
    const tableOptions: TableOptionsIf = {
      ...new TableOptions(),
      getFocusModel: () => focusModel,
      getSelectionModel: () => selectionModel,
      masterDetail: {
        // px per order: header + one row per item, padding and borders – or measured ("auto")
        detailHeight: form ? "auto" : (order: Order) => (itemsOf(order).length + 1) * 34 + 18,
        detailRenderer: form ? noteForm : itemTable
      }
    };
    const listener = new EventAdapter();
    listener.onDetailExpandedChanged = (evt: GeDetailEvent<Order>) =>
      ctx.info(`order ${evt.row.id} ${evt.expanded ? "opened" : "closed"} (${evt.source})`);
    scope = new TableScope(ctx.host, tableModel, new SimpleDomService(), tableOptions, listener);
    scope.firstInit();
    api = scope.getApi();
    api.setDetailExpanded(1, true);              // display index – or the row object: api.setDetailExpanded(orders[1], true)
  };
  create(false);
  ctx.info(`${fmt(orders.length)} orders – click ▸ or press Enter`);
  ctx.button("open 20", () => { for (let i = 0; i < 20; i++) api!.setDetailExpanded(i, true); });
  ctx.button("close all", () => ctx.info(`${api!.collapseAllDetails()} closed`));
  ctx.toggle("form instead of items", false, checked => create(checked));
  return () => scope?.destroy();
}

runDemo(demo);
