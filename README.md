# GuiExpert Table – Schritt für Schritt (Demo-App)

Demo-App zur Videoreihe **„GuiExpert Table Schritt für Schritt“** (60-Sekunden-Folgen, DE + EN).
Jede Folge hat einen eigenen Stand: `git checkout ep-NNN`.

- Bibliothek: [`@guiexpert/table`](https://www.npmjs.com/package/@guiexpert/table) – MIT, null Runtime-Abhängigkeiten
- Doku & Showcases: https://gui.expert
- Quellcode der Bibliothek: https://github.com/guiexperttable/mono

```bash
git clone https://github.com/krocon/guiexpert-table-step-by-step-demo.git
cd guiexpert-table-step-by-step-demo
git checkout ep-001        # Stand einer Folge
npm i
npm run dev                # → http://localhost:5173
```

Testdaten: `src/data/orders.ts` erzeugt beliebig viele Bestellungen (`createOrders(n)`), immer dieselben (fester Seed).

---

## Folge 001 – Warum große Tabellen den Browser lahmlegen

Die „naive“ Tabelle: 100.000 Bestellungen, für jede Zeile ein `<tr>`, für jeden Wert ein `<td>`.

```bash
npm run dev   # → http://localhost:5173/naive/
```

Oben rechts steht, wie lange das erste Zeichnen dauert und wie viele DOM-Elemente entstehen.
Ein Klick auf einen Spaltenkopf sortiert – und baut dabei **alle** Zellen neu.

Für schwächere Rechner: `/naive/?rows=10000`.

Gemessen in Chromium (headless, Linux-VM, Okt. 2026) – auf deinem Rechner sind die Zahlen kleiner, der Verlauf ist gleich:

| Zeilen | DOM-Elemente | erstes Rendern | Sortieren (alles neu) |
|---:|---:|---:|---:|
| 1.000 | 12.014 | 0,2 s | 0,2 s |
| 10.000 | 120.014 | 2,7 s | 2,9 s |
| 25.000 | 300.014 | 11,7 s | 11,9 s |
| 50.000 | 600.014 | 41,5 s | 44,4 s |
| 100.000 | 1.200.014 | > 2 min (Browser blockiert) | – |

Doppelt so viele Zeilen ≠ doppelt so lange: Layout und Speicher wachsen schneller als die Zeilenzahl.
Und das ist nur **anzeigen** – fixierte Spalten, Spaltenbreiten, Tastatur, Auswahl, Kopieren und Export fehlen noch.
