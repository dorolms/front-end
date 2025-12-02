// src/app/manager/dashboard/ClientPage.tsx
'use client';

import { useEffect, useState } from 'react';
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

import ManagerWeeklyCalendar from './components/ManagerWeeklyCalendar';
import RecruitmentStatusWidget from './components/RecruitmentStatusWidget';
import LatestNoticesPanel from './components/LatestNoticesPanel';
import ManagerEventDetailModal from './components/ManagerEventDetailModal';

import type { ManagerEventItem, RecruitmentItem, DashboardNotice } from './types';

type RawScheduleItem = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  lecture_id: number;
  lecture_title: string;
  lecture_location: string;
  lecture_status: string;
  confirmed_instructors: string[];
  lecture_type?: string; // 혹시 type을 추가해두셨다면
};

type RawLectureListItem = {
  id: number;
  title: string;
  type: string;
  category: string | null;
  status: string; // 'RECRUITING' | 'ALLOCATING' | 'COMPLETED'
  end_date: string | null;
  recruitment_main: number;
  recruitment_assist: number;
  applicant_count_main: number;
  applicant_count_assist: number;
  schedules: { id: number; date: string; start_time: string; end_time: string }[];
};

type RawApplicationItem = {
  id: number;
  lecture: number;
  lecture_title: string;
  user: {
    id: number;
    name: string;
    major: string | null;
    phone_num: string | null;
    role: string;
  };
  applied_role: 'main' | 'assist';
  assignment_status: 'pending' | 'assigned' | 'rejected';
  created_at: string;
  is_notification_read: boolean;
};

type NoticeItem = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

function formatDateLabel(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${mm}.${dd}(${weekday})`;
}

export default function ManagerClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<ManagerEventItem | null>(null);

  const [calendarEvents, setCalendarEvents] = useState<ManagerEventItem[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const [notices, setNotices] = useState<DashboardNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState<string | null>(null);

  const [recruitmentsRecruiting, setRecruitmentsRecruiting] = useState<RecruitmentItem[]>([]);
  const [recruitmentsCompleted, setRecruitmentsCompleted] = useState<RecruitmentItem[]>([]);
  const [recruitmentsLoading, setRecruitmentsLoading] = useState(false);
  const [recruitmentsError, setRecruitmentsError] = useState<string | null>(null);

  const accessToken =
    typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;

  // 1) 캘린더 데이터 로드
  useEffect(() => {
    const fetchCalendar = async () => {
      setCalendarLoading(true);
      setCalendarError(null);

      try {
        const res = await fetch(
          `${API_BASE}/lectures/schedules/?status=RECRUITING`,
          {
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          },
        );

        if (!res.ok) {
          throw new Error('캘린더 데이터를 불러오지 못했습니다.');
        }

        const raw: RawScheduleItem[] = await res.json();

        const mapped: ManagerEventItem[] = raw.map((item) => ({
          id: String(item.id),
          title: item.lecture_title,
          start: `${item.date}T${item.start_time}`,
          end: `${item.date}T${item.end_time}`,
          category: (item as any).lecture_type || 'GENERAL',
          status: item.lecture_status as ManagerEventItem['status'],
          location: item.lecture_location,
          content: '',
          instructors: item.confirmed_instructors.map((name) => ({
            name,
            phone: '',
            role: 'MAIN',
          })),
        }));

        setCalendarEvents(mapped);
      } catch (err: any) {
        console.error(err);
        setCalendarError(err.message || '캘린더 데이터를 불러오지 못했습니다.');
      } finally {
        setCalendarLoading(false);
      }
    };

    if (accessToken) {
      fetchCalendar();
    }
  }, [accessToken]);

  // 2) 최근 공지사항
  useEffect(() => {
    const fetchNotices = async () => {
      setNoticesLoading(true);
      setNoticesError(null);

      try {
        const res = await fetch(`${API_BASE}/announcements/`, {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        });

        if (!res.ok) {
          throw new Error('공지사항을 불러오지 못했습니다.');
        }

        const data: NoticeItem[] = await res.json();

        // DashboardNotice 타입으로 매핑 (createdAt 필드 포함)
        const mapped: DashboardNotice[] = data.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          createdAt: n.created_at,
        }));

        setNotices(mapped);
      } catch (err: any) {
        console.error(err);
        setNoticesError(err.message || '공지사항을 불러오지 못했습니다.');
      } finally {
        setNoticesLoading(false);
      }
    };

    if (accessToken) {
      fetchNotices();
    }
  }, [accessToken]);

  // 3) 모집/배정 현황
  useEffect(() => {
    const fetchRecruitments = async () => {
      setRecruitmentsLoading(true);
      setRecruitmentsError(null);

      try {
        // 3-1. 모집 중 / 배정 중 강의 (RECRUITING, ALLOCATING)
        const resRecruit = await fetch(
          `${API_BASE}/lectures/lectures/?status=RECRUITING`,
          {
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          },
        );
        const resAlloc = await fetch(
          `${API_BASE}/lectures/lectures/?status=ALLOCATING`,
          {
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          },
        );

        if (!resRecruit.ok || !resAlloc.ok) {
          throw new Error('모집/배정 중 강의 목록을 불러오지 못했습니다.');
        }

        const recruitingLectures: RawLectureListItem[] = await resRecruit.json();
        const allocatingLectures: RawLectureListItem[] = await resAlloc.json();

        const recruitBase = [...recruitingLectures, ...allocatingLectures];

        // 가장 가까운 일정 기준 정렬
        const sortedRecruit = recruitBase
          .filter((lec) => lec.schedules && lec.schedules.length > 0)
          .sort((a, b) => {
            const aSchedule = a.schedules[0];
            const bSchedule = b.schedules[0];
            const aDate = new Date(`${aSchedule.date}T${aSchedule.start_time}`);
            const bDate = new Date(`${bSchedule.date}T${bSchedule.start_time}`);
            return aDate.getTime() - bDate.getTime();
          })
          .slice(0, 3);

        const recruitingItems: RecruitmentItem[] = sortedRecruit.map((lec) => {
          const firstSchedule = lec.schedules[0];
          return {
            id: lec.id,
            title: lec.title,
            date: formatDateLabel(firstSchedule.date),
            status: lec.status as RecruitmentItem['status'], // 'RECRUITING' | 'ALLOCATING'
            currentCount: lec.applicant_count_main + lec.applicant_count_assist,
            targetCount: lec.recruitment_main + lec.recruitment_assist,
          };
        });

        // 3-2. 배정 완료(COMPLETED) 강의
        const resCompleted = await fetch(
          `${API_BASE}/lectures/lectures/?status=COMPLETED`,
          {
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          },
        );

        if (!resCompleted.ok) {
          throw new Error('배정 완료 강의 목록을 불러오지 못했습니다.');
        }

        const completedLectures: RawLectureListItem[] = await resCompleted.json();

        const sortedCompleted = completedLectures
          .filter((lec) => lec.schedules && lec.schedules.length > 0)
          .sort((a, b) => {
            const aSchedule = a.schedules[0];
            const bSchedule = b.schedules[0];
            const aDate = new Date(`${aSchedule.date}T${aSchedule.start_time}`);
            const bDate = new Date(`${bSchedule.date}T${bSchedule.start_time}`);
            return aDate.getTime() - bDate.getTime();
          })
          .slice(0, 3);

        const completedItems: RecruitmentItem[] = [];

        // 각 COMPLETED 강의마다 지원서 목록을 가져와서
        // - ASSIGNED 상태인 강사 수
        // - 그 중 알림을 읽은 강사 수
        // 를 집계
        for (const lec of sortedCompleted) {
          const appsRes = await fetch(
            `${API_BASE}/lectures/applications/?lecture_id=${lec.id}`,
            {
              headers: accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : undefined,
            },
          );

          if (!appsRes.ok) continue;

          const rawApps: RawApplicationItem[] = await appsRes.json();

          // ✅ 여기서부터가 핵심: snake_case 필드를 그대로 사용
          const assignedApps = rawApps.filter(
            (app) => app.assignment_status === 'assigned',
          );

          const totalAssigned = assignedApps.length;
          const totalRead = assignedApps.filter(
            (app) => app.is_notification_read === true,
          ).length;

          const firstSchedule = lec.schedules[0];

          completedItems.push({
            id: lec.id,
            title: lec.title,
            date: formatDateLabel(firstSchedule.date),
            status: 'COMPLETED', // 위젯에서 '배정 완료'로 표시
            currentCount: totalRead, // 읽음 처리된 알림 수
            targetCount: totalAssigned, // 배정된 강사 수
          });
        }

        setRecruitmentsRecruiting(recruitingItems);
        setRecruitmentsCompleted(completedItems);
      } catch (err: any) {
        console.error(err);
        setRecruitmentsError(
          err.message || '모집/배정 현황을 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setRecruitmentsLoading(false);
      }
    };

    if (accessToken) {
      fetchRecruitments();
    }
  }, [accessToken]);

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 대시보드</BreadCrumb>
      <Title>대시보드</Title>

      <Grid>
        {/* 1. 캘린더 */}
        <CalendarBox>
          <ManagerWeeklyCalendar
            events={calendarEvents}
            isLoading={calendarLoading}
            error={calendarError}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        </CalendarBox>

        {/* 2. 하단 패널 */}
        <CardRow>
          <LeftPanel>
            <LatestNoticesPanel
              notices={notices}
              isLoading={noticesLoading}
              error={noticesError}
            />
          </LeftPanel>
          <RightPanel>
            <RecruitmentStatusWidget
              recruiting={recruitmentsRecruiting}
              completed={recruitmentsCompleted}
              isLoading={recruitmentsLoading}
              error={recruitmentsError}
            />
          </RightPanel>
        </CardRow>
      </Grid>

      {/* 3. 모달 */}
      {selectedEvent && (
        <ManagerEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}
