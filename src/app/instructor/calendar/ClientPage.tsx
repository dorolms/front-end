'use client';

import { useState, useEffect } from 'react';
import {
  Wrap,
  BreadCrumb,
  Title,
  Grid,
  CalendarBox,
  CardRow,
  LeftPanel,
  RightPanel,
} from './styles';

import InstructorWeeklyCalendar from './components/InstructorMonthlyCalendar';
import InstructorEventDetailModal from './components/InstructorEventDetailModal';

import * as API from './api';
import type { InstructorEventItem } from './types';
import type { Notice } from '../../instructor/notices/types';

export default function InstructorClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<InstructorEventItem | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<InstructorEventItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const noticesData = await API.fetchLatestNotices();
      setNotices(noticesData);

      const eventsData = await API.fetchMyLectures();
      setEvents(eventsData);
    } catch (error) {
      console.error('데이터 로딩 실패', error);
    }
  };

  const handleEventClick = async (event: InstructorEventItem) => {
    const detail = await API.fetchLectureDetail(event.id);
    if (detail) {
      setSelectedEvent({
        ...event,
        content: detail.content || event.content,
        location: detail.location || event.location,
        instructors: detail.instructors || event.instructors,
      });
    } else {
      setSelectedEvent(event);
    }
  };

  return (
    <Wrap>
        <CalendarBox>
          <InstructorWeeklyCalendar
            events={events}
            onEventClick={handleEventClick}
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