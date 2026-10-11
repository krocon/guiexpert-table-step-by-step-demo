/**
 * Test data for the whole series: deterministic orders (same seed → same rows in every run and in every video).
 */
export interface Order {
  id: number;
  date: string;          // ISO date, e.g. "2026-03-14"
  customer: string;
  country: string;
  city: string;
  product: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
  status: "open" | "paid" | "shipped" | "cancelled";
}

const CUSTOMERS = ["Müller GmbH", "Schmidt & Co", "Nordlicht AG", "Becker KG", "Hansen Logistik", "Rossi S.p.A.",
  "Dupont SA", "Smith Ltd", "Kowalski Sp.", "Novák s.r.o.", "Jensen ApS", "García SL"];
const LOCATIONS: [string, string][] = [["Germany", "Hamburg"], ["Germany", "Berlin"], ["Germany", "Munich"],
  ["Austria", "Vienna"], ["Switzerland", "Zurich"], ["France", "Paris"], ["Italy", "Milan"], ["Spain", "Madrid"],
  ["Poland", "Warsaw"], ["Denmark", "Copenhagen"], ["United Kingdom", "London"], ["Czechia", "Prague"]];
const PRODUCTS: [string, string, number][] = [["Laptop", "Hardware", 1299], ["Monitor", "Hardware", 349],
  ["Keyboard", "Accessories", 89], ["Mouse", "Accessories", 39], ["Docking Station", "Accessories", 219],
  ["Office License", "Software", 129], ["IDE License", "Software", 249], ["Cloud Credits", "Services", 500],
  ["Support Plan", "Services", 990], ["Headset", "Accessories", 149]];
const STATUS: Order["status"][] = ["open", "paid", "shipped", "shipped", "paid", "cancelled"];

/** Small seeded PRNG (mulberry32) – no dependency, reproducible. */
function random(seed: number): () => number {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createOrders(count: number, seed = 42): Order[] {
  const rnd = random(seed);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
  const start = Date.UTC(2025, 0, 1);
  const orders: Order[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const [country, city] = pick(LOCATIONS);
    const [product, category, basePrice] = pick(PRODUCTS);
    const quantity = 1 + Math.floor(rnd() * 20);
    const price = Math.round(basePrice * (0.85 + rnd() * 0.3) * 100) / 100;
    orders[i] = {
      id: i + 1,
      date: new Date(start + Math.floor(rnd() * 640) * 86_400_000).toISOString().slice(0, 10),
      customer: pick(CUSTOMERS),
      country, city, product, category, quantity, price,
      total: Math.round(quantity * price * 100) / 100,
      status: pick(STATUS)
    };
  }
  return orders;
}
