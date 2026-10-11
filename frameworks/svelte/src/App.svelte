<!-- Episode 010 – Svelte 5 (runes): callback props instead of on:… events. -->
<script lang="ts">
  import { GuiexpertTable } from "@guiexpert/svelte-table";
  import { type GeMouseEvent, type TableApi, TableOptions } from "@guiexpert/table";
  import { createOrderTableModel } from "../../../src/model/order-table";

  const tableModel = createOrderTableModel(100_000);
  const tableOptions = { ...new TableOptions() };
  let info = $state("");
</script>

<header class="app-header"><b>Svelte 5</b> <span id="info">{info}</span></header>
<div class="table-div">
  <GuiexpertTable
    {tableModel}
    {tableOptions}
    onTableReady={(api: TableApi) => (info = `${api.getBodyModel().getRowCount()} orders`)}
    onMouseClicked={(evt: GeMouseEvent) => (info = `row ${evt.rowIndex}, column ${evt.columnIndex}`)}
  />
</div>
