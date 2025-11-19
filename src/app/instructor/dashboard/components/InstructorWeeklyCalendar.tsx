// src/app/instructor/dashboard/components/InstructorWeeklyCalendar.tsx
'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { InstructorEventItem } from '../types';
import { INSTRUCTOR_THEME, INSTRUCTOR_BORDER, STATUS_COLOR } from '../constants';

// 캘린더 전체 래퍼 (manager와 동일)
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;

  .fc-header-toolbar {
    margin-bottom: 16px !important;
    padding: 0 4px;
  }
  .fc-toolbar-title {
    font-size: 1.25rem !important;
    font-weight: 800 !important;
    color: #111;
    letter-spacing: -0.5px;
  }
  .fc-button-group {
    gap: 6px;
    .fc-button {
      background: #ffffff !important;
      border: 1px solid #e5e7eb !important;
      color: #374151 !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      border-radius: 6px !important;
      padding: 6px 12px !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;

      &:hover {
        background: #f9fafb !important;
      }
      &:active {
        transform: translateY(0);
      }
      &:focus {
        box-shadow: none !important;
      }
    }
  }

  .fc .fc-day-today {
    background: transparent !important;
  }

  .fc-theme-standard td,
  .fc-theme-standard th {
    border-color: #f3f4f6 !important;
  }
  .fc-col-header-cell {
    border-bottom: 1px solid #f3f4f6 !important;
    padding: 12px 0;
    vertical-align: middle;
  }
  .fc-col-header-cell-cushion {
    display: block !important;
    text-decoration: none !important;
    color: inherit !important;
  }

  .fc-daygrid-event {
    margin: 2px 4px !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
  }
  .fc-daygrid-day-frame {
    min-height: 100px;
  }

  .fc-popover {
    border: none !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15) !important;
    border-radius: 12px !important;
    z-index: 1000 !important;
  }
  .fc-popover-header {
    background: #fff !important;
    border-bottom: 1px solid #eee;
  }
  .fc-daygrid-more-link {
    color: #6b7280 !important;
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none !important;
    display: block;
    text-align: center;
    margin-top: 4px;
  }
`;

// 헤더 (요일 + 날짜)
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const WeekdayText = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
  font-weight: 600;
`;

const DateCircle = styled.div<{ $isToday: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: ${(p) => (p.$isToday ? '700' : '500')};
  color: ${(p) => (p.$isToday ? '#ffffff' : '#374151')};
  background-color: ${(p) => (p.$isToday ? '#111111' : 'transparent')};
  box-shadow: ${(p) => (p.$isToday ? '0 4px 6px -1px rgba(0,0,0,0.2)' : 'none')};
  transition: all 0.2s ease;
`;

// 이벤트 카드
const EventCard = styled.div<{
  $variant: 'solid' | 'applied' | 'pending';
  $bg: string;
  $borderColor: string;
}>`
  width: 100%;
  padding: 5px 8px;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  ${(p) =>
    p.$variant === 'solid'
      ? `
    background-color: ${p.$bg};
    border-left: 3px solid ${p.$borderColor};
  `
      : p.$variant === 'applied'
      ? `
    background-color: #ffffff;
    border: 1px solid ${p.$borderColor};
  `
      : `
    background-color: #ffffff;
    border: 1px dashed ${p.$borderColor};
  `}

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
`;

const TimeRow = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
`;

const TitleRow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LocationRow = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ $color: string }>`
  font-size: 0.65rem;
  font-weight: 700;
  color: ${(p) => p.$color};
`;

type Props = {
  events: InstructorEventItem[];
  onEventClick?: (event: InstructorEventItem) => void;
};

export default function InstructorWeeklyCalendar({ events, onEventClick }: Props) {
  // 강사 대시보드에서는 신청/대기/확정 전부 보여줌
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
    <Wrap>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        locale="ko"
        headerToolbar={{ left: 'title', center: '', right: 'prev,next today' }}
        height="100%"
        events={fcEvents}
        dayHeaderContent={(args) => {
          const date = args.date;
          const dayNumber = date.getDate();
          const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });

          return (
            <HeaderContainer>
              <WeekdayText>{weekday}</WeekdayText>
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
    </Wrap>
  );
}
