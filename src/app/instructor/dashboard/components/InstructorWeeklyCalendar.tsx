// src/app/instructor/dashboard/components/InstructorWeeklyCalendar.tsx
'use client';

import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { InstructorEventItem } from '../types';

// 이벤트 카드 전용 컴포넌트 (원래 이 파일에 있던 카드 UI를 분리한 것)
import InstructorEventCard from './InstructorEventCard';

// --- Keyframes (팝업 애니메이션) ---
const popoverFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- Styled Components ---

// 캘린더 전체 위젯 컨테이너
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

// FullCalendar를 감싸는 래퍼 + FullCalendar 스타일 오버라이드
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

  /* 3. 이벤트 카드가 들어가는 영역 기본 스타일 */
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

  /* 4. 더보기 링크 스타일 */
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

  /* 팝업(Popover) 스타일 */
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

// 요일/날짜 헤더(상단)의 레이아웃
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
`;

// "일, 월, 화..." 텍스트
const WeekdayText = styled.span<{ $isToday: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.$isToday ? '#3b82f6' : '#94a3b8')};
  font-weight: 700;
  text-transform: uppercase;
`;

// 날짜 동그라미 (오늘은 파란 배경 + 그림자)
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

// 컴포넌트 외부에서 사용하는 props 타입
type Props = {
  events: InstructorEventItem[];
  onEventClick?: (event: InstructorEventItem) => void;
};

/**
 * 강사용 대시보드 주간 캘린더 컴포넌트
 * - FullCalendar dayGridWeek 기반
 * - 개별 이벤트 카드는 InstructorEventCard 컴포넌트에서 렌더링
 */
export default function InstructorWeeklyCalendar({ events, onEventClick }: Props) {
  // 전달받은 events를 FullCalendar용 이벤트 포맷으로 변환
  const fcEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true,
        runTime: e.start, // 정렬 기준으로 사용할 필드
        extendedProps: e, // 카드/모달에서 쓸 원본 데이터
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
          /* 상단 요일/날짜 헤더 렌더링 */
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
          /* 카드 클릭 시 상위에서 넘겨준 핸들러 호출 */
          eventClick={(info) => onEventClick?.(info.event.extendedProps as InstructorEventItem)}
          /* 실제 카드 UI는 분리된 InstructorEventCard에서 담당 */
          eventContent={(arg) => (
            <InstructorEventCard item={arg.event.extendedProps as InstructorEventItem} />
          )}
        />
      </CalendarWrapper>
    </WidgetContainer>
  );
}
