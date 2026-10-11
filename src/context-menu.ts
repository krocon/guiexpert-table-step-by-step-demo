// Episode 023 – a context menu of your own: no built-in menu, so it looks and works exactly as you want.
export interface MenuItem {
  label: string;
  action: () => void;
}

export function showContextMenu(event: MouseEvent, items: MenuItem[]): void {
  event.preventDefault();                                   // no browser menu
  closeContextMenu();
  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;
  for (const item of items) {
    const button = menu.appendChild(document.createElement("button"));
    button.textContent = item.label;
    button.addEventListener("click", () => {
      closeContextMenu();
      item.action();
    });
  }
  document.body.appendChild(menu);
}

export function closeContextMenu(): void {
  document.querySelector(".context-menu")?.remove();
}

// close on any click outside and on Escape
document.addEventListener("mousedown", e => {
  if (!(e.target as HTMLElement).closest(".context-menu")) closeContextMenu();
});
document.addEventListener("keydown", e => e.key === "Escape" && closeContextMenu());
