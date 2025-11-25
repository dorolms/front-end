"use client";

import { useMemo, useState } from "react";

import InstructorMonthlyCalendar from "./InstructorMonthlyCalendar";
import InstructorEventDetailModal from "./InstructorEventDetailModal";
import StatusFilterBar from "./InstructorStatusFilterBar";

import { CalendarBox } from "../../styles"; // ../.. = components → lectures
import { mockInstructorEvents } from "../../../dashboard/data/instructorMock";
import type { InstructorEventItem } from "../../types";
import type { EventStatus } from "../../types";

export default function LectureCalendarView() {
  const [selectedEvent, setSelectedEvent] =
    useState<InstructorEventItem | null>(null);

  // 강사 기준 상태 필터
  const [selectedStatus, setSelectedStatus] = useState<EventStatus[]>([
    "APPLIED",
    "PENDING",
    "CONFIRMED",
  ]);

  const filteredEvents = useMemo(() => {
    if (selectedStatus.length === 0) return mockInstructorEvents;

    return mockInstructorEvents.filter((e) =>
      selectedStatus.includes(e.instructorStatus as EventStatus)
    );
  }, [selectedStatus]);

  return (
    <>
      <StatusFilterBar value={selectedStatus} onChange={setSelectedStatus} />

      <CalendarBox>
        <InstructorMonthlyCalendar
          events={filteredEvents}
          onEventClick={(event) => setSelectedEvent(event)}
        />
      </CalendarBox>

      {selectedEvent && (
        <InstructorEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
