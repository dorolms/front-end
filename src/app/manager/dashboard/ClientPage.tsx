// src/app/manager/dashboard/ClientPage.tsx
'use client';

import { useState } from 'react';
import {
  Wrap, BreadCrumb, Title, Grid, CalendarBox, CardRow, LeftPanel, RightPanel
} from './styles';

import ManagerWeeklyCalendar from './components/ManagerWeeklyCalendar';
import RecruitmentStatusWidget from './components/RecruitmentStatusWidget';
import LatestNoticesPanel from './components/LatestNoticesPanel';
import ManagerEventDetailModal from './components/ManagerEventDetailModal'; // 새로 만든 모달 임포트

import { mockManagerEvents, mockRecruitments } from './data/managerMock';
import { latestNotices } from './data/latestNotices';
import type { ManagerEventItem } from './types';

export default function ManagerClientPage() {
  // 선택된 이벤트 상태 관리
  const [selectedEvent, setSelectedEvent] = useState<ManagerEventItem | null>(null);

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 대시보드</BreadCrumb>
      <Title>대시보드</Title>

      <Grid>
        {/* 1. 캘린더 */}
        <CalendarBox>
          <ManagerWeeklyCalendar
            events={mockManagerEvents}
            onEventClick={(event) => setSelectedEvent(event)} // 클릭 시 상태 업데이트
          />
        </CalendarBox>

        {/* 2. 하단 패널 */}
        <CardRow>
          <LeftPanel>
            <LatestNoticesPanel notices={latestNotices} />
          </LeftPanel>
          <RightPanel>
            <RecruitmentStatusWidget items={mockRecruitments} />
          </RightPanel>
        </CardRow>
      </Grid>

      {/* 3. 모달 (selectedEvent가 있을 때만 렌더링) */}
      {selectedEvent && (
        <ManagerEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}