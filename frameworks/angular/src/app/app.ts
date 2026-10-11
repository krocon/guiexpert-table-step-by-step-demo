// Episode 009 – the same orders model, rendered by the Angular wrapper (Angular 14–22, here 22).
import { Component, computed, signal } from "@angular/core";
import { TableComponent } from "@guiexpert/angular-table";
import { GeMouseEvent, TableApi, TableOptions } from "@guiexpert/table";
import { createOrderTableModel } from "../../../../src/model/order-table";

@Component({
  selector: "app-root",
  imports: [TableComponent],
  template: `
    <header class="app-header">
      <b>Angular 22</b>
      <button (click)="toggle()">{{ rows() === 100000 ? "1,000 rows" : "100,000 rows" }}</button>
      <span id="info">{{ info() }}</span>
    </header>
    <guiexpert-table class="table-div"
      [tableModel]="model()" [tableOptions]="options"
      (tableReady)="onReady($event)" (mouseClicked)="onClick($event)" />
  `
})
export class App {
  readonly rows = signal(100_000);
  // a new model object → the table is rebuilt
  readonly model = computed(() => createOrderTableModel(this.rows()));
  readonly options = { ...new TableOptions() };
  readonly info = signal("");

  toggle(): void {
    this.rows.update(n => (n === 100_000 ? 1_000 : 100_000));
  }
  onReady(api: TableApi): void {
    this.info.set(`${api.getBodyModel().getRowCount().toLocaleString("en")} orders`);
  }
  onClick(evt: GeMouseEvent): void {
    this.info.set(`row ${evt.rowIndex}, column ${evt.columnIndex}`);
  }
}
