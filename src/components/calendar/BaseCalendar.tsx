// src/components/calendar/BaseCalendar.tsx
"use client";

import styled from "styled-components";
import { CalendarDayCell, LectureEvent } from "./CalendarDayCell";

type Props = {
  year: number;
  month: number; // 0~11
  events: LectureEvent[];
  headerTitle?: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onEventClick?: (event: LectureEvent) => void;
};

const Shell = styled.div`
  border-radius: 12px;
  background: #ffffff;
  padding: 16px 20px 20px;
  box-shadow: 0 0 0 1px #e5e7ec;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled.button`
  min-width: 32px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e3e5ea;
  background: #f7f8fb;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #eef0f6;
  }
`;

const TodayButton = styled(NavButton)`
  padding: 0 12px;
  min-width: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Weekday = styled.div`
  padding: 8px 6px;
  font-size: 12px;
  font-weight: 600;
  border-bottom: 1px solid #e3e5ea;
  color: #7b7f8c;
`;

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function BaseCalendar({
  year,
  month,
  events,
  headerTitle,
  onPrevMonth,
  onNextMonth,
  onToday,
  onEventClick,
}: Props) {
  const first = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  const firstDay = first.getDay(); // 일요일 기준
  const startIndex = (firstDay + 6) % 7;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startIndex; i++) cells.push(null);
  for (let d = 1; d <= lastDate; d++) cells.push(new Date(year, month, d));

  const keyOf = (d: Date) => d.toISOString().slice(0, 10);

  const grouped: Record<string, LectureEvent[]> = {};
  events.forEach((ev) => {
    if (!grouped[ev.date]) grouped[ev.date] = [];
    grouped[ev.date].push(ev);
  });

  const displayTitle =
    headerTitle ??
    `${first.toLocaleString("en-US", { month: "long" })}, ${year}`;

  return (
    <Shell>
      <Header>
        <Title>{displayTitle}</Title>
        <Controls>
          <NavButton onClick={onPrevMonth}>{"<"}</NavButton>
          <NavButton onClick={onNextMonth}>{">"}</NavButton>
          <TodayButton onClick={onToday}>Today</TodayButton>
        </Controls>
      </Header>

      <Grid>
        {WEEKDAYS.map((w) => (
          <Weekday key={w}>{w}</Weekday>
        ))}

        {cells.map((date, idx) => (
          <CalendarDayCell
            key={idx}
            date={date}
            events={date ? grouped[keyOf(date)] ?? [] : []}
            onEventClick={onEventClick}
          />
        ))}
      </Grid>
    </Shell>
  );
}
