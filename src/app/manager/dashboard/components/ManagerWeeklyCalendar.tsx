'use client';

import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { ManagerEventItem } from '../types';
import ManagerCalendarEventCard from './ManagerCalendarEventCard';

// --- 애니메이션 ---
const popoverFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- 스타일 컴포넌트 ---
const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
`;

const CalendarWrapper = styled.div`
  flex: 1;

  /* 1. 툴바 스타일 */
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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s;
    &:hover { background: #f8fafc !important; color: #3b82f6 !important; border-color: #3b82f6 !important; }
    &:active { transform: translateY(1px); }
  }
  .fc-button-active {
    background: #eff6ff !important; color: #3b82f6 !important; border-color: #bfdbfe !important;
  }

  /* 2. 그리드 스타일 */
  .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9 !important; }
  .fc-col-header-cell { background: #f8fafc; border-bottom: 1px solid #e2e8f0 !important; padding: 10px 0; }
  .fc-col-header-cell-cushion { text-decoration: none !important; color: inherit !important; }
  .fc-day-today { background: transparent !important; }

  /* 3. 이벤트 슬롯 스타일 (투명하게 처리하여 카드만 보이게 함) */
  .fc-daygrid-event {
    margin: 2px 4px !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
    box-shadow: none !important;
    white-space: normal !important;

    &:hover { z-index: 5; }
  }

  /* 이벤트 내용 패딩 제거 */
  .fc-event-main { padding: 0 !important; }

  /* 4. 더보기 링크 */
  .fc-daygrid-more-link {
    color: #64748b !important; font-size: 0.75rem; font-weight: 700;
    text-decoration: none !important; background: #f1f5f9;
    padding: 2px 8px; border-radius: 12px; display: inline-block; margin-top: 4px;
  }

  /* 5. 팝오버 스타일 */
  .fc-popover {
    border: none !important; border-radius: 16px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
    background: #ffffff !important; z-index: 1000 !important;
    animation: ${popoverFadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .fc-popover-header {
    background: #ffffff !important; padding: 16px 16px 8px 16px !important;
    display: flex; align-items: center; justify-content: space-between;
  }
  .fc-popover-title {
    font-family: 'Pretendard'; font-size: 1.1rem !important; font-weight: 800 !important;
    color: #1e293b !important;
  }
  .fc-popover-close {
    opacity: 0.6; background: #f1f5f9 !important; border-radius: 50%;
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .fc-popover-body { padding: 12px 16px 16px 16px !important; }
`;

const HeaderContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px 0;
`;
const WeekdayText = styled.span<{ $isToday: boolean }>`
  font-size: 0.75rem; color: ${(props) => (props.$isToday ? '#3b82f6' : '#94a3b8')};
  font-weight: 700; text-transform: uppercase;
`;
const DateCircle = styled.div<{ $isToday: boolean }>`
  width: 32px; height: 32px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: ${(props) => (props.$isToday ? '800' : '600')};
  color: ${(props) => (props.$isToday ? '#ffffff' : '#334155')};
  background-color: ${(props) => (props.$isToday ? '#3b82f6' : 'transparent')};
  box-shadow: ${(props) => (props.$isToday ? '0 4px 10px rgba(59, 130, 246, 0.4)' : 'none')};
`;

type Props = {
  events: ManagerEventItem[];
  onEventClick?: (event: ManagerEventItem) => void;
};

export default function ManagerWeeklyCalendar({ events, onEventClick }: Props) {

  // FullCalendar 데이터 포맷으로 변환
  const fcEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true, // 카드로 예쁘게 보여주기 위해 allDay 처리
        runTime: e.start, // 정렬용
        extendedProps: e,
      })),
    [events]
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

          // 헤더 커스텀
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

          // 클릭 이벤트 연결
          eventClick={(info) =>
            onEventClick?.(info.event.extendedProps as ManagerEventItem)
          }

          eventContent={(arg) => (
            <ManagerCalendarEventCard
              event={arg.event.extendedProps as ManagerEventItem}
            />
          )}
        />
      </CalendarWrapper>
    </WidgetContainer>
  );
}