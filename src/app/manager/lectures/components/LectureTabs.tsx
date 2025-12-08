"use client";

import styled from "styled-components";

export type LectureTab = "list" | "calender";

type Props = {
  value: LectureTab;
  onChange: (tab: LectureTab) => void;
};

export default function LectureTabs({ value, onChange }: Props) {
  return (
    <TabBar>
      <TabButton
        $active={value === "list"}
        onClick={() => onChange("list")}
      >
        목록 보기
      </TabButton>

      <TabButton
        $active={value === "calender"}
        onClick={() => onChange("calender")}
      >
        캘린더 보기
      </TabButton>
    </TabBar>
  );
}

/* ---------------------- styled ---------------------- */

const TabBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 0px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;

  background: ${({ $active }) => ($active ? "#2563eb" : "#e2e8f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#475569")};

  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#1d4ed8" : "#cbd5e1")};
  }
`;
