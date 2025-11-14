// src/components/calendar/CalendarDayCell.tsx
"use client";

import styled from "styled-components";
import { StatusBadge, LectureStatus } from "./StatusBadge";

export interface LectureEvent {
  id: number | string;
  date: string;
  timeLabel: string;
  title: string;
  status: LectureStatus;
  type: string;
}

type Props = {
  date: Date | null;
  events?: LectureEvent[];
  onEventClick?: (event: LectureEvent) => void;
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

// 강의 유형별 색상 매핑
const TYPE_COLORS: Record<string, string> = {
  general: "#FFE799",
  totoland: "#A5B7FF",
  booth: "#F2C6AE",
  etc: "#BDBDBD",
  competition: "#A6D8FF",
  camp: "#C8E8B8",
};

export function CalendarDayCell({ date, events = [], onEventClick }: Props) {
  if (!date) return <Cell />;

  return (
    <Cell
      onClick={() => {
        if (events.length > 0) {
          onEventClick?.(events[0]);
        }
      }}
      style={{ cursor: events.length > 0 ? "pointer" : "default" }}
    >
      <DateLabel>{date.getDate()}</DateLabel>

      <EventsWrapper>
        {events.map((ev) => (
          <StatusBadge
            key={ev.id}
            status={ev.status}
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
