"use client";

import type { EventStatus } from "../../types";

const STATUS_LIST: { value: EventStatus; label: string }[] = [
  { value: "APPLIED", label: "신청됨" },
  { value: "PENDING", label: "확정 대기" },
  { value: "CONFIRMED", label: "확정됨" },
];

export default function StatusFilterBar({
  value,
  onChange,
}: {
  value: EventStatus[];
  onChange: (next: EventStatus[]) => void;
}) {
  const toggle = (v: EventStatus) => {
    if (value.includes(v)) {
      onChange(value.filter((s) => s !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      {STATUS_LIST.map((s) => {
        const selected = value.includes(s.value);
        return (
          <button
            key={s.value}
            onClick={() => toggle(s.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: selected ? "1px solid #0EA5E9" : "1px solid #d0d0d0",
              background: selected ? "#E0F2FE" : "#fff",
              color: selected ? "#0369A1" : "#666",
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
