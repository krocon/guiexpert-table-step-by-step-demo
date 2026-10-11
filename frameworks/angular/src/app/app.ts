// Episode 009 – the same orders model, rendered by the Angular wrapper (Angular 14–22, here 22).
import { ChangeDetectorRef, Component, computed, inject, signal } from "@angular/core";
import { RenderWrapperFactory, TableComponent } from "@guiexpert/angular-table";
import { GeMouseEvent, TableApi, TableOptions } from "@guiexpert/table";
import { createOrderTableModel } from "../../../../src/model/order-table";
import { StatusChip } from "./status-chip";

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
  private readonly rwf = inject(RenderWrapperFactory);
  private readonly cdr = inject(ChangeDetectorRef);
  // episode 026: an Angular component per visible status cell
  private readonly statusRenderer = this.rwf.create(StatusChip, this.cdr);

  readonly rows = signal(100_000);
  // a new model object → the table is rebuilt
  readonly model = computed(() => createOrderTableModel(this.rows(), { status: this.statusRenderer }));
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
