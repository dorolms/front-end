import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Lecture, Schedule, CalendarEvent } from '../../types';
import InstructorStatusFilterBar from './InstructorStatusFilterBar';
import InstructorMonthlyCalendar from './InstructorMonthlyCalendar';
import InstructorEventDetailModal from './InstructorEventDetailModal';

interface LectureCalendarViewProps {
  lectures: Lecture[];
}

const LectureCalendarView: React.FC<LectureCalendarViewProps> = ({ lectures }) => {
  const [showRecruiting, setShowRecruiting] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필터링된 강의를 CalendarEvent 형식으로 변환
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];

    lectures.forEach(lecture => {
      const isRecruiting = lecture.status === 'RECRUITING';
      
      // 필터 조건에 맞는지 확인
      if (
        (isRecruiting && !showRecruiting) ||
        (!isRecruiting && !showCompleted)
      ) {
        return;
      }

      // 각 스케줄을 이벤트로 변환
      lecture.schedules.forEach(schedule => {
        events.push({
          id: `${lecture.id}-${schedule.id}`,
          title: lecture.title,
          start: `${schedule.date}T${schedule.start_time}`,
          extendedProps: {
            lecture,
            schedule
          }
        });
      });
    });

    return events;
  }, [lectures, showRecruiting, showCompleted]);

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
        showRecruiting={showRecruiting}
        showCompleted={showCompleted}
        onToggleRecruiting={() => setShowRecruiting(!showRecruiting)}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
      />

      <InstructorMonthlyCalendar
        events={calendarEvents}
        onEventClick={handleEventClick}
      />

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