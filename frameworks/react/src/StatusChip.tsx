// Episode 026 – a React component as cell renderer. Hooks work: it is rendered as a real element.
import { useState } from "react";

interface CellProps { cellValue: string; rowIndex: number }

export function StatusChip({ cellValue, rowIndex }: CellProps) {
  const [hover, setHover] = useState(false);
  return (
    <span className={`status-badge status-${cellValue}`}
          title={`row ${rowIndex + 1}`}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover ? "● " : ""}{cellValue}
    </span>
  );
}
