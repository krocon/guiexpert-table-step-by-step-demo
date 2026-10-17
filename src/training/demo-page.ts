// Episodes 035–039: the live demos of the training chapters (https://gui.expert/training/) run as pages here.
// A demo gets a small context: the table host and a toolbar in the app header (buttons, search, checkbox, info).
import "@guiexpert/table/css/main.css";
import "../style.css";

export interface DemoContext {
  /** the element the table is rendered into – it already has a fixed height */
  host: HTMLDivElement;
  /** the page */
  root: HTMLElement;
  /** status text in the header */
  info(text: string): void;
  /** a button in the header */
  button(label: string, onClick: (button: HTMLButtonElement) => void): HTMLButtonElement;
  /** a search field in the header */
  search(placeholder: string, onInput: (value: string) => void): HTMLInputElement;
  /** a range slider in the header */
  range(label: string, min: number, max: number, step: number, onInput: (value: number) => void): HTMLInputElement;
  /** a checkbox in the header */
  toggle(label: string, checked: boolean, onChange: (checked: boolean) => void): HTMLInputElement;
}

export type DemoFn = (ctx: DemoContext) => void | (() => void);

/** Formats numbers the same way in every demo: 100,000 */
export const fmt = (n: number) => n.toLocaleString("en");

/** Milliseconds since t0, rounded. */
export const since = (t0: number) => Math.round(performance.now() - t0);

/** Starts a demo: the header (`.app-header`) gets its controls, `.table-div` is the table host. */
export function runDemo(demo: DemoFn): void {
  const header = document.querySelector<HTMLElement>(".app-header")!;
  const host = document.querySelector<HTMLDivElement>(".table-div")!;
  const infoEl = document.createElement("span");
  infoEl.id = "info";
  const add = <T extends HTMLElement>(el: T): T => { header.insertBefore(el, infoEl); return el; };
  header.appendChild(infoEl);
  demo({
    host,
    root: document.body,
    info: text => { infoEl.textContent = text; },
    button(label, onClick) {
      const b = add(document.createElement("button"));
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => onClick(b));
      return b;
    },
    search(placeholder, onInput) {
      const input = add(document.createElement("input"));
      input.type = "search";
      input.placeholder = placeholder;
      input.addEventListener("input", () => onInput(input.value));
      return input;
    },
    range(label, min, max, step, onInput) {
      const wrap = add(document.createElement("label"));
      const input = document.createElement("input");
      Object.assign(input, { type: "range", min: String(min), max: String(max), step: String(step), value: String(min) });
      input.addEventListener("input", () => onInput(Number(input.value)));
      wrap.append(label + " ", input);
      return input;
    },
    toggle(label, checked, onChange) {
      const wrap = add(document.createElement("label"));
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = checked;
      input.addEventListener("change", () => onChange(input.checked));
      wrap.append(input, " " + label);
      return input;
    },
  });
}
