// InstructorStatusFilterBar.tsx
import React from "react";
import styled from "styled-components";

export type InstructorFilter = "ALL" | "RECRUITING" | "COMPLETED";

interface InstructorStatusFilterBarProps {
  activeFilter: InstructorFilter;
  onChangeFilter: (filter: InstructorFilter) => void;
}

const InstructorStatusFilterBar: React.FC<InstructorStatusFilterBarProps> = ({
  activeFilter,
  onChangeFilter,
}) => {
  return (
    <FilterContainer>
      <FilterLabel>필터:</FilterLabel>
      <FilterButtonGroup>
        <FilterButton
          $active={activeFilter === "ALL"}
          onClick={() => onChangeFilter("ALL")}>
          전체
        </FilterButton>
        <FilterButton
          $active={activeFilter === "RECRUITING"}
          onClick={() => onChangeFilter("RECRUITING")}>
          모집 중
        </FilterButton>
        <FilterButton
          $active={activeFilter === "COMPLETED"}
          onClick={() => onChangeFilter("COMPLETED")}>
          모집 완료
        </FilterButton>
      </FilterButtonGroup>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
`;

const FilterLabel = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const FilterButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.$active ? "#3B82F6" : "#E5E7EB")};
  background-color: ${(props) => (props.$active ? "#EFF6FF" : "white")};
  color: ${(props) => (props.$active ? "#3B82F6" : "#6B7280")};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

export default InstructorStatusFilterBar;
