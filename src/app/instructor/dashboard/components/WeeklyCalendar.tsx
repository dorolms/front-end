'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


import type { EventItem, Category } from '../types';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .fc {
    height: 100%;
    font-family: inherit;
  }

  .fc-header-toolbar {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .fc-button-primary {
    background: #e3e5eb;
    border: none;
    color: #111;
    text-transform: lowercase;
    font-weight: 500;
    border-radius: 4px;
    padding: 4px 12px;
    box-shadow: none;
  }
  .fc-button-primary:hover {
    background: #d5d7de;
  }

  .fc-prev-button,
  .fc-next-button {
    border-radius: 4px;
    padding: 4px 8px;
    margin-right: 4px;
  }

  .fc-today-button {
    text-transform: none;
  }

  .fc-col-header-cell {
    border: none;
    border-bottom: 1px solid #e5e5e5;
    padding: 6px 0;
  }
  .fc-col-header-cell-cushion {
    font-size: 0.85rem;
    font-weight: 600;
    color: #111;
  }

  .fc-daygrid-body,
  .fc-daygrid-body table {
    border: none;
  }

  .fc-daygrid-day {
    border: none;
    border-right: 1px solid #f1f1f1;
  }
  .fc-daygrid-day:last-child {
    border-right: none;
  }

  .fc-daygrid-day-top {
    justify-content: center;
    padding-top: 2px;
  }
  .fc-daygrid-day-number {
    font-size: 0.8rem;
    color: #444;
  }

  .fc-scrollgrid {
    border: none;
  }

  .fc-day-today {
    background: #fff9e6;
  }

  .fc-daygrid-event {
    border: none;
    background: transparent;
    padding: 0;
    margin: 2px 0;
  }

  /* === 이벤트 pill === */
  .event-pill {
    position: relative;
    display: block;
    width: 100%;              /* 셀 폭에 딱 맞춤 */
    box-sizing: border-box;   /* border까지 포함해서 100% */
    background: #f4efff;
    border: 2px solid #7f6bff;
    border-radius: 4px;
    padding: 4px 8px 4px 10px;
    font-size: 0.78rem;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .event-pill-main {
    position: relative;
    z-index: 1;
  }

  .event-pill-title,
  .event-pill-sub {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .event-pill-title {
    font-weight: 600;
    color: #111;
    margin-bottom: 2px;
  }

  .event-pill-sub {
    color: #111;
  }

  .event-cat-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  /* === hover 시 뜨는 긴 툴팁 === */
  .event-tooltip {
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 4px;
    padding: 6px 8px;
    background: #111827;
    color: #f9fafb;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: pre-line;
    max-width: 260px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    z-index: 10;
    display: none;
  }

  .event-pill:hover .event-tooltip {
    display: block;
  }
`;

const CATEGORY_COLORS: Record<Category, string> = {
  GENERAL: '#FFE286',
  COMPETITION: '#83CBEB',
  BOOTH: '#F6C6AC',
  CAMP: '#B4E5A2',
  DOROLAND: '#8EACF6',
  ETC: '#BFBFBF',
};

type Props = {
  events: EventItem[];
  onEventClick?: (event: EventItem) => void;
};

export default function WeeklyCalendar({ events, onEventClick }: Props) {
  const fcEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: true,
        extendedProps: e,
      })),
    [events]
  );

  const initialDate = events[0]?.start ?? undefined;

  return (
    <Wrap>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        initialDate={initialDate}
        locale="ko"
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'prev,next today',
        }}
        height="100%"
        events={fcEvents}
        dayMaxEventRows={3}
        eventClick={(info) => {
          const item = info.event.extendedProps as EventItem;
          onEventClick?.(item);
        }}
        eventContent={(arg) => {
          const item = arg.event.extendedProps as EventItem;
          const color = CATEGORY_COLORS[item.category] || '#BFBFBF';

          const start = new Date(item.start);
          const pad = (n: number) => n.toString().padStart(2, '0');
          const timeText = `${start.getHours() >= 12 ? '오후' : '오전'} ${
            start.getHours() > 12 ? start.getHours() - 12 : start.getHours()
          }시${pad(start.getMinutes()) === '00' ? '' : ' ' + pad(start.getMinutes())}`;

          const fullText =
            `${timeText} ${item.title}` +
            (item.location ? `\n- ${item.location}` : '');

          return (
            <div className="event-pill">
              <div className="event-cat-bar" style={{ background: color }} />
              <div className="event-pill-main">
                <div className="event-pill-title">
                  {timeText} {item.title}
                </div>
                {item.location && (
                  <div className="event-pill-sub">- {item.location}</div>
                )}
              </div>
              <div className="event-tooltip">{fullText}</div>
            </div>
          );
        }}
      />
    </Wrap>
  );
}
