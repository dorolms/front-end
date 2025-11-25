// src/app/manager/dashboard/components/ManagerCalendarEventCard.tsx
'use client';

import styled from 'styled-components';
import type { ManagerEventItem } from '../types';
import { MANAGER_THEME, MANAGER_BORDER } from '../constants';

// 개별 이벤트 카드(시간/제목/장소)
const EventCard = styled.div<{ $bg: string; $border: string }>`
  width: 100%;
  padding: 8px 10px;
  background-color: ${(props) => props.$bg};
  border-left: 4px solid ${(props) => props.$border};
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
  overflow: hidden;
`;

const TimeRow = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(0,0,0,0.5);
  margin-bottom: 2px;
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

type Props = {
  event: ManagerEventItem;
};

/**
 * 매니저 대시보드에서 사용하는 공통 일정 카드 컴포넌트.
 * - FullCalendar의 eventContent, 다른 페이지 등에서 재사용 가능
 */
export default function ManagerCalendarEventCard({ event }: Props) {
  // 카테고리별 배경/테두리 색상 매핑
  // @ts-ignore
  const bg: string = MANAGER_THEME[event.category] || '#f1f5f9';
  // @ts-ignore
  const border: string = MANAGER_BORDER[event.category] || '#cbd5e1';

  // 시작 시각 표시 (HH:MM)
  const start = new Date(event.start);
  const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return (
    <EventCard $bg={bg} $border={border}>
      <TimeRow>{timeStr}</TimeRow>
      <TitleRow>{event.title}</TitleRow>
      {event.location && <LocationRow>{event.location}</LocationRow>}
    </EventCard>
  );
}
