"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import { CalendarDayCell } from "./CalendarDayCell";
import type { CalendarEvent } from "./calendarTypes";

type StatusStyle = {
  bg: string;
  text: string;
  border?: string;
  label?: string;
};

type Props<S extends string, M = unknown> = {
  year: number;
  month: number; // 0~11
  events: CalendarEvent<S, M>[];

  headerTitle?: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onToday?: () => void;

  onEventClick?: (event: CalendarEvent<S, M>) => void;
  getStatusStyle: (status: S) => StatusStyle;
};

const Wrapper = styled.section`
  width: 100%;
  padding: 12px 16px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

const HeaderBtns = styled.div`
  display: flex;
  gap: 6px;
`;

const Btn = styled.button`
  padding: 6px 10px;
  border: 1px solid #e3e5ea;
  border-radius: 8px;
  background: #fff;
  font-size: 12px;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
`;

const WeekLabel = styled.div`
  padding: 8px 6px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e3e5ea;
`;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function BaseCalendar<S extends string, M = unknown>({
  year,
  month,
  events,
  headerTitle,
  onPrevMonth,
  onNextMonth,
  onToday,
  onEventClick,
  getStatusStyle,
}: Props<S, M>) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells = useMemo(() => {
    const result: (Date | null)[] = [];

    // 앞쪽 빈칸
    for (let i = 0; i < startWeekday; i++) result.push(null);

    // 날짜 채우기
    for (let d = 1; d <= totalDays; d++) {
      result.push(new Date(year, month, d));
    }

    // 뒤쪽 빈칸 (6줄 고정 아니어도 되면 제거 가능)
    while (result.length % 7 !== 0) result.push(null);

    return result;
  }, [year, month, startWeekday, totalDays]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent<S, M>[]>();
    for (const ev of events) {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date)!.push(ev);
    }
    return map;
  }, [events]);

  const title = headerTitle ?? `${year}년 ${month + 1}월`;

  return (
    <Wrapper>
      <Header>
        <Title>{title}</Title>
        <HeaderBtns>
          {onPrevMonth && <Btn onClick={onPrevMonth}>이전</Btn>}
          {onToday && <Btn onClick={onToday}>오늘</Btn>}
          {onNextMonth && <Btn onClick={onNextMonth}>다음</Btn>}
        </HeaderBtns>
      </Header>

      <Grid>
        {WEEKDAYS.map((w) => (
          <WeekLabel key={w}>{w}</WeekLabel>
        ))}

        {cells.map((dateObj, idx) => {
          const key = dateObj
            ? dateObj.toISOString().slice(0, 10)
            : `empty-${idx}`;

          const dateStr = dateObj ? dateObj.toISOString().slice(0, 10) : null;

          const dayEvents = dateStr ? eventsByDate.get(dateStr) ?? [] : [];

          return (
            <CalendarDayCell<S, M>
              key={key}
              date={dateObj}
              events={dayEvents}
              onEventClick={onEventClick}
              getStatusStyle={getStatusStyle}
            />
          );
        })}
      </Grid>
    </Wrapper>
  );
}
