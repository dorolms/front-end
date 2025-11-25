"use client";

import styled from "styled-components";

export type LectureTab = "LIST" | "CALENDAR";

type Props = {
  activeTab: LectureTab;
  onChangeTab: (tab: LectureTab) => void;
};

export default function LectureTabs({ activeTab, onChangeTab }: Props) {
  return (
    <TabBar>
      <TabButton
        $active={activeTab === "LIST"}
        onClick={() => onChangeTab("LIST")}
      >
        목록 보기
      </TabButton>

      <TabButton
        $active={activeTab === "CALENDAR"}
        onClick={() => onChangeTab("CALENDAR")}
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
  margin-bottom: 24px;
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
