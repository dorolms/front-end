'use client';

import { useState } from 'react';
import { mockEvents } from './data/mock';
import { useDashboard } from './hooks/useDashboard';
import {
  Wrap,
  BreadCrumb,
  Title,
  Grid,
  CalendarBox,
  CardBox,
  CardRow,          // ⬅ 추가
} from './styles';
import WeeklyCalendar from './components/WeeklyCalendar';
import NextLectureCard from './components/NextLectureCard';
import EventDetailModal from './components/EventDetailModal';
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
            onEventClick={(e) => setSelectedEvent(e)}
          />
        </CalendarBox>

        {/* 2줄: 오른쪽 정렬된 '다음 강의' 카드 */}
        <CardRow>
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
