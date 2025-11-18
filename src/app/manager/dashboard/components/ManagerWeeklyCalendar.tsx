'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { ManagerEventItem } from '../types';
import { MANAGER_THEME, MANAGER_BORDER } from '../constants';

// --- 스타일 정의 ---
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;

  /* 1. 캘린더 툴바 (헤더) */
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
      box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;

      &:hover { background: #f9fafb !important; }
      &:active { transform: translateY(0); }
      &:focus { box-shadow: none !important; }
    }
  }

  /* 2. [중요] 오늘 날짜 노란 배경 제거 (투명하게 설정) */
  .fc .fc-day-today {
    background: transparent !important;
  }

  /* 3. 그리드 선 & 헤더 스타일 */
  .fc-theme-standard td, .fc-theme-standard th {
    border-color: #f3f4f6 !important; /* 아주 연한 회색 선 */
  }
  .fc-col-header-cell {
    border-bottom: 1px solid #f3f4f6 !important;
    padding: 12px 0;
    vertical-align: middle;
  }
  .fc-col-header-cell-cushion { /* 헤더 텍스트 링크 스타일 제거 */
    display: block !important;
    text-decoration: none !important;
    color: inherit !important;
  }

  /* 4. 이벤트 카드 및 셀 여백 */
  .fc-daygrid-event {
    margin: 2px 4px !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
  }
  .fc-daygrid-day-frame {
    min-height: 100px; /* 셀 높이 확보 */
  }

  /* 5. 더보기(+more) 팝업 */
  .fc-popover {
    border: none !important;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15) !important;
    border-radius: 12px !important;
    z-index: 1000 !important;
  }
  .fc-popover-header { background: #fff !important; border-bottom: 1px solid #eee; }
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

// --- 컴포넌트 스타일 ---

// 헤더 내부 컨테이너 (요일 + 날짜)
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

// 요일 텍스트 (월, 화, 수...)
const WeekdayText = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
  font-weight: 600;
`;

// 날짜 숫자 (오늘이면 검은 원, 아니면 일반 숫자)
const DateCircle = styled.div<{ $isToday: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;

  /* 오늘일 때 스타일: 검은 배경 + 흰 글씨 + 그림자 */
  font-weight: ${(props) => (props.$isToday ? '700' : '500')};
  color: ${(props) => (props.$isToday ? '#ffffff' : '#374151')};
  background-color: ${(props) => (props.$isToday ? '#111111' : 'transparent')};
  box-shadow: ${(props) => (props.$isToday ? '0 4px 6px -1px rgba(0,0,0,0.2)' : 'none')};

  transition: all 0.2s ease;
`;

// 이벤트 카드 디자인
const EventCard = styled.div<{ $bg: string; $border: string }>`
  width: 100%;
  padding: 5px 8px;
  background-color: ${(props) => props.$bg};
  border-left: 3px solid ${(props) => props.$border};
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: transform 0.1s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.98);
  }
`;

const TimeRow = styled.div`
  font-size: 0.7rem; font-weight: 600; color: #6b7280;
  display: flex; justify-content: space-between;
`;
const TitleRow = styled.div`
  font-size: 0.8rem; font-weight: 700; color: #1f2937;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const LocationRow = styled.div`
  font-size: 0.7rem; color: #6b7280;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

type Props = {
  events: ManagerEventItem[];
  onEventClick?: (event: ManagerEventItem) => void;
};

export default function ManagerWeeklyCalendar({ events, onEventClick }: Props) {
  const validEvents = useMemo(() =>
    events.filter(e => e.status === 'CONFIRMED'),
  [events]);

  const fcEvents = useMemo(() =>
    validEvents.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: true,
      runTime: e.start,
      extendedProps: e,
    })),
    [validEvents]
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

        // 헤더 커스텀 (요일 + 날짜 원형)
        dayHeaderContent={(args) => {
          const date = args.date;
          const dayNumber = date.getDate();
          const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });

          return (
            <HeaderContainer>
              <WeekdayText>{weekday}</WeekdayText>
              <DateCircle $isToday={args.isToday}>
                {dayNumber}
              </DateCircle>
            </HeaderContainer>
          );
        }}

        dayMaxEventRows={3}
        moreLinkClick="popover"
        moreLinkContent={(args) => `+${args.num}`}
        eventOrder="runTime"
        eventClick={(info) => onEventClick?.(info.event.extendedProps as ManagerEventItem)}
        eventContent={(arg) => {
          const item = arg.event.extendedProps as ManagerEventItem;
          // @ts-ignore
          const bg = MANAGER_THEME[item.category] || MANAGER_THEME.ETC;
          // @ts-ignore
          const border = MANAGER_BORDER[item.category] || MANAGER_BORDER.ETC;

          const start = new Date(item.start);
          const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;

          return (
            <EventCard $bg={bg} $border={border}>
              <TimeRow>{timeStr}</TimeRow>
              <TitleRow>{item.title}</TitleRow>
              {item.location && <LocationRow>{item.location}</LocationRow>}
            </EventCard>
          );
        }}
      />
    </Wrap>
  );
}