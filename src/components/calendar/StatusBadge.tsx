// src/components/calendar/StatusBadge.tsx
"use client";

import styled from "styled-components";

export type LectureStatus = "CONFIRMED" | "PENDING" | "APPLIED";

type Props = {
  status: LectureStatus;
  typeColor: string; // 강의 유형에 따른 색상
  children: React.ReactNode;
};

const Wrapper = styled.div<{ status: LectureStatus }>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;

  ${({ status }) =>
    status === "CONFIRMED" &&
    `
    border: 2px solid #3f3ffd;
    background: #e7e3ff;
  `}

  ${({ status }) =>
    status === "PENDING" &&
    `
    border: 2px dashed #3f3ffd;
    background: #ffffff;
  `}

  ${({ status }) =>
    status === "APPLIED" &&
    `
    border: 2px solid #f5c751;
    background: #fff9e5;
  `}
`;

const TypeColorBar = styled.div<{ color: string }>`
  width: 16px;
  height: 36px;
  border-radius: 4px;
  background: ${({ color }) => color};
`;

export function StatusBadge({ status, typeColor, children }: Props) {
  return (
    <Wrapper status={status}>
      <TypeColorBar color={typeColor} />
      <div>{children}</div>
    </Wrapper>
  );
}
