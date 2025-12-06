// src/app/manager/dashboard/api.ts

import type { Notice } from '../../manager/notices/types';
import type { ManagerEventItem, Category, LectureStatus, RecruitmentItem } from './types';

const BASE_URL = 'http://127.0.0.1:8000';

/* --------------------------------------------------------------------------
   [타입 정의]
   -------------------------------------------------------------------------- */
type BackendLectureList = {
  id: number;
  title: string;
  type: string;
  category: string;
  status: string;
  applicant_count_main?: number;
  applicant_count_assist?: number;
  schedules: { id: number; date: string; start_time: string; end_time: string }[];
};

// 상세 조회 응답 타입 확장
type BackendLectureDetail = BackendLectureList & {
  manager_name: string;
  manager_phone: string;
  location: string;
  content: string;
  confirmed_instructors: string[];

  // 추가된 상세 필드
  target: string;
  capacity: string;
  fee: string;
  note: string;
  attachment_url: string;

  recruitment_main: number;
  recruitment_assist: number;
  applicant_count_main: number;
  applicant_count_assist: number;

  applications?: {
    id: number;
    assignment_status: string;
    is_notification_read: boolean;
  }[];
};

/* --------------------------------------------------------------------------
   [유틸 함수]
   -------------------------------------------------------------------------- */
const mapCategory = (type: string): Category => {
  const t = type?.toUpperCase();
  if (['GENERAL', 'COMPETITION', 'CAMP', 'DOROLAND', 'BOOTH'].includes(t)) {
    return t as Category;
  }
  return 'GENERAL';
};

const combineDateTime = (date: string, time: string) => {
  const safeDate = date || new Date().toISOString().split('T')[0];
  let safeTime = time || '00:00:00';
  if (safeTime.length === 7) safeTime = `0${safeTime}`;
  return `${safeDate}T${safeTime}`;
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const unwrapResponse = (json: any) => {
  if (!json) return null;
  let target = json.result;
  if (target && target.result) return target.result;
  return target || json;
};

/* ─────────────────────────────────────────────────────────────
   [API] 내가 담당하는 강의 목록 조회 (캘린더용)
   ───────────────────────────────────────────────────────────── */
export async function fetchMyManagedLectures(): Promise<ManagerEventItem[]> {
  const url = `${BASE_URL}/api/lectures/lectures/`; // 매니저 필터링 적용된 엔드포인트라 가정
  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];

    const json = await res.json();
    let list: BackendLectureList[] = unwrapResponse(json);
    if (!Array.isArray(list)) list = [];

    // 목록에는 장소 정보가 없으므로 상세 조회를 통해 채워넣기 (Enrichment)
    const enrichedList = await Promise.all(
      list.map(async (lecture) => {
        try {
          // 상세 API 호출
          const detailRes = await fetch(`${BASE_URL}/api/lectures/lectures/${lecture.id}/`, {
            cache: 'no-store',
            headers: getHeaders(),
          });
          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            const detailData = unwrapResponse(detailJson);
            // location, content, confirmed_instructors 등을 미리 확보
            return {
              ...lecture,
              location: detailData.location || '',
              content: detailData.content || '',
              confirmed_instructors: detailData.confirmed_instructors || [],
            };
          }
          return lecture;
        } catch {
          return lecture;
        }
      })
    );

    const events = enrichedList.flatMap((lecture: any) => {
      // 강사 목록 파싱 (캘린더 카드 표시용)
      const instructors: any[] = [];
      if (Array.isArray(lecture.confirmed_instructors)) {
        lecture.confirmed_instructors.forEach((str: string) => {
          const match = str.match(/^(.*)\((.*)\)$/);
          if (match) {
            instructors.push({
              name: match[1],
              phone: '', // 목록에선 전화번호 알 수 없음
              role: match[2].toUpperCase().includes('MAIN') ? 'MAIN' : 'ASSISTANT',
            });
          } else {
            instructors.push({ name: str, phone: '', role: 'ASSISTANT' });
          }
        });
      }

      return lecture.schedules.map((schedule: any) => ({
        id: `${lecture.id}-${schedule.id}`,
        title: lecture.title,
        content: lecture.content || '',
        location: lecture.location || '장소 미정', // 상세 조회로 채워진 값
        start: combineDateTime(schedule.date, schedule.start_time),
        end: combineDateTime(schedule.date, schedule.end_time),
        category: mapCategory(lecture.type),
        status: (lecture.status || 'RECRUITING') as LectureStatus,
        instructors: instructors,
      }));
    });

    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   [API] 강의 상세 조회 (모달용)
   ───────────────────────────────────────────────────────────── */
