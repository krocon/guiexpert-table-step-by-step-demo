// Episode 030 – tree table with checkboxes: country → customer → order.
import "@guiexpert/table/css/main.css";
import "../src/style.css";
import "../src/theme.css";
import { AutoRestoreOptions, EventAdapter, SimpleDomService, TableOptions, TableOptionsIf, TableScope } from "@guiexpert/table";
import { createOrders } from "../src/data/orders";
import { OrderNode, createOrderTreeModel } from "../src/model/order-tree";

const tableOptions: TableOptionsIf = {
  ...new TableOptions(),
  hoverColumnVisible: false,
  showCheckboxWihoutExtraColumn: true,       // checkbox inside the tree column, after the arrow
  autoRestoreOptions: {                      // episode 033: remember which nodes are open
    ...new AutoRestoreOptions<OrderNode>(),
    getStorageKeyFn: () => "ge-demo-order-tree",
    getRowId: node => node.id,
    autoRestoreCollapsedExpandedState: true,
    autoRestoreScrollPosition: true
  }
};
const tableModel = createOrderTreeModel(createOrders(5_000), tableOptions);

class TreeEvents extends EventAdapter {
  override onCheckboxChanged(rows: any[]): void {
    (window as any).__checked = rows;
    document.querySelector("#info")!.textContent = `${rows.length} rows checked`;
  }
}

const host = document.querySelector<HTMLDivElement>(".table-div")!;
const scope = new TableScope(host, tableModel, new SimpleDomService(), tableOptions, new TreeEvents()).firstInit();
document.querySelector("#info")!.textContent = "5,000 orders · click ▸ to expand, Alt+click on a row too";
(window as any).tableApi = scope.getApi();
(window as any).__stats = {};
