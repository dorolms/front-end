// src/app/instructor/dashboard/ClientPage.tsx
'use client';

import { useState } from 'react';
import { mockEvents } from './data/mock';
import { latestNotices } from './data/latestNotices';
import { useDashboard } from './hooks/useDashboard';
import {
  Wrap,
  BreadCrumb,
  Title,
  Grid,
  CalendarBox,
  CardRow,
  CardBox,
  LatestNoticeBox,
} from './styles';
import WeeklyCalendar from './components/WeeklyCalendar';
import NextLectureCard from './components/NextLectureCard';
import EventDetailModal from './components/EventDetailModal';
import LatestNoticesPanel from './components/LatestNoticesPanel';
import type { EventItem } from './types';

export default function ClientPage() {
  const { confirmed, nextConfirmed } = useDashboard(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 대시보드</BreadCrumb>
      <Title>대시보드</Title>

      <Grid>
        {/* 1줄: 캘린더 */}
        <CalendarBox>
          <WeeklyCalendar
            events={confirmed}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        </CalendarBox>

        {/* 2줄: 왼쪽 최신 공지 / 오른쪽 다음 강의 */}
        <CardRow>
          <LatestNoticeBox>
            <LatestNoticesPanel notices={latestNotices} />
          </LatestNoticeBox>

          <CardBox>
            <NextLectureCard event={nextConfirmed} />
          </CardBox>
        </CardRow>
      </Grid>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}
