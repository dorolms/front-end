// src/app/manager/dashboard/components/ManagerWeeklyCalendar.tsx
'use client';

import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { ManagerEventItem } from '../types';
import { MANAGER_THEME, MANAGER_BORDER } from '../constants';

// --- Keyframes (팝업 애니메이션) ---
const popoverFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- Styled Components ---

// [수정 1] 배경, 테두리, 그림자를 제거하여 부모 박스에 자연스럽게 녹아들도록 변경
const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;

  /* 배경 투명, 테두리/그림자 제거 */
  background: transparent;
  box-shadow: none;
  border: none;
  padding: 0;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  /* 폰트 설정 */
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

  /* 4. 더보기 링크 (+2 등) */
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
     [수정 2] 팝업(Popover) 디자인 업그레이드
     ========================================= */
  .fc-popover {
    border: none !important;
    border-radius: 16px !important;
    /* 깊이감 있는 그림자 */
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
    background: #ffffff !important;
    z-index: 1000 !important;
    overflow: hidden;
    /* 등장 애니메이션 적용 */
    animation: ${popoverFadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* 팝업 헤더 */
  .fc-popover-header {
    background: #ffffff !important;
    padding: 16px 16px 8px 16px !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: none !important;
  }

  /* 팝업 날짜 제목 */
  .fc-popover-title {
    font-family: 'Pretendard';
    font-size: 1.1rem !important;
    font-weight: 800 !important;
    color: #1e293b !important;
    letter-spacing: -0.5px;
  }

  /* 닫기 버튼 (X) */
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
    color: #ef4444; /* 포인트 레드 */
  }

  /* 팝업 바디 */
  .fc-popover-body {
    padding: 12px 16px 16px 16px !important;
    background: #ffffff !important;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  }

  /* 팝업 내부 이벤트 카드 간격 */
  .fc-popover-body .fc-daygrid-event {
    margin-bottom: 8px !important;
  }
`;

// 헤더 내부 컨테이너 (요일 + 날짜)
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

// 이벤트 카드 디자인
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
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  line-height: 1.2;
`;
const LocationRow = styled.div`
  font-size: 0.75rem;
  color: #64748b;
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
    <WidgetContainer>
      <CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          locale="ko"
          // 만약 부모 페이지에서 헤더를 이미 제어 중이라면 headerToolbar={false}로 변경하세요.
          headerToolbar={{ left: 'title', center: '', right: 'prev,next today' }}
          height="100%"
          events={fcEvents}
          dayHeaderContent={(args) => {
            const date = args.date;
            const dayNumber = date.getDate();
            const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
            return (
              <HeaderContainer>
                <WeekdayText $isToday={args.isToday}>{weekday}</WeekdayText>
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
            const bg = MANAGER_THEME[item.category] || '#f1f5f9';
            // @ts-ignore
            const border = MANAGER_BORDER[item.category] || '#cbd5e1';
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
      </CalendarWrapper>
    </WidgetContainer>
  );
}