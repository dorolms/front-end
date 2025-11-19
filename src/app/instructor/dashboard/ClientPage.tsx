// src/app/instructor/dashboard/ClientPage.tsx
'use client';

import { useState } from 'react';
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

import { mockInstructorEvents } from './data/instructorMock';
import { latestNotices } from '../../instructor/dashboard/data/latestNotices'; // 공지 mock 재사용 (경로 프로젝트에 맞게 조정)
import type { InstructorEventItem } from './types';

export default function InstructorClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<InstructorEventItem | null>(null);

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 대시보드</BreadCrumb>
      <Title>대시보드</Title>

      <Grid>
        {/* 1. 주간 캘린더 */}
        <CalendarBox>
          <InstructorWeeklyCalendar
            events={mockInstructorEvents}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        </CalendarBox>

        {/* 2. 하단 패널 */}
        <CardRow>
          <LeftPanel>
            <LatestNoticesPanel notices={latestNotices} />
          </LeftPanel>
          <RightPanel>
            <NextLectureWidget events={mockInstructorEvents} />
          </RightPanel>
        </CardRow>
      </Grid>

      {/* 3. 이벤트 상세 모달 */}
      {selectedEvent && (
        <InstructorEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}
