"use client";

import styled from "styled-components";

export type LectureStatus = "recruiting" | "allocating" | "completed";

type Props = {
  selected: LectureStatus[];
  onChange: (next: LectureStatus[]) => void;
};

const Wrapper = styled.section`
  display: flex;
  gap: 8px;
  padding: 8px 16px 12px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active: boolean }>`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? "#111827" : "#E5E7EB")};
  background: ${({ $active }) => ($active ? "#111827" : "#FFF")};
  color: ${({ $active }) => ($active ? "#FFF" : "#374151")};
`;

const OPTIONS: { value: LectureStatus; label: string }[] = [
  { value: "recruiting", label: "모집중" },
  { value: "allocating", label: "배정중" },
  { value: "completed", label: "완료" },
];

export function AllStatusFilterBar({ selected, onChange }: Props) {
  const toggle = (value: LectureStatus) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  };

  return (
    <Wrapper>
      {OPTIONS.map((opt) => (
        <Chip
          key={opt.value}
          $active={selected.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          type="button"
        >
          {opt.label}
        </Chip>
      ))}
    </Wrapper>
  );
}

export default AllStatusFilterBar;
