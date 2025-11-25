// src/app/instructor/calendar/ClientPage.tsx
"use client";

import { useState, useMemo } from "react";
import { Wrap, BreadCrumb, Title, CalendarBox } from "./styles";

import InstructorMonthlyCalendar from "./components/InstructorMonthlyCalendar";
import InstructorEventDetailModal from "./components/InstructorEventDetailModal";
import StatusFilterBar from "./components/InstructorStatusFilterBar";

import { mockInstructorEvents } from "../dashboard/data/instructorMock";
import type { InstructorEventItem } from "../dashboard/types";
import type { EventStatus } from "./types";

export default function ClientPage() {
  const [selectedEvent, setSelectedEvent] =
    useState<InstructorEventItem | null>(null);

  // 🔹 강사 입장에서의 상태 필터 (신청됨/확정대기/확정됨)
  const [selectedStatus, setSelectedStatus] = useState<EventStatus[]>([
    "APPLIED",
    "PENDING",
    "CONFIRMED",
  ]);

  // 🔹 instructorStatus 기준으로 필터링
  const filteredEvents = useMemo(() => {
    if (selectedStatus.length === 0) return mockInstructorEvents;

    return mockInstructorEvents.filter((e) =>
      selectedStatus.includes(e.instructorStatus as EventStatus)
    );
  }, [selectedStatus]);

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 강의 캘린더</BreadCrumb>
      <Title>강의 캘린더</Title>

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
    </Wrap>
  );
}
