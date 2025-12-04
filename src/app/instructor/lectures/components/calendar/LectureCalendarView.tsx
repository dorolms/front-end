// LectureCalendarView.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Lecture, Schedule, CalendarEvent } from '../../types';
import InstructorStatusFilterBar, { InstructorFilter } from './InstructorStatusFilterBar';
import InstructorMonthlyCalendar from './InstructorMonthlyCalendar';
import InstructorEventDetailModal from '../InstructorEventDetailModal';

interface LectureCalendarViewProps {
  lectures: Lecture[];
}

const LectureCalendarView: React.FC<LectureCalendarViewProps> = ({ lectures }) => {
  const [filter, setFilter] = useState<InstructorFilter>('ALL');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필터링된 강의를 CalendarEvent 형식으로 변환
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];

    lectures.forEach((lecture) => {
      const status = lecture.status; // 'RECRUITING', 'COMPLETED' 등

      // 🔎 필터 적용
      if (filter === 'RECRUITING' && status !== 'RECRUITING') {
        return;
      }
      // "모집 완료"는 일단 "RECRUITING이 아닌 강의"로 간주
      if (filter === 'COMPLETED' && status === 'RECRUITING') {
        return;
      }

      lecture.schedules.forEach((schedule) => {
        events.push({
          id: `${lecture.id}-${schedule.id}`,
          title: lecture.title,
          start: `${schedule.date}T${schedule.start_time}`,
          extendedProps: {
            lecture,
            schedule,
          },
        });
      });
    });

    return events;
  }, [lectures, filter]);

  const handleEventClick = (lecture: Lecture, schedule: Schedule) => {
    setSelectedLecture(lecture);
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
    setSelectedSchedule(null);
  };

  return (
    <Container>
      <InstructorStatusFilterBar
        activeFilter={filter}
        onChangeFilter={setFilter}
      />

      <InstructorMonthlyCalendar events={calendarEvents} onEventClick={handleEventClick} />

      <InstructorEventDetailModal
        lecture={selectedLecture}
        schedule={selectedSchedule}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

export default LectureCalendarView;
