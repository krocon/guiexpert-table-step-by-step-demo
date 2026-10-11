// Episode 029 – rowspan and colspan: a school timetable.
import "@guiexpert/table/css/main.css";
import "../src/style.css";
import "./timetable.css";
import { EventAdapter, SimpleDomService, TableFactory, TableOptions, TableScope } from "@guiexpert/table";
import { DAYS, TimetableModel } from "../src/model/timetable-model";

const tableModel = TableFactory.createTableModel({
  headerData: [["Time", ...DAYS]],
  bodyAreaModel: new TimetableModel(),
  columnSizes: [80, 170, 170, 170, 170, 170]
});
const host = document.querySelector<HTMLDivElement>(".table-div")!;
new TableScope(host, tableModel, new SimpleDomService(),
  { ...new TableOptions(), hoverRowVisible: false, hoverColumnVisible: false }, new EventAdapter()).firstInit();
document.querySelector("#info")!.textContent = "double periods = rowspan · breaks = colspan";
(window as any).__stats = {};
