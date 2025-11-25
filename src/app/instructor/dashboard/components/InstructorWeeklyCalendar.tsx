// src/app/instructor/dashboard/components/InstructorWeeklyCalendar.tsx
'use client';

import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { InstructorEventItem } from '../types';
import { INSTRUCTOR_THEME, INSTRUCTOR_BORDER, STATUS_COLOR } from '../constants';

// --- Keyframes (팝업 애니메이션) ---
const popoverFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- Styled Components ---

// [디자인 적용] 배경 투명, 테두리 제거 (부모 컨테이너와 자연스럽게 연결)
const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;

  background: transparent;
  box-shadow: none;
  border: none;
  padding: 0;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
`;

const CalendarWrapper = styled.div`
  flex: 1;

  /* 1. 캘린더 툴바 커스텀 */
  .fc-header-toolbar {
    margin-bottom: 20px !important;
    padding: 0 4px;
  }
  .fc-toolbar-title {
    font-size: 1.25rem !important;
    font-weight: 800 !important;
    color: #1e293b;
    letter-spacing: -0.5px;
  }
  .fc-button {
    background: #fff !important;
    border: 1px solid #e2e8f0 !important;
    color: #475569 !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    padding: 8px 14px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
    transition: all 0.2s;

    &:hover {
      background: #f8fafc !important;
      color: #3b82f6 !important;
      border-color: #3b82f6 !important;
    }
    &:focus { box-shadow: none !important; }
    &:active { transform: translateY(1px); }
  }
  .fc-button-active {
    background: #eff6ff !important;
    color: #3b82f6 !important;
    border-color: #bfdbfe !important;
  }

  /* 2. 그리드 및 헤더 */
  .fc-theme-standard td, .fc-theme-standard th {
    border-color: #f1f5f9 !important;
  }
  .fc-col-header-cell {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0 !important;
    padding: 10px 0;
  }
  .fc-col-header-cell-cushion {
    text-decoration: none !important;
    color: inherit !important;
  }
  .fc-day-today {
    background: transparent !important;
  }

  /* 3. 이벤트 카드 기본 스타일 */
  .fc-daygrid-event {
    margin: 3px 6px !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
    border-radius: 6px;
    transition: transform 0.1s;

    &:hover {
      transform: translateY(-2px);
      z-index: 5;
    }
  }

  /* 4. 더보기 링크 */
  .fc-daygrid-more-link {
    color: #64748b !important;
    font-size: 0.75rem;
    font-weight: 700;
    text-decoration: none !important;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    margin-top: 4px;
  }

  /* =========================================
     [디자인 적용] 팝업(Popover) 스타일 업그레이드
     ========================================= */
  .fc-popover {
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
    background: #ffffff !important;
    z-index: 1000 !important;
    overflow: hidden;
    animation: ${popoverFadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .fc-popover-header {
    background: #ffffff !important;
    padding: 16px 16px 8px 16px !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: none !important;
  }

  .fc-popover-title {
    font-family: 'Pretendard';
    font-size: 1.1rem !important;
    font-weight: 800 !important;
    color: #1e293b !important;
    letter-spacing: -0.5px;
  }

  .fc-popover-close {
    opacity: 0.6;
    background: #f1f5f9 !important;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem !important;
    cursor: pointer;
    transition: all 0.2s;
  }
  .fc-popover-close:hover {
    opacity: 1;
    background: #e2e8f0 !important;
    color: #ef4444;
  }

  .fc-popover-body {
    padding: 12px 16px 16px 16px !important;
    background: #ffffff !important;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  }

  .fc-popover-body .fc-daygrid-event {
    margin-bottom: 8px !important;
  }
`;

// 헤더 (요일 + 날짜) - 매니저와 동일한 디자인
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
`;

const WeekdayText = styled.span<{ $isToday: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.$isToday ? '#3b82f6' : '#94a3b8')};
  font-weight: 700;
  text-transform: uppercase;
`;

const DateCircle = styled.div<{ $isToday: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: ${(props) => (props.$isToday ? '800' : '600')};

  color: ${(props) => (props.$isToday ? '#ffffff' : '#334155')};
  background-color: ${(props) => (props.$isToday ? '#3b82f6' : 'transparent')};
  box-shadow: ${(props) => (props.$isToday ? '0 4px 10px rgba(59, 130, 246, 0.4)' : 'none')};
`;

// 이벤트 카드 - [기능 유지] 상태(Variant)에 따른 스타일링 유지하되 디자인 고도화
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

type Props = {
  events: InstructorEventItem[];
  onEventClick?: (event: InstructorEventItem) => void;
};

export default function InstructorWeeklyCalendar({ events, onEventClick }: Props) {
  const fcEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true,
        runTime: e.start,
        extendedProps: e,
      })),
    [events],
  );

  return (
    <WidgetContainer>
      <CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          locale="ko"
          headerToolbar={{ left: 'title', center: '', right: 'prev,next today' }}
          height="100%"
          events={fcEvents}
          // [디자인 적용] 헤더 디자인 (요일+날짜)
          dayHeaderContent={(args) => {
            const date = args.date;
            const dayNumber = date.getDate();
            const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });

            return (
              <HeaderContainer>
                <WeekdayText $isToday={args.isToday}>{weekday}</WeekdayText>
                <DateCircle $isToday={args.isToday}>{dayNumber}</DateCircle>
              </HeaderContainer>
            );
          }}
          dayMaxEventRows={3}
          moreLinkClick="popover"
          moreLinkContent={(args) => `+${args.num}`}
          eventOrder="runTime"
          eventClick={(info) => onEventClick?.(info.event.extendedProps as InstructorEventItem)}
          eventContent={(arg) => {
            const item = arg.event.extendedProps as InstructorEventItem;
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
          }}
        />
      </CalendarWrapper>
    </WidgetContainer>
  );
}