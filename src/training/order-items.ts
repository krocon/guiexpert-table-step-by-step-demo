/**
 * The items of an order for the master/detail chapter (38): the ordered product plus up to three accessories,
 * deterministic per order id (same id → same items in every run and in every video).
 */
import type { Order } from "../data/orders";

export interface OrderItem {
  sku: string;
  product: string;
  quantity: number;
  price: number;
}

const EXTRAS: [string, number][] = [["Cable set", 19], ["Carrying case", 49], ["Extended warranty", 99],
  ["Setup service", 149], ["Adapter", 25], ["Cleaning kit", 12]];

/** The items of an order: its product (quantity × price) and 0 … 3 extras. */
export function itemsOf(order: Order): OrderItem[] {
  let seed = (order.id * 2654435761) % 2147483647 || 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  rnd(); rnd();                                         // warm up: neighbouring ids start alike
  const items: OrderItem[] = [{ sku: `P-${order.id}`, product: order.product, quantity: order.quantity, price: order.price }];
  const extras = Math.floor(rnd() * 4);
  for (let k = 0; k < extras; k++) {
    const [product, price] = EXTRAS[Math.floor(rnd() * EXTRAS.length)];
    items.push({ sku: `X-${order.id}-${k + 1}`, product, quantity: 1 + Math.floor(rnd() * 3), price });
  }
  return items;
}
