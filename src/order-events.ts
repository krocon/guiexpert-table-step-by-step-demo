import { EventAdapter, GeModelChangeEvent, GeMouseEvent, SelectionModelIf } from "@guiexpert/table";

// Episode 022/023 – react to table events: override only what you need.
export class OrderEvents extends EventAdapter {
  constructor(
    private readonly show: (text: string) => void,
    private readonly onRowDoubleClick?: (rowIndex: number) => void,
    private readonly onMenu?: (evt: GeMouseEvent) => void,
    private readonly onEdited?: (rowIndex: number, columnIndex: number) => void) {
    super();
  }

  override onMouseClicked(evt: GeMouseEvent): void {          // episode 023
    if (evt.areaIdent === "body" && evt.clickCount === 2) this.onRowDoubleClick?.(evt.rowIndex);
  }

  override onContextmenu(evt: GeMouseEvent): void {           // episode 023
    if (evt.areaIdent === "body" && evt.rowIndex > -1) this.onMenu?.(evt);
  }

  override onModelChanged(evt: GeModelChangeEvent): void {    // episode 031: a cell was edited
    for (const cell of evt.cells) this.onEdited?.(cell.rowIndex, cell.columnIndex);
  }

  override onSelectionChanged(model: SelectionModelIf): void {
    const ranges = model.getRanges().filter(r => !r.gammaRange);
    if (!ranges.length) return this.show("nothing selected");
    const cells = ranges.reduce((n, r) => n + (r.r2 - r.r1 + 1) * (r.c2 - r.c1 + 1), 0);
    const r = ranges[ranges.length - 1];
    this.show(`${cells.toLocaleString("en")} cells selected · rows ${r.r1 + 1}–${r.r2 + 1} · ⌘/Ctrl+C copies`);
  }
}
