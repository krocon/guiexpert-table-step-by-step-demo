import { AreaModelArrayOfArrays, ColorRgb, GeCssColorUtil, ThreeColorGradientArg } from "@guiexpert/table";
import { Order } from "../data/orders";

// Episode 027 – revenue per city and month as a heatmap: the colour comes from the value.

export interface RevenueMatrix { months: string[]; rows: (string | number)[][]; min: number; max: number }

/** Aggregates the orders: one row per city, one column per month (revenue in thousand euro). */
export function revenueByCityAndMonth(orders: Order[]): RevenueMatrix {
  const perMonth = new Map<string, number>();
  for (const o of orders) perMonth.set(o.date.slice(0, 7), (perMonth.get(o.date.slice(0, 7)) ?? 0) + 1);
  const average = orders.length / perMonth.size;
  const months = [...perMonth.keys()].filter(m => perMonth.get(m)! > average / 2).sort();  // complete months
  const cities = [...new Set(orders.map(o => o.city))].sort();
  const sums = new Map<string, number>();
  for (const o of orders) {
    if (!months.includes(o.date.slice(0, 7))) continue;
    const key = `${o.city}|${o.date.slice(0, 7)}`;
    sums.set(key, (sums.get(key) ?? 0) + o.total);
  }
  const rows = cities.map(c => [c, ...months.map(m => Math.round((sums.get(`${c}|${m}`) ?? 0) / 1000))]);
  const values = rows.flatMap(r => r.slice(1) as number[]);
  return { months, rows, min: Math.min(...values), max: Math.max(...values) };
}

export class RevenueHeatmapModel extends AreaModelArrayOfArrays<string | number> {
  private readonly gradient: ThreeColorGradientArg;

  constructor(matrix: RevenueMatrix) {
    super("body", matrix.rows, 34);
    this.gradient = new ThreeColorGradientArg(
      matrix.min, new ColorRgb(255, 255, 255),                       // white
      (matrix.min + matrix.max) / 2, new ColorRgb(244, 114, 182),    // pink   (gui.expert)
      matrix.max, new ColorRgb(79, 70, 229));                        // indigo (gui.expert)
  }

  // called only for visible cells
  override getCustomStyleAt(rowIndex: number, columnIndex: number): { [key: string]: string } | undefined {
    if (columnIndex === 0) return undefined;            // city name
    const value = Number(this.getValueAt(rowIndex, columnIndex));
    return {
      "background-color": GeCssColorUtil.getThreeColorGradientRGB(value, this.gradient),
      "color": value > this.gradient.middleValue ? "#ffffff" : "#111827"
    };
  }
}
