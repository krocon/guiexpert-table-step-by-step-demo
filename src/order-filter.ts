import { Order } from "./data/orders";

// Episode 021 – the filter UI is yours, the table only asks: show this row?
export const orderFilter = { text: "", minTotal: 0 };

export function matchesOrder(order: Order): boolean {
  if (order.total < orderFilter.minTotal) return false;
  const query = orderFilter.text.trim().toLowerCase();
  if (!query) return true;
  return `${order.customer} ${order.country} ${order.city} ${order.product}`
    .toLowerCase().includes(query);
}
