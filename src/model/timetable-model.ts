import { AreaModelArrayOfArrays } from "@guiexpert/table";

// Episode 029 – connected cells: double periods (rowspan) and the break across all days (colspan).

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const TIMETABLE: string[][] = [
  ["08:00", "Math", "German", "English", "Physics", "Art"],
  ["08:45", "Math", "German", "English", "Physics", "Art"],
  ["09:30", "Biology", "Math", "History", "Chemistry", "Music"],
  ["10:15", "Break", "", "", "", ""],
  ["10:35", "English", "Sports", "Math", "German", "Computer Science"],
  ["11:20", "English", "Sports", "Math", "German", "Computer Science"],
  ["12:05", "Lunch", "", "", "", ""],
  ["13:00", "Chemistry", "Computer Science", "Sports", "Math", "Project"],
  ["13:45", "Ethics", "Computer Science", "Sports", "History", "Project"]
];

export class TimetableModel extends AreaModelArrayOfArrays<string> {
  constructor(rows: string[][] = TIMETABLE) {
    super("body", rows, 44);
  }

  private isBreak(rowIndex: number): boolean {
    return ["Break", "Lunch"].includes(this.getValueAt(rowIndex, 1));
  }

  // a break row: one cell over all five days
  override getColspanAt(rowIndex: number, columnIndex: number): number {
    return this.isBreak(rowIndex) && columnIndex === 1 ? DAYS.length : 1;
  }

  // the same subject in consecutive periods: one tall cell (only the first cell of the block spans)
  override getRowspanAt(rowIndex: number, columnIndex: number): number {
    if (columnIndex === 0 || this.isBreak(rowIndex)) return 1;
    const at = (row: number) => this.getValueAt(row, columnIndex);
    if (rowIndex > 0 && at(rowIndex) === at(rowIndex - 1)) return 1;      // covered by the cell above
    let span = 1;
    while (rowIndex + span < this.getRowCount() && at(rowIndex + span) === at(rowIndex)) span++;
    return span;
  }

  // colour per subject (CSS classes, see timetable/timetable.css)
  override getCustomClassesAt(rowIndex: number, columnIndex: number): string[] {
    if (columnIndex === 0) return ["tt-time"];
    if (this.isBreak(rowIndex)) return ["tt-break"];
    const subject = String(this.getValueAt(rowIndex, columnIndex));
    return ["tt-subject", `tt-${subject.toLowerCase().replace(/\s+/g, "-")}`];
  }
}
