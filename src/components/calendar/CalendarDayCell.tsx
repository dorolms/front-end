"use client";

import styled from "styled-components";
import { StatusBadge } from "./StatusBadge";
import type { CalendarEvent } from "./calendarTypes";

type StatusStyle = {
  bg: string;
  text: string;
  border?: string;
  label?: string;
};

type Props<S extends string, M = unknown> = {
  date: Date | null;
  events?: CalendarEvent<S, M>[];
  onEventClick?: (event: CalendarEvent<S, M>) => void;

  /** 페이지가 주입하는 “상태 스타일 규칙” */
  getStatusStyle: (status: S) => StatusStyle;
};

const Cell = styled.div`
  min-height: 110px;
  border: 1px solid #e3e5ea;
  padding: 6px 6px 4px;
  background: #fff;
  font-size: 12px;
`;

const DateLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const EventsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 강의 유형별 색상 매핑 (공용)
const TYPE_COLORS: Record<string, string> = {
  general: "#FFE799",
  totoland: "#A5B7FF",
  booth: "#F2C6AE",
  etc: "#BDBDBD",
  competition: "#A6D8FF",
  camp: "#C8E8B8",
};

export function CalendarDayCell<S extends string, M = unknown>({
  date,
  events = [],
  onEventClick,
  getStatusStyle,
}: Props<S, M>) {
  if (!date) return <Cell />;

  return (
    <Cell
      onClick={() => {
        if (events.length > 0) onEventClick?.(events[0]);
      }}
      style={{ cursor: events.length > 0 ? "pointer" : "default" }}
    >
      <DateLabel>{date.getDate()}</DateLabel>

      <EventsWrapper>
        {events.map((ev) => (
          <StatusBadge
            key={ev.id}
            status={ev.status}
            getStatusStyle={getStatusStyle}
            typeColor={TYPE_COLORS[ev.type] ?? "#DDD"}
          >
            {ev.timeLabel}
            <br />
            {ev.title}
          </StatusBadge>
        ))}
      </EventsWrapper>
    </Cell>
  );
}
