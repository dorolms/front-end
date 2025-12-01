// src/components/calendar/StatusFilterBar.tsx
"use client";

import styled from "styled-components";

export type LectureStatus =
  | "CONFIRMED" // 확정됨
  | "PENDING" // 확정대기
  | "APPLIED"; // 신청됨

interface StatusFilterBarProps {
  selected: LectureStatus[];
  onChange: (value: LectureStatus[]) => void;
}

const STATUS_OPTIONS: { key: LectureStatus; label: string }[] = [
  { key: "CONFIRMED", label: "확정됨" },
  { key: "PENDING", label: "확정대기" },
  { key: "APPLIED", label: "신청됨" },
];

export function StatusFilterBar({ selected, onChange }: StatusFilterBarProps) {
  const toggle = (status: LectureStatus) => {
    if (selected.includes(status)) {
      onChange(selected.filter((s) => s !== status));
    } else {
      onChange([...selected, status]);
    }
  };

  return (
    <Wrapper>
      {STATUS_OPTIONS.map((item) => {
        const active = selected.includes(item.key);
        return (
          <StatusButton
            key={item.key}
            $active={active}
            onClick={() => toggle(item.key)}
          >
            {item.label}
          </StatusButton>
        );
      })}
    </Wrapper>
  );
}

/* ------------------------ 스타일 ------------------------ */

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const StatusButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? "#2563EB" : "#D1D5DB")};
  background: ${({ $active }) => ($active ? "#EFF6FF" : "#FFFFFF")};
  color: ${({ $active }) => ($active ? "#1D4ED8" : "#374151")};

  &:hover {
    background: ${({ $active }) => ($active ? "#DBEAFE" : "#F3F4F6")};
  }
`;

export default StatusFilterBar;
