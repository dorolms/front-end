// src/app/manager/dashboard/api.ts

import type { Notice } from '../../manager/notices/types';
import type {
  ManagerEventItem,
  Category,
  LectureStatus,
  RecruitmentItem,
} from './types';

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
  // 목록에 있는 지원자 수 정보
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
  target: string;
  capacity: string;
  fee: string;
  note: string;
  attachment_url: string;

  recruitment_main: number;
  recruitment_assist: number;
  applicant_count_main: number;
  applicant_count_assist: number;

  // 상세 정보 내 지원 현황 (배정 확인용)
  applications?: {
    id: number;
    assignment_status: string; // 'assigned', 'pending' ...
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

const mapStatus = (status: string): LectureStatus => {
  const s = status?.toUpperCase();
  if (['RECRUITING', 'ALLOCATING', 'CONFIRMED', 'COMPLETED'].includes(s)) {
    return s as LectureStatus;
  }
  return 'RECRUITING';
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
   [API 1] 내가 담당하는 강의 목록 조회 (캘린더용)
   ───────────────────────────────────────────────────────────── */
export async function fetchMyManagedLectures(): Promise<ManagerEventItem[]> {
  const url = `${BASE_URL}/api/lectures/lectures/`;

  // 내 이름 가져오기
  let myName = '';
  if (typeof window !== 'undefined') {
    myName = localStorage.getItem('userName') || '';
  }
  if (!myName) return [];

  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];

    const json = await res.json();
    let list: BackendLectureList[] = unwrapResponse(json) || [];
    if (!Array.isArray(list)) list = [];

    // 상세 조회 + 내 담당 강의만 필터링 + 장소/내용/강사 정보 enrichment
    const myLectures = await Promise.all(
      list.map(async (lecture) => {
        try {
          const detailRes = await fetch(
            `${BASE_URL}/api/lectures/lectures/${lecture.id}/`,
            {
              cache: 'no-store',
              headers: getHeaders(),
            }
          );
          if (!detailRes.ok) return null;

          const detailJson = await detailRes.json();
          const detailData: BackendLectureDetail = unwrapResponse(detailJson);

          // 내 담당 강의인지 확인 (manager_name 기준)
          if (detailData.manager_name?.trim() !== myName.trim()) {
            return null;
          }

          // location, content, confirmed_instructors 등을 미리 확보
          return {
            ...lecture,
            location: detailData.location || '',
            content: detailData.content || '',
            confirmed_instructors: detailData.confirmed_instructors || [],
            status: detailData.status || lecture.status,
          };
        } catch {
          return null;
        }
      })
    );

    const enrichedList = myLectures.filter(
      (item): item is BackendLectureList & {
        location: string;
        content: string;
        confirmed_instructors: string[];
      } => item !== null
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
        location: lecture.location || '장소 미정',
        start: combineDateTime(schedule.date, schedule.start_time),
        end: combineDateTime(schedule.date, schedule.end_time),
        category: mapCategory(lecture.type),
        status: mapStatus(lecture.status),
        instructors,
      }));
    });

    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   [API 2] 강의 상세 조회 (모달용)
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
            role: match[2].toUpperCase().includes('MAIN') ? 'MAIN' : 'ASSISTANT',
          });
        } else {
          instructors.push({ name: str, phone: '', role: 'ASSISTANT' });
        }
      });
    }

    // 모달에 필요한 모든 상세 필드 반환
    return {
      title: data.title,
      content: data.content,
      location: data.location,
      instructors,
      status: data.status,

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
   [API 3] 모집 현황 (우측 하단 위젯용)
   ───────────────────────────────────────────────────────────── */
export async function fetchRecruitmentStatus(): Promise<RecruitmentItem[]> {
  const url = `${BASE_URL}/api/lectures/lectures/`;

  // 내 이름 가져오기
  let myName = '';
  if (typeof window !== 'undefined') {
    myName = localStorage.getItem('userName') || '';
  }
  if (!myName) return [];

  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];

    const json = await res.json();
    let list: BackendLectureList[] = unwrapResponse(json) || [];
    if (!Array.isArray(list)) list = [];

    // 1. 내 강의 필터링 + 데이터 병합 (목록의 지원자 수를 상세에 덮어쓰기)
    const myLectures = await Promise.all(
      list.map(async (listLecture) => {
        try {
          const detailRes = await fetch(
            `${BASE_URL}/api/lectures/lectures/${listLecture.id}/`,
            {
              cache: 'no-store',
              headers: getHeaders(),
            }
          );
          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            const detail: BackendLectureDetail = unwrapResponse(detailJson);

            // 내 담당 강의인지 확인
            if (detail.manager_name?.trim() === myName.trim()) {
              // 목록의 applicant_count 정보를 상세 객체에 병합
              return {
                ...detail,
                applicant_count_main:
                  listLecture.applicant_count_main ??
                  detail.applicant_count_main ??
                  0,
                applicant_count_assist:
                  listLecture.applicant_count_assist ??
                  detail.applicant_count_assist ??
                  0,
              } as BackendLectureDetail;
            }
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const validLectures = myLectures.filter(
      (item): item is BackendLectureDetail => item !== null
    );

    // 2. 전체 아이템 1차 가공 (상태별 데이터 생성)
    const allProcessedItems = validLectures
      .map((lecture) => {
        const status = lecture.status?.toUpperCase();
        if (!['RECRUITING', 'ALLOCATING'].includes(status)) return null;

        // 날짜
        let dateStr = '-';
        let sortTime = 0;
        if (lecture.schedules && lecture.schedules.length > 0) {
          const d = new Date(lecture.schedules[0].date);
          sortTime = d.getTime();
          const mm = d.getMonth() + 1;
          const dd = d.getDate();
          const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
          dateStr = `${mm}.${dd}(${week})`;
        }

        // 정원
        const targetCount =
          (lecture.recruitment_main || 0) + (lecture.recruitment_assist || 0);
        let currentCount = 0;
        let displayStatus: 'RECRUITING' | 'ALLOCATING' = 'RECRUITING';

        if (status === 'RECRUITING') {
          // [모집 중] 지원자 수 합계 (위에서 병합된 값 사용)
          displayStatus = 'RECRUITING';
          currentCount =
            (lecture.applicant_count_main || 0) +
            (lecture.applicant_count_assist || 0);
        } else if (status === 'ALLOCATING') {
          // [배정 중] 배정된 사람 중 '읽음' 수
          displayStatus = 'ALLOCATING';
          if (lecture.applications && Array.isArray(lecture.applications)) {
            const confirmedAndRead = lecture.applications.filter(
              (app) =>
                app.assignment_status === 'assigned' &&
                app.is_notification_read === true
            );
            currentCount = confirmedAndRead.length;
          }

          // 완료된 건(모두 읽음) 제외
          if (currentCount >= targetCount && targetCount > 0) {
            return null;
          }
        }

        return {
          id: lecture.id,
          title: lecture.title,
          date: dateStr,
          status: displayStatus,
          currentCount,
          targetCount,
          _sortTime: sortTime, // 정렬용 임시 필드
        };
      })
      .filter(
        (item): item is RecruitmentItem & { _sortTime: number } =>
          item !== null
      );

    // 3. 날짜순 정렬
    allProcessedItems.sort((a, b) => a._sortTime - b._sortTime);

    // 모집 중인 것 3개
    const recruitingItems = allProcessedItems
      .filter((item) => item.status === 'RECRUITING')
      .slice(0, 3);

    // 배정 중인 것 3개
    const allocatingItems = allProcessedItems
      .filter((item) => item.status === 'ALLOCATING')
      .slice(0, 3);

    // 두 리스트 합쳐서 반환 (총 최대 6개), _sortTime 제거
    const finalItems: RecruitmentItem[] = [
      ...recruitingItems,
      ...allocatingItems,
    ].map(({ _sortTime, ...rest }) => rest);

    return finalItems;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   [API 4] 최근 공지사항 조회
   ───────────────────────────────────────────────────────────── */
export async function fetchLatestNotices(): Promise<Notice[]> {
  const url = `${BASE_URL}/api/announcements/`;
  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    let realData = unwrapResponse(json);
    const formatDate = (d: string) =>
      d?.replace('T', ' ').substring(0, 16) || '-';

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
  } catch {
    return [];
  }
}
