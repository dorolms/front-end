'use client';

import { useState, useEffect } from 'react';
import {
  Wrap, BreadCrumb, Title, Grid, CalendarBox, CardRow, LeftPanel, RightPanel
} from './styles';

import ManagerWeeklyCalendar from './components/ManagerWeeklyCalendar';
import RecruitmentStatusWidget from './components/RecruitmentStatusWidget';
import LatestNoticesPanel from './components/LatestNoticesPanel';
import ManagerEventDetailModal from './components/ManagerEventDetailModal';

import * as API from './api';
import type { ManagerEventItem, RecruitmentItem } from './types';
import type { Notice } from '../../manager/notices/types';

export default function ManagerClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<ManagerEventItem | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<ManagerEventItem[]>([]);

  // [추가] 모집 현황 상태
  const [recruitments, setRecruitments] = useState<RecruitmentItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. 공지사항 로딩
      const noticesData = await API.fetchLatestNotices();
      setNotices(noticesData);

      // 2. 캘린더 일정 로딩 (API에서 status='CONFIRMED'로 변환해줌)
      const eventsData = await API.fetchMyManagedLectures();
      setEvents(eventsData);

      // 3. 모집 현황 로딩 (로직 적용됨)
      const recruitData = await API.fetchRecruitmentStatus();
      setRecruitments(recruitData);

    } catch (error) {
      console.error('데이터 로딩 실패', error);
    }
  };

  return (
    <Wrap>
      <Title>대시보드</Title>

      <Grid>
        {/* 1. 캘린더 */}
        <CalendarBox>
          <ManagerWeeklyCalendar
            events={events}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        </CalendarBox>

        {/* 2. 하단 패널 */}
        <CardRow>
          <LeftPanel>
            <LatestNoticesPanel notices={notices} />
          </LeftPanel>
          <RightPanel>
            {/* API에서 받아온 실제 데이터 전달 */}
            <RecruitmentStatusWidget items={recruitments} />
          </RightPanel>
        </CardRow>
      </Grid>

      {/* 3. 상세 모달 */}
      {selectedEvent && (
        <ManagerEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}