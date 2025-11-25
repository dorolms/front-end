// src/app/instructor/all-calendar/page.tsx
"use client";

import { useMemo, useState } from "react";
import { BaseCalendar } from "@/components/calendar/BaseCalendar";
import type { CalendarEvent } from "@/components/calendar/calendarTypes";
import LectureDetailModal from "@/components/lecture/LectureDetailModal";
import {
  AllStatusFilterBar,
  type LectureStatus as AllLectureStatus,
} from "@/components/calendar/AllStatusFilterBar";

// 🔥 통합 목업에서 가져오기
import { MOCK_LECTURES } from "@/mocks/doroMockData";

/** ✅ 전체 강의 캘린더 이벤트 meta */
type AllMeta = {
  lectureId: number;
};

/** ✅ 전체 강의 status → 뱃지 스타일 */
const getAllStatusStyle = (status: AllLectureStatus) => {
  switch (status) {
    case "recruiting":
      return {
        bg: "#ECFEFF",
        text: "#0E7490",
        border: "#A5F3FC",
        label: "모집중",
      };
    case "allocating":
      return {
        bg: "#FFF7ED",
        text: "#B45309",
        border: "#FED7AA",
        label: "배정중",
      };
    case "completed":
      return {
        bg: "#F3F4F6",
        text: "#374151",
        border: "#E5E7EB",
        label: "완료",
      };
    default:
      return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
  }
};

export default function InstructorAllCalendarPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<AllLectureStatus[]>([
    "recruiting",
    "allocating",
    "completed",
  ]);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent<
    AllLectureStatus,
    AllMeta
  > | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  /** ✅ 통합 목업(LECTURE) -> 공용 CalendarEvent로 변환 */
  const convertedEvents: CalendarEvent<AllLectureStatus, AllMeta>[] =
    useMemo(() => {
      return MOCK_LECTURES.map((lec) => {
        const start = new Date(lec.lecture_start_datetime);
        const end = new Date(lec.lecture_end_datetime);

        return {
          id: lec.lecture_id,
          date: lec.lecture_start_datetime.slice(0, 10), // "YYYY-MM-DD"
          timeLabel: `${start.toTimeString().slice(0, 5)} ~ ${end
            .toTimeString()
            .slice(0, 5)}`,
          title: lec.title,
          status: lec.status as AllLectureStatus,
          type: lec.type,
          meta: { lectureId: lec.lecture_id },
        };
      });
    }, []);

  /** ✅ 상태 필터 적용 */
  const filtered = useMemo(
    () => convertedEvents.filter((ev) => selectedStatuses.includes(ev.status)),
    [convertedEvents, selectedStatuses]
  );

  const handlePrevMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  const handleToday = () => setCurrentDate(new Date());

  const handleEventClick = (
    event: CalendarEvent<AllLectureStatus, AllMeta>
  ) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <main>
      {/* ✅ 전체 강의 상태 필터 */}
      <AllStatusFilterBar
        selected={selectedStatuses}
        onChange={setSelectedStatuses}
      />

      {/* ✅ 전체 강의 캘린더 */}
      <BaseCalendar<AllLectureStatus, AllMeta>
        year={year}
        month={month}
        events={filtered}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onEventClick={handleEventClick}
        getStatusStyle={getAllStatusStyle}
      />

      {/* ✅ 상세 모달 */}
      <LectureDetailModal
        open={isModalOpen}
        lecture={selectedEvent}
        context="APPLY_CALENDAR"
        onClose={handleCloseModal}
        onApply={(id) => console.log("신청하기", id)}
        onCancelApply={(id) => console.log("신청 취소", id)}
        onConfirm={(id) => console.log("확정 액션", id)}
      />
    </main>
  );
}
