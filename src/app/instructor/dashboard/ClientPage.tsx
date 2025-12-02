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

import InstructorWeeklyCalendar from './components/InstructorWeeklyCalendar';
import LatestNoticesPanel from './components/LatestNoticesPanel';
import NextLectureWidget from './components/NextScheduleWidget';
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
      <BreadCrumb>홈 &gt; 대시보드</BreadCrumb>
      <Title>대시보드</Title>

      <Grid>
        <CalendarBox>
          <InstructorWeeklyCalendar
            events={events}
            onEventClick={handleEventClick}
          />
        </CalendarBox>

        <CardRow>
          <LeftPanel>
            <LatestNoticesPanel notices={notices} />
          </LeftPanel>
          <RightPanel>
            <NextLectureWidget events={events} />
          </RightPanel>
        </CardRow>
      </Grid>

      {selectedEvent && (
        <InstructorEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}