// src/app/instructor/dashboard/components/InstructorEventCard.tsx
'use client';

import styled from 'styled-components';
import type { InstructorEventItem } from '../types';
import { INSTRUCTOR_THEME, INSTRUCTOR_BORDER, STATUS_COLOR } from '../constants';

// ───────────────── 이벤트 카드 스타일 (기존 코드 그대로) ─────────────────
const EventCard = styled.div<{
  $variant: 'solid' | 'applied' | 'pending';
  $bg: string;
  $borderColor: string;
}>`
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: relative;
  overflow: hidden;

  ${(p) =>
    p.$variant === 'solid'
      ? `
    background-color: ${p.$bg};
    border-left: 4px solid ${p.$borderColor};
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  `
      : p.$variant === 'applied'
      ? `
    background-color: #ffffff;
    border: 1px solid ${p.$borderColor};
    border-left: 4px solid ${p.$borderColor}; /* 신청 상태도 왼쪽 라인 강조 */
  `
      : `
    background-color: #fafafa;
    border: 1px dashed ${p.$borderColor};
    border-left: 4px solid ${p.$borderColor};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  }
`;

const TimeRow = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleRow = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const LocationRow = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ $color: string }>`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${(p) => p.$color};
  background: #fff;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid ${(p) => p.$color};
  line-height: 1.2;
`;

// ───────────────── 이벤트 카드 컴포넌트 ─────────────────

export type InstructorEventCardProps = {
  item: InstructorEventItem;
};

export default function InstructorEventCard({ item }: InstructorEventCardProps) {
  // @ts-ignore
  const bg = INSTRUCTOR_THEME[item.category] || INSTRUCTOR_THEME.ETC;
  // @ts-ignore
  const borderColor = INSTRUCTOR_BORDER[item.category] || INSTRUCTOR_BORDER.ETC;

  const start = new Date(item.start);
  const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  let variant: 'solid' | 'applied' | 'pending' = 'solid';
  let statusLabel = '배정됨';
  let statusColor = STATUS_COLOR.CONFIRMED;

  if (item.instructorStatus === 'APPLIED') {
    variant = 'applied';
    statusLabel = '신청됨';
    statusColor = STATUS_COLOR.APPLIED;
  } else if (item.instructorStatus === 'PENDING') {
    variant = 'pending';
    statusLabel = '확정대기';
    statusColor = STATUS_COLOR.PENDING;
  }

  return (
    <EventCard $variant={variant} $bg={bg} $borderColor={borderColor}>
      <TimeRow>
        <span>{timeStr}</span>
        <StatusBadge $color={statusColor}>{statusLabel}</StatusBadge>
      </TimeRow>
      <TitleRow>{item.title}</TitleRow>
      {item.location && <LocationRow>{item.location}</LocationRow>}
    </EventCard>
  );
}
