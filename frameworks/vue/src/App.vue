<!-- Episode 008 – the same orders model, rendered by the Vue 3 wrapper. -->
<script setup lang="ts">
import { GuiexpertTable } from "@guiexpert/vue3-table";
import { GeMouseEvent, TableApi, TableOptions } from "@guiexpert/table";
import { ref } from "vue";
import { createOrderTableModel } from "../../../src/model/order-table";

// plain objects – no ref() needed, the table keeps its own state
const tableModel = createOrderTableModel(100_000);
const tableOptions = { ...new TableOptions() };
const info = ref("");

function onReady(api: TableApi) {
  info.value = `${api.getBodyModel().getRowCount().toLocaleString("en")} orders`;
}
function onClick(evt: GeMouseEvent) {
  info.value = `row ${evt.rowIndex}, column ${evt.columnIndex}`;
}
</script>

<template>
  <header class="app-header"><b>Vue 3</b> <span id="info">{{ info }}</span></header>
  <div class="table-div">
    <GuiexpertTable
      :tableModel="tableModel" :tableOptions="tableOptions"
      @tableReady="onReady" @mouseClicked="onClick" />
  </div>
</template>
