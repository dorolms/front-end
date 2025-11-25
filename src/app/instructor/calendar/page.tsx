// src/app/instructor/my-calendar/page.tsx
"use client";

import { useMemo, useState } from "react";
import { BaseCalendar } from "@/components/calendar/BaseCalendar";
import type { CalendarEvent } from "@/components/calendar/calendarTypes";
import LectureDetailModal from "@/components/lecture/LectureDetailModal";
import {
  StatusFilterBar,
  type LectureStatus as MyLectureStatus,
} from "@/components/calendar/StatusFilterBar";

import {
  MOCK_LECTURES,
  MOCK_APPLICATIONS,
  LECTURES_BY_ID,
} from "@/mocks/doroMockData";

// 강사 ID (나)
const CURRENT_USER_ID = 2;

// 나의 캘린더 meta
type MyMeta = {
  lectureId: number;
};

// 나의 상태 → 뱃지 스타일
const getMyStatusStyle = (status: MyLectureStatus) => {
  switch (status) {
    case "CONFIRMED":
      return {
        bg: "#ECFDF3",
        text: "#067647",
        border: "#A9EFC5",
        label: "확정됨",
      };
    case "PENDING":
      return {
        bg: "#FFF7ED",
        text: "#B45309",
        border: "#FED7AA",
        label: "확정대기",
      };
    case "APPLIED":
      return {
        bg: "#EFF6FF",
        text: "#1D4ED8",
        border: "#BFDBFE",
        label: "신청됨",
      };
    default:
      return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
  }
};

export default function InstructorMyCalendarPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<MyLectureStatus[]>([
    "CONFIRMED",
    "PENDING",
    "APPLIED",
  ]);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent<
    MyLectureStatus,
    MyMeta
  > | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  /** 나의 강의 캘린더 데이터 생성 */
  const convertedEvents: CalendarEvent<MyLectureStatus, MyMeta>[] =
    useMemo(() => {
      // 1) 내가 신청한 모든 Application 가져오기
      const myApps = MOCK_APPLICATIONS.filter(
        (a) => a.user_id === CURRENT_USER_ID
      );

      // 2) 캘린더용 데이터로 매핑
      return myApps.map((app) => {
        const lec = LECTURES_BY_ID.get(app.lecture_id)!;

        const start = new Date(lec.lecture_start_datetime);
        const end = new Date(lec.lecture_end_datetime);

        const dateStr = lec.lecture_start_datetime.slice(0, 10);

        //  UI 상태 결정
        let uiStatus: MyLectureStatus;

        if (app.assignment_status === "assigned") uiStatus = "CONFIRMED";
        else if (lec.status === "allocating") uiStatus = "PENDING";
        else uiStatus = "APPLIED";

        return {
          id: lec.lecture_id,
          date: dateStr,
          timeLabel: `${start.toTimeString().slice(0, 5)} ~ ${end
            .toTimeString()
            .slice(0, 5)}`,
          title: lec.title,
          status: uiStatus,
          type: lec.type,
          meta: { lectureId: lec.lecture_id },
        };
      });
    }, []);

  /** 선택된 상태 필터 */
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

  const handleEventClick = (event: CalendarEvent<MyLectureStatus, MyMeta>) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <main>
      {/* 상태 필터 */}
      <StatusFilterBar
        selected={selectedStatuses}
        onChange={setSelectedStatuses}
      />

      {/* 달력 */}
      <BaseCalendar<MyLectureStatus, MyMeta>
        year={year}
        month={month}
        events={filtered}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onEventClick={handleEventClick}
        getStatusStyle={getMyStatusStyle}
      />

      {/* 상세 모달 */}
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
