// src/app/manager/dashboard/ClientPage.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Wrap, Title, Grid, CalendarBox, CardRow, LeftPanel, RightPanel
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
  const [recruitments, setRecruitments] = useState<RecruitmentItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. 공지사항
      const noticesData = await API.fetchLatestNotices();
      setNotices(noticesData);

      // 2. 캘린더 일정
      const eventsData = await API.fetchMyManagedLectures();
      setEvents(eventsData);

      // 3. 모집 현황
      const recruitData = await API.fetchRecruitmentStatus();
      setRecruitments(recruitData);
    } catch (error) {
      console.error('데이터 로딩 실패', error);
    }
  };

  // [수정] 클릭 시 상세 정보 조회 후 모달 오픈
  const handleEventClick = async (event: ManagerEventItem) => {
    // 1. 즉시 모달 열기
    setSelectedEvent(event);

    // 2. 상세 정보 패칭
    const detail = await API.fetchLectureDetail(event.id);

    // 3. 병합
    if (detail) {
      setSelectedEvent((prev) => {
        if (!prev || prev.id !== event.id) return prev;
        return {
          ...prev,
          ...detail, // schedules, fee, note, target 등 병합
        };
      });
    }
  };

  return (
    <>
    <Title>대시보드</Title>
    <Wrap>


      <Grid>
        {/* 1. 캘린더 */}
        <CalendarBox>
          <ManagerWeeklyCalendar
            events={events}
            onEventClick={handleEventClick}
          />
        </CalendarBox>

        {/* 2. 하단 패널 */}
        <CardRow>
          <LeftPanel>
            <LatestNoticesPanel notices={notices} />
          </LeftPanel>
          <RightPanel>
            <RecruitmentStatusWidget items={recruitments} />
          </RightPanel>
        </CardRow>
      </Grid>

      {/* 3. 상세 모달 (새로운 디자인 적용됨) */}
      {selectedEvent && (
        <ManagerEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
    </>
  );
}