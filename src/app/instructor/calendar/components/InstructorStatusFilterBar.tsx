import React from 'react';
import styled from 'styled-components';
// types.ts에서 정의된 MyCalendarFilter 타입을 사용합니다.
import { MyCalendarFilter } from '../types'; 

interface InstructorStatusFilterBarProps {
  currentFilter: MyCalendarFilter;
  onFilterChange: (filter: MyCalendarFilter) => void;
}

// 필터 버튼 정의 및 레이블 매핑
const filters: { value: MyCalendarFilter; label: string; emoji: string }[] = [
  { value: 'all', label: '전체', emoji: '🗓️' },
  { value: 'ASSIGNED', label: '확정됨', emoji: '✅' },
  { value: 'PENDING', label: '배정대기', emoji: '🕒' },
];

const InstructorStatusFilterBar: React.FC<InstructorStatusFilterBarProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <FilterContainer>
      <FilterLabel>나의 강의 현황:</FilterLabel>
      <FilterButtonGroup>
        {filters.map((filter) => (
          <FilterButton
            key={filter.value}
            active={currentFilter === filter.value}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.emoji} {filter.label}
          </FilterButton>
        ))}
      </FilterButtonGroup>
    </FilterContainer>
  );
};

// --- Styled Components ---

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 20px;
`;

const FilterLabel = styled.div`
  font-weight: 700;
  color: #1F2937;
  font-size: 16px;
`;

const FilterButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 18px;
  border-radius: 9999px; /* Fully rounded */
  border: 2px solid ${props => props.active ? '#10B981' : '#D1D5DB'};
  background-color: ${props => props.active ? '#ECFDF5' : 'white'};
  color: ${props => props.active ? '#065F46' : '#6B7280'};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: ${props => props.active ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none'};

  &:hover {
    border-color: ${props => props.active ? '#059669' : '#9CA3AF'};
  }
`;

export default InstructorStatusFilterBar;