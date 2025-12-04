'use client';

import { useState, useEffect } from 'react';
import {
  Wrap,
  CalendarBox,
} from './styles';

import InstructorMonthlyCalendar from './components/InstructorMonthlyCalendar';
import InstructorEventDetailModal from './components/InstructorEventDetailModal';

import * as API from './api';
import type { InstructorEventItem } from './types';

export default function InstructorClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<InstructorEventItem | null>(null);
  const [events, setEvents] = useState<InstructorEventItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const eventsData = await API.fetchMyLectures();
        setEvents(eventsData);
      } catch (error) {
        console.error('데이터 로딩 실패', error);
      }
    };

    load();
  }, []);

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
        <InstructorMonthlyCalendar
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
