"use client";

import { useState } from "react";
import { BaseCalendar } from "@/components/calendar/BaseCalendar";
import {
  StatusFilterBar,
  LectureStatus,
} from "@/components/calendar/StatusFilterBar";

import { INSTRUCTOR_MY_CALENDAR_EVENTS } from "@/mocks/instructor/myCalendarMocks";
import type { LectureEvent } from "@/components/calendar/CalendarDayCell";
import LectureDetailModal from "@/components/lecture/LectureDetailModal";

export default function InstructorMyCalendarPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<LectureStatus[]>([
    "CONFIRMED",
    "PENDING",
    "APPLIED",
  ]);

  const [currentDate, setCurrentDate] = useState(() => new Date());

  const [selectedEvent, setSelectedEvent] = useState<LectureEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0~11

  const convertedEvents: LectureEvent[] = INSTRUCTOR_MY_CALENDAR_EVENTS.filter(
    (ev) => ev.myStatus !== null
  ).map((ev) => ({
    id: ev.lectureId,
    date: ev.date,
    timeLabel: `${ev.startTime} ~ ${ev.endTime}`,
    title: ev.title,
    status: ev.myStatus as LectureStatus,
    type: ev.type,
  }));

  // 상태 필터
  const filtered = convertedEvents.filter((ev) =>
    selectedStatuses.includes(ev.status)
  );

  // 이전 달
  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  // 다음 달
  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // 오늘(이번 달)로 이동
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 셀 안의 강의 클릭 시 호출될 핸들러
  const handleEventClick = (event: LectureEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <main>
      <StatusFilterBar
        selected={selectedStatuses}
        onChange={setSelectedStatuses}
      />

      <BaseCalendar
        year={year}
        month={month}
        events={filtered}
        headerTitle={undefined} // 기본 "Month, Year" 사용
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onEventClick={handleEventClick}
      />

      <LectureDetailModal
        open={isModalOpen}
        lecture={selectedEvent}
        context="MY_CALENDAR"
        onClose={handleCloseModal}
        onApply={(id) => console.log("신청하기", id)}
        onCancelApply={(id) => console.log("신청 취소", id)}
        onConfirm={(id) => console.log("확정 액션", id)}
      />
    </main>
  );
}
