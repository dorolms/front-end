"use client";

import styled from "styled-components";

// 타입 파일 따로 안 쓰고 바로 안에서 정의
export type LectureStatus = "CONFIRMED" | "PENDING" | "APPLIED";

type Props = {
  selected: LectureStatus[];
  onChange: (next: LectureStatus[]) => void;
};

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const FilterButton = styled.button<{
  active: boolean;
  status: LectureStatus;
}>`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border-width: 1.5px;
  border-style: solid;

  ${({ status, active }) =>
    status === "CONFIRMED" &&
    `
    border-color: #5f3ff8;
    background: ${active ? "#e8ddff" : "#f8f5ff"};
    color: #2b1779;
  `}

  ${({ status, active }) =>
    status === "PENDING" &&
    `
    border-color: #5f3ff8;
    border-style: dashed;
    background: ${active ? "#eef1ff" : "#ffffff"};
    color: #2b1779;
  `}

  ${({ status, active }) =>
    status === "APPLIED" &&
    `
    border-color: #f4b000;
    background: ${active ? "#fff4d6" : "#fffdf4"};
    color: #7a5200;
  `}
`;

const LABELS = {
  CONFIRMED: "확정됨",
  PENDING: "확정 대기",
  APPLIED: "신청됨",
};

export function StatusFilterBar({ selected, onChange }: Props) {
  const toggle = (status: LectureStatus) => {
    const exists = selected.includes(status);
    const next = exists
      ? selected.filter((s) => s !== status)
      : [...selected, status];

    onChange(next);
  };

  return (
    <Wrapper>
      {(Object.keys(LABELS) as LectureStatus[]).map((s) => (
        <FilterButton
          key={s}
          status={s}
          active={selected.includes(s)}
          onClick={() => toggle(s)}
        >
          {LABELS[s]}
        </FilterButton>
      ))}
    </Wrapper>
  );
}
