// src/app/instructor/dashboard/components/InstructorMonthlyCalendar.tsx
"use client";

import { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { InstructorEventItem } from "../types";

import InstructorEventCard from "./InstructorEventCard";

// --- Keyframes (팝업 애니메이션) ---
const popoverFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- Styled Components ---

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
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    Roboto, sans-serif;
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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s;

    &:hover {
      background: #f8fafc !important;
      color: #3b82f6 !important;
      border-color: #3b82f6 !important;
    }
    &:focus {
      box-shadow: none !important;
    }
    &:active {
      transform: translateY(1px);
    }
  }
  .fc-button-active {
    background: #eff6ff !important;
    color: #3b82f6 !important;
    border-color: #bfdbfe !important;
  }

  /* 2. 그리드 및 헤더 */
  .fc-theme-standard td,
  .fc-theme-standard th {
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

  /* 3. 이벤트 카드 영역 */
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

  /* 팝업 스타일 */
  .fc-popover {
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
    background: #ffffff !important;
    z-index: 1000 !important;
    overflow: hidden;
    animation: ${popoverFadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .fc-popover-body .fc-daygrid-event {
    margin-bottom: 8px !important;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
`;

const WeekdayText = styled.span<{ $isToday: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.$isToday ? "#3b82f6" : "#94a3b8")};
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
  font-weight: ${(props) => (props.$isToday ? "800" : "600")};

  color: ${(props) => (props.$isToday ? "#ffffff" : "#334155")};
  background-color: ${(props) => (props.$isToday ? "#3b82f6" : "transparent")};
  box-shadow: ${(props) =>
    props.$isToday ? "0 4px 10px rgba(59, 130, 246, 0.4)" : "none"};
`;

// Props
type Props = {
  events: InstructorEventItem[];
  onEventClick?: (event: InstructorEventItem) => void;
};

/**
 * 강사용 대시보드 **월간 캘린더**
 */
export default function InstructorMonthCalendar({
  events,
  onEventClick,
}: Props) {
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
    [events]
  );

  return (
    <WidgetContainer>
      <CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,next today",
          }}
          height="100%"
          events={fcEvents}
          dayHeaderContent={(args) => {
            const date = args.date;
            const dayNumber = date.getDate();
            const weekday = date.toLocaleDateString("ko-KR", {
              weekday: "short",
            });

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
          eventClick={(info) =>
            onEventClick?.(info.event.extendedProps as InstructorEventItem)
          }
          eventContent={(arg) => (
            <InstructorEventCard
              item={arg.event.extendedProps as InstructorEventItem}
            />
          )}
        />
      </CalendarWrapper>
    </WidgetContainer>
  );
}
