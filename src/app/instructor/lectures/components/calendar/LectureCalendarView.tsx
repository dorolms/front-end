// LectureCalendarView.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { LectureDetail, Schedule} from '../../types'; 
import InstructorStatusFilterBar, { InstructorFilter } from './InstructorStatusFilterBar';
import InstructorMonthlyCalendar from './InstructorMonthlyCalendar';
import InstructorEventDetailModal from '../InstructorEventDetailModal';

// CalendarEvent 타입 정의
type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  extendedProps: {
    lecture: LectureDetail;
    schedule: Schedule;
  };
};

interface LectureCalendarViewProps {
  lectures: LectureDetail[];
}

const LectureCalendarView: React.FC<LectureCalendarViewProps> = ({ lectures }) => {
  const [filter, setFilter] = useState<InstructorFilter>('ALL');
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필터링된 강의를 CalendarEvent 형식으로 변환
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];

    lectures.forEach((lecture) => {
      const status = lecture.status;

      // 필터 적용
      if (filter === 'RECRUITING' && status !== 'RECRUITING') {
        return;
      }
      
      if (filter === 'COMPLETED' && status === 'RECRUITING') {
        return;
      }

      lecture.schedules.forEach((schedule) => {
        events.push({
          id: `${lecture.id}-${schedule.id}`,
          title: lecture.title,
          start: `${schedule.date}T${schedule.start_time}`, // ✅ date → lecture_date
          extendedProps: {
            lecture, 
            schedule,
          },
        });
      });
    });

    return events;
  }, [lectures, filter]);

  // 캘린더 이벤트 클릭 핸들러
  const handleEventClick = (lecture: LectureDetail, schedule: Schedule) => {
    setSelectedLectureId(lecture.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLectureId(null);
  };

  return (
    <Container>
      <InstructorStatusFilterBar
        activeFilter={filter}
        onChangeFilter={setFilter}
      />
      
      <InstructorMonthlyCalendar
        events={calendarEvents}
        onEventClick={handleEventClick}
      />

      <InstructorEventDetailModal
        lectureId={selectedLectureId}
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