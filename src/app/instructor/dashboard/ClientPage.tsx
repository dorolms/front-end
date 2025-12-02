// src/app/instructor/dashboard/ClientPage.tsx
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

import type { InstructorEventItem } from './types';

type ApiScheduleItem = {
  id: number;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  lecture_id: number;
  lecture_title: string;
  lecture_location: string;
  lecture_status: string;
  lecture_type?: string;
  confirmed_instructors: string[];
};

type NextLectureApiResponse = {
  date: string;
  start_time: string;
  end_time: string;
  title: string;
  content: string;
  location: string;
  manager_name: string;
  manager_phone: string;
};

// Announcement 리스트 (구체 타입은 LatestNoticesPanel에 맞게 알아서 쓰게 두고 any[]로 유지)
type NoticeItem = any;

export default function InstructorClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<InstructorEventItem | null>(null);

  // 캘린더용 전체 일정
  const [events, setEvents] = useState<InstructorEventItem[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // NextLectureWidget용 “다음 강의” (한 개일 가능성이 높으니 배열 1개짜리로 유지)
  const [nextEvents, setNextEvents] = useState<InstructorEventItem[]>([]);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [nextError, setNextError] = useState<string | null>(null);

  // 공지(Announcement)
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isNoticesLoading, setIsNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

  // ---------- 1) 강사 전체 일정 조회 (/lectures/schedules/?mode=my) ----------
  useEffect(() => {
    const fetchEvents = async () => {
      setIsEventsLoading(true);
      setEventsError(null);

      try {
        if (typeof window === 'undefined') return;
        const token = window.localStorage.getItem('accessToken');
        if (!token) {
          setEventsError('로그인 토큰이 없습니다.');
          return;
        }

        const res = await fetch(
          `${baseUrl}/lectures/schedules/?mode=my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error('강의 일정을 불러오지 못했습니다.');
        }

        const data: ApiScheduleItem[] = await res.json();

        const mapped: InstructorEventItem[] = (data || []).map((item) => {
          const start = `${item.date}T${item.start_time}`;
          const end = `${item.date}T${item.end_time}`;

          return {
            id: `schedule-${item.id}`,
            title: item.lecture_title,
            start,
            end,
            category: (item.lecture_type || 'GENERAL') as InstructorEventItem['category'],
            status: item.lecture_status as InstructorEventItem['status'],
            location: item.lecture_location,
            content: '', // 필요하면 CalendarScheduleSerializer에 content 추가해서 채우기
            instructors: (item.confirmed_instructors || []).map((name) => ({
              name,
              phone: '',
              role: 'MAIN',
            })),
            // 캘린더용이라 instructorStatus는 일단 CONFIRMED로 고정 (추후 applications API와 조합 가능)
            instructorStatus: 'CONFIRMED',
          };
        });

        setEvents(mapped);
      } catch (err: any) {
        console.error(err);
        setEventsError(
          err?.message || '강의 일정을 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setIsEventsLoading(false);
      }
    };

    fetchEvents();
  }, [baseUrl]);

  // ---------- 2) 내가 배정된 “다음 강의” (/lectures/schedules/next-lecture/) ----------
  useEffect(() => {
    const fetchNextLecture = async () => {
      setIsNextLoading(true);
      setNextError(null);

      try {
        if (typeof window === 'undefined') return;
        const token = window.localStorage.getItem('accessToken');
        if (!token) {
          setNextError('로그인 토큰이 없습니다.');
          return;
        }

        const res = await fetch(
          `${baseUrl}/lectures/schedules/next-lecture/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // 예정 강의가 없을 때 204를 주는 구현이므로, 그 경우는 "없음" 처리
        if (res.status === 204) {
          setNextEvents([]);
          return;
        }

        if (!res.ok) {
          throw new Error('다음 강의 정보를 불러오지 못했습니다.');
        }

        const data: NextLectureApiResponse = await res.json();

        const start = `${data.date}T${data.start_time}`;
        const end = `${data.date}T${data.end_time}`;

        const nextEvent: InstructorEventItem = {
          id: `next-${start}`,
          title: data.title,
          start,
          end,
          category: 'GENERAL', // 세부 타입 정보가 없으니 기본값
          status: 'CONFIRMED', // "내가 배정된 다음 강의"니까 확정된 일정으로 간주
          location: data.location,
          content: data.content,
          instructors: [
            {
              name: data.manager_name,
              phone: data.manager_phone,
              role: 'MAIN',
            },
          ],
          instructorStatus: 'CONFIRMED',
        };

        setNextEvents([nextEvent]);
      } catch (err: any) {
        console.error(err);
        setNextError(
          err?.message || '다음 강의 정보를 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setIsNextLoading(false);
      }
    };

    fetchNextLecture();
  }, [baseUrl]);

  // ---------- 3) 공지(Announcement) 목록 (/announcements/) ----------
  useEffect(() => {
    const fetchNotices = async () => {
      setIsNoticesLoading(true);
      setNoticesError(null);

      try {
        if (typeof window === 'undefined') return;
        const token = window.localStorage.getItem('accessToken');

        // 공지 목록이 완전 공개인지, 로그인 필요인지는 구현에 따라 다를 수 있음
        // 여기서는 토큰이 있으면 헤더에 넣고, 없으면 헤더 없이 호출
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await fetch(
          `${baseUrl}/announcements/`,
          { headers },
        );

        if (!res.ok) {
          throw new Error('공지사항을 불러오지 못했습니다.');
        }

        const data: NoticeItem[] = await res.json();
        setNotices(data || []);
      } catch (err: any) {
        console.error(err);
        setNoticesError(
          err?.message || '공지사항을 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setIsNoticesLoading(false);
      }
    };

    fetchNotices();
  }, [baseUrl]);

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 대시보드</BreadCrumb>
      <Title>대시보드</Title>

      <Grid>
        {/* 1. 주간 캘린더 */}
        <CalendarBox>
          {isEventsLoading && (
            <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
              강의 일정을 불러오는 중입니다...
            </p>
          )}
          {eventsError && !isEventsLoading && (
            <p style={{ fontSize: 14, color: '#ff6b6b', margin: 0 }}>
              {eventsError}
            </p>
          )}
          {!isEventsLoading && !eventsError && (
            <InstructorWeeklyCalendar
              events={events}
              onEventClick={(event) => setSelectedEvent(event)}
            />
          )}
        </CalendarBox>

        {/* 2. 하단 패널 */}
        <CardRow>
          <LeftPanel>
            {isNoticesLoading && (
              <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
                공지사항을 불러오는 중입니다...
              </p>
            )}
            {noticesError && !isNoticesLoading && (
              <p style={{ fontSize: 14, color: '#ff6b6b', margin: 0 }}>
                {noticesError}
              </p>
            )}
            {!isNoticesLoading && !noticesError && (
              <LatestNoticesPanel notices={notices} />
            )}
          </LeftPanel>

          <RightPanel>
            {isNextLoading && (
              <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
                다음 강의를 불러오는 중입니다...
              </p>
            )}
            {nextError && !isNextLoading && (
              <p style={{ fontSize: 14, color: '#ff6b6b', margin: 0 }}>
                {nextError}
              </p>
            )}
            {!isNextLoading && !nextError && (
              <NextLectureWidget events={nextEvents} />
            )}
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
