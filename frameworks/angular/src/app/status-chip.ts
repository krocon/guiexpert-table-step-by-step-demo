// Episode 026 – an Angular component as cell renderer: implement ComponentRendererIf.setData().
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ComponentRendererIf } from "@guiexpert/angular-table";
import { AreaIdent, AreaModelIf, RendererCleanupFnType } from "@guiexpert/table";

@Component({
  selector: "app-status-chip",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="status-badge status-{{ status() }}" [title]="'row ' + row()">{{ status() }}</span>`
})
export class StatusChip implements ComponentRendererIf<StatusChip> {
  readonly status = signal("");
  readonly row = signal(0);

  setData(rowIndex: number, _columnIndex: number, _areaIdent: AreaIdent,
          _areaModel: AreaModelIf, cellValue: any): RendererCleanupFnType | undefined {
    this.status.set(cellValue);
    this.row.set(rowIndex + 1);
    return undefined;
  }
}