export async function fetchLectureDetail(id: string) {
  const realId = id.split('-')[0];
  const url = `${BASE_URL}/api/lectures/lectures/${realId}/`;

  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return null;

    const json = await res.json();
    const data: BackendLectureDetail = unwrapResponse(json);

    // 강사 목록 파싱
    const instructors: any[] = [];
    if (Array.isArray(data.confirmed_instructors)) {
      data.confirmed_instructors.forEach((str: string) => {
        const match = str.match(/^(.*)\((.*)\)$/);
        if (match) {
          instructors.push({
            name: match[1],
            phone: '', // 상세 API에서 전화번호를 주는지 확인 필요 (없으면 공란)
            role: match[2].toUpperCase().includes('MAIN') ? 'MAIN' : 'ASSISTANT'
          });
        } else {
          instructors.push({ name: str, phone: '', role: 'ASSISTANT' });
        }
      });
    }

    // [중요] 모달에 필요한 모든 상세 필드 반환
    return {
      title: data.title,
      content: data.content,
      location: data.location,
      instructors: instructors,
      status: data.status,

      // 추가된 필드들
      target: data.target,
      capacity: data.capacity,
      fee: data.fee,
      note: data.note,
      attachment_url: data.attachment_url,
      schedules: data.schedules, // 다중 일정
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   [API] 모집 현황 (우측 하단 위젯용)
   ───────────────────────────────────────────────────────────── */
export async function fetchRecruitmentStatus(): Promise<RecruitmentItem[]> {
  const url = `${BASE_URL}/api/lectures/lectures/`;
  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];

    const json = await res.json();
    const list: BackendLectureList[] = unwrapResponse(json) || [];

    // 필터링: 모집중(RECRUITING) or 배정중(ALLOCATING)
    const activeLectures = list.filter(l =>
      l.status === 'RECRUITING' || l.status === 'ALLOCATING'
    );

    // 날짜순 정렬 -> 상위 5개 등
    activeLectures.sort((a, b) => {
      const dateA = a.schedules?.[0]?.date || '9999-99-99';
      const dateB = b.schedules?.[0]?.date || '9999-99-99';
      return dateA.localeCompare(dateB);
    });

    return activeLectures.map(l => {
      const current = (l.applicant_count_main || 0) + (l.applicant_count_assist || 0);
      // 목표 인원은 API에 없으면 임의값 or 추후 추가 필요 (여기선 0으로 처리)
      const target = 0;

      // 날짜 포맷 (MM.DD)
      const firstDate = l.schedules?.[0]?.date || '';
      const dateStr = firstDate ? `${firstDate.substring(5, 7)}.${firstDate.substring(8, 10)}` : '미정';

      return {
        id: l.id,
        title: l.title,
        date: dateStr,
        status: l.status as 'RECRUITING' | 'ALLOCATING',
        currentCount: current,
        targetCount: target,
      };
    });
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   [API] 최근 공지사항 조회
   ───────────────────────────────────────────────────────────── */
export async function fetchLatestNotices(): Promise<Notice[]> {
  const url = `${BASE_URL}/api/announcements/`;
  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    let realData = unwrapResponse(json);
    const formatDate = (d: string) => d?.replace('T', ' ').substring(0, 16) || '-';

    if (Array.isArray(realData)) {
      return realData.map((data: any) => ({
        id: data.id || data.announcementId || 0,
        title: data.title,
        content: data.content,
        author: data.author_name || data.authorName || '관리자',
        createdAt: formatDate(data.created_at || data.createdAt),
      }));
    }
    return [];
  } catch { return []; }
}