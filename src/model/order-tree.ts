import { ColumnDef, TableFactory, TableModelIf, TableOptionsIf, TreeFactory, allRight, bodyLeft, px100, px110, px120, px300 } from "@guiexpert/table";
import { Order } from "../data/orders";
import { EuroRenderer, StatusBadgeRenderer } from "./order-renderers";

// Episode 030 – orders as a tree: country → customer → order.

export interface OrderNode {
  label: string;
  orders: number;
  total: number;
  date?: string;
  status?: Order["status"];
  children?: OrderNode[];
}

function group<T>(items: T[], key: (t: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) map.set(key(item), [...(map.get(key(item)) ?? []), item]);
  return new Map([...map].sort(([a], [b]) => a.localeCompare(b)));
}

const sum = (orders: Order[]) => Math.round(orders.reduce((s, o) => s + o.total, 0) * 100) / 100;

export function buildOrderTree(orders: Order[]): OrderNode[] {
  return [...group(orders, o => o.country)].map(([country, byCountry]) => ({
    label: country, orders: byCountry.length, total: sum(byCountry),
    children: [...group(byCountry, o => o.customer)].map(([customer, byCustomer]) => ({
      label: customer, orders: byCustomer.length, total: sum(byCustomer),
      children: byCustomer.map(o => ({
        label: `#${o.id} · ${o.product}`, orders: 1, total: o.total, date: o.date, status: o.status
      }))
    }))
  }));
}

export function createOrderTreeModel(orders: Order[], tableOptions: TableOptionsIf): TableModelIf {
  const columnDefs = [
    new ColumnDef("label", "Country / customer / order", px300, bodyLeft),
    new ColumnDef("orders", "Orders", px100, allRight),
    ColumnDef.create({ property: "total", headerLabel: "Total", width: px120,
      headerClasses: ["ge-table-text-align-right"], bodyClasses: ["ge-table-text-align-right"],
      bodyRenderer: new EuroRenderer() }),
    new ColumnDef("date", "Date", px110),
    ColumnDef.create({ property: "status", headerLabel: "Status", width: px110, bodyRenderer: new StatusBadgeRenderer() })
  ];
  const rows = TreeFactory.buildTreeRows<OrderNode>(buildOrderTree(orders), {
    childrenProperty: "children",
    expanded: false                     // start collapsed (default: everything open)
  });
  return TableFactory.createTableModel({ rows, columnDefs, tableOptions });
}
