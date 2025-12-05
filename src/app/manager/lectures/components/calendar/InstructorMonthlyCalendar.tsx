import React, { useRef } from "react";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEvent, Lecture, Schedule } from "../../types";
import InstructorEventCard from "./InstructorEventCard";

interface InstructorMonthlyCalendarProps {
  events: CalendarEvent[];
  onEventClick: (lecture: Lecture, schedule: Schedule) => void;
}

const InstructorMonthlyCalendar: React.FC<InstructorMonthlyCalendarProps> = ({
  events,
  onEventClick,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <TodayButton onClick={handleTodayClick}>Today</TodayButton>
      </CalendarHeader>

      <StyledCalendarWrapper>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height="auto"
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          events={events}
          fixedWeekCount={false}
          eventContent={(eventInfo) => {
            const { lecture, schedule } = eventInfo.event.extendedProps;
            return (
              <InstructorEventCard
                lecture={lecture}
                schedule={schedule}
                onClick={() => onEventClick(lecture, schedule)}
              />
            );
          }}
          dayMaxEvents={3}
          moreLinkText={(num) => `+${num}개 더보기`}
        />
      </StyledCalendarWrapper>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const TodayButton = styled.button`
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledCalendarWrapper = styled.div`
  .fc {
    font-family: inherit;
  }

  .fc-header-toolbar {
    margin-bottom: 24px !important;
  }

  .fc-toolbar-title {
    font-size: 24px !important;
    font-weight: 700 !important;
    color: #111827;
  }

  .fc-button {
    background-color: white !important;
    border: 1px solid #e5e7eb !important;
    color: #374151 !important;
    padding: 8px 12px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    transition: all 0.2s !important;

    &:hover {
      background-color: #f3f4f6 !important;
      border-color: #d1d5db !important;
    }

    &:focus {
      box-shadow: none !important;
    }
  }

  .fc-button-active {
    background-color: #3b82f6 !important;
    color: white !important;
    border-color: #3b82f6 !important;
  }

  .fc-col-header-cell {
    padding: 12px 0;
    background-color: #f9fafb;
    border-color: #e5e7eb !important;
  }

  .fc-col-header-cell-cushion {
    font-weight: 600;
    color: #374151;
    text-decoration: none;
  }

  .fc-daygrid-day {
    border-color: #e5e7eb !important;
  }

  .fc-daygrid-day-number {
    padding: 8px;
    font-weight: 600;
    color: #374151;
    text-decoration: none;
  }

  .fc-day-today {
    background-color: #fef3c7 !important;
  }

  .fc-daygrid-day-frame {
    min-height: 100px;
  }

  .fc-daygrid-day-events {
    margin-top: 4px;
  }

  .fc-event {
    border: none !important;
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .fc-more-link {
    font-size: 11px;
    color: #3b82f6;
    font-weight: 600;
    margin: 2px 4px;
  }
`;

export default InstructorMonthlyCalendar;
