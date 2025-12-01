// src/app/instructor/calendar/ClientPage.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import InstructorStatusFilterBar from "./components/InstructorStatusFilterBar";
import InstructorMonthlyCalendar from "./components/InstructorMonthlyCalendar";
import InstructorEventDetailModal from "./components/InstructorEventDetailModal";
import type {
  Lecture,
  Schedule,
  CalendarEvent,
  MyCalendarFilter,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ClientPage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 나의 강의 캘린더 필터 (전체 / ASSIGNED / PENDING)
  const [currentFilter, setCurrentFilter] = useState<MyCalendarFilter>("all");

  // 🧷 모달용 선택 상태
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📡 /api/lectures/calender/?mode=my 호출
  useEffect(() => {
    const fetchMyCalendar = async () => {
      if (!API_BASE_URL) {
        setError("API 서버 주소(.env)가 설정되어 있지 않습니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/lectures/lectures/?mode=my`,
          {
            credentials: "include", // 세션/쿠키 쓰는 경우 대비
          }
        );

        if (!res.ok) {
          throw new Error("나의 강의 캘린더를 불러오는데 실패했습니다.");
        }

        const data: Lecture[] = await res.json();
        setLectures(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCalendar();
  }, []);

  // 🎛 필터 적용 (all / ASSIGNED / PENDING)
  const filteredLectures = useMemo(() => {
    if (currentFilter === "all") return lectures;
    return lectures.filter(
      (lecture) => lecture.my_application_status === currentFilter
    );
  }, [lectures, currentFilter]);

  // 📅 FullCalendar용 이벤트로 변환
  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      filteredLectures.flatMap((lecture) =>
        lecture.schedules.map((schedule) => ({
          id: String(schedule.id), // CalendarEvent.id 는 string 타입
          title: lecture.title,
          start: `${schedule.date}T${schedule.start_time}`,
          extendedProps: {
            lecture,
            schedule,
          },
        }))
      ),
    [filteredLectures]
  );

  // 📌 이벤트 클릭 시 모달 열기
  const handleEventClick = (lecture: Lecture, schedule: Schedule) => {
    setSelectedLecture(lecture);
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <PageContainer>
        <StatusText>나의 강의 캘린더를 불러오는 중입니다... ⏳</StatusText>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <StatusText>⚠️ {error}</StatusText>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* 상단 필터 바 */}
      <InstructorStatusFilterBar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />

      {/* 월간 캘린더 */}
      <InstructorMonthlyCalendar
        events={calendarEvents}
        onEventClick={handleEventClick}
      />

      {/* 강의 상세 모달 */}
      <InstructorEventDetailModal
        lecture={selectedLecture}
        schedule={selectedSchedule}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  padding: 24px 0;
`;

const StatusText = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

export default ClientPage;
