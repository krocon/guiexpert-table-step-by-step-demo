import { TableOptions, TableOptionsIf } from "@guiexpert/table";

// Episode 019 – start with all defaults, change only what you need.
export function createOrderTableOptions(): TableOptionsIf {
  return {
    ...new TableOptions(),
    hoverRowVisible: true,                                  // highlight the row under the mouse
    hoverColumnVisible: false,                              // … but not the column
    columnsResizable: true,                                 // drag the column border
    columnsDraggable: true,                                 // drag a header to move the column
    verticalBorderVisible: false,                           // calmer look: only horizontal lines
    defaultRowHeights: { header: 40, body: 30, footer: 36 } // used by the TableFactory models
  };
}
