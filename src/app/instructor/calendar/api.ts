import type { Notice } from '../../instructor/notices/types';
import type { InstructorEventItem, Category, InstructorEventStatus, LectureStatus } from './types';

// 프록시 사용 (next.config.ts 설정에 따름)
const BASE_URL = 'http://127.0.0.1:8000';

/**
 * [타입 정의] 백엔드 API 응답 데이터 구조
 */

// 1. 강의 목록 조회 응답 (GET /api/lectures/lectures/)
type BackendLecture = {
  id: number;
  title: string;
  type: string;
  category: string;
  status: string;
  my_application_status: string | null; // 내 신청 상태 (assigned, pending 등)
  schedules: { id: number; date: string; start_time: string; end_time: string }[];

  // 아래 필드들은 목록 API에는 없지만, 상세 조회 후 병합하여 사용할 예정입니다.
  location?: string;
  content?: string;
  manager_name?: string;
  manager_phone?: string;
  confirmed_instructors?: string[];
};

// 2. 지원 현황 조회 응답 (GET /api/lectures/applications/)
type BackendApplication = {
  id: number;
  lecture: number; // 강의 ID
  assignment_status: string; // 배정 상태
  is_notification_read: boolean; // 알림 읽음 여부 (확정대기/배정됨 구분용)
};

/**
 * [유틸 함수] 데이터 변환 및 포맷팅
 */

// 강의 카테고리 매핑 (소문자 -> 대문자 Enum)
const mapCategory = (type: string): Category => {
  const t = type?.toUpperCase();
  if (['GENERAL', 'COMPETITION', 'CAMP', 'DOROLAND', 'BOOTH'].includes(t)) {
    return t as Category;
  }
  return 'GENERAL';
};

// 날짜와 시간을 합쳐 ISO 포맷(YYYY-MM-DDTHH:mm:ss)으로 변환
// 위젯에서 new Date()를 사용할 때 시간 오류를 방지하기 위해 필수적입니다.
const combineDateTime = (date: string, time: string) => {
  const safeDate = date || new Date().toISOString().split('T')[0];
  let safeTime = time || '00:00:00';

  // 시간 포맷 보정 (9:00:00 -> 09:00:00)
  if (safeTime.length === 7) safeTime = `0${safeTime}`;

  return `${safeDate}T${safeTime}`;
};

// API 요청 헤더 생성 (토큰 포함)
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// 백엔드 응답 포장 뜯기 (result.result 구조 대응)
const unwrapResponse = (json: any) => {
  if (!json) return null;
  let target = json.result;
  if (target && target.result) return target.result;
  return target || json;
};

/* ─────────────────────────────────────────────────────────────
   [API] 캘린더 및 위젯용 내 강의 목록 조회 (핵심 기능)

   1. 강의 목록(/lectures/)과 지원 현황(/applications/)을 동시에 가져옵니다.
   2. 목록 API에 없는 '장소', '담당자' 정보를 채우기 위해 상세 API(/lectures/{id}/)를 추가로 호출합니다.
   3. '알림 읽음 여부'를 확인하여 최종 상태(확정대기 vs 배정됨)를 결정합니다.
   ───────────────────────────────────────────────────────────── */
export async function fetchMyLectures(): Promise<InstructorEventItem[]> {
  const lectureUrl = `${BASE_URL}/api/lectures/lectures/`;
  const appUrl = `${BASE_URL}/api/lectures/applications/`;

  try {
    // [Step 1] 목록과 지원 현황을 병렬로 요청
    const [lecturesRes, appsRes] = await Promise.all([
      fetch(lectureUrl, { cache: 'no-store', headers: getHeaders() }),
      fetch(appUrl, { cache: 'no-store', headers: getHeaders() }),
    ]);

    if (!lecturesRes.ok) return [];

    // [Step 2] 데이터 파싱
    const lecturesJson = await lecturesRes.json();
    let lectureList: BackendLecture[] = unwrapResponse(lecturesJson) || [];
    if (!Array.isArray(lectureList)) lectureList = [];

    let appList: BackendApplication[] = [];
    if (appsRes.ok) {
      const appsJson = await appsRes.json();
      appList = unwrapResponse(appsJson) || [];
      if (!Array.isArray(appList)) appList = [];
    }

    // 내가 신청한 강의만 필터링
    const myLectures = lectureList.filter(l => l.my_application_status !== null);

    // [Step 3] 상세 정보 병합 (장소, 매니저 정보 확보)
    // 목록 API에 없는 정보를 채우기 위해 각 강의별로 상세 조회를 수행합니다.
    const enrichedLectures = await Promise.all(
      myLectures.map(async (lecture) => {
        try {
          const detailRes = await fetch(`${BASE_URL}/api/lectures/lectures/${lecture.id}/`, {
            cache: 'no-store',
            headers: getHeaders(),
          });

          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            const detailData = unwrapResponse(detailJson);

            // 기존 데이터에 상세 정보를 덮어씌웁니다.
            return {
              ...lecture,
              location: detailData.location || lecture.location,
              content: detailData.content || lecture.content,
              manager_name: detailData.manager_name,
              manager_phone: detailData.manager_phone,
              confirmed_instructors: detailData.confirmed_instructors,
            };
          }
          return lecture;
        } catch {
          return lecture; // 상세 조회 실패 시 기존 데이터 유지
        }
      })
    );

    // [Step 4] 캘린더용 이벤트 데이터로 변환 (flatMap 사용)
    const events = enrichedLectures.flatMap((lecture) => {
      // 1. 지원 내역 매칭
      const myApp = appList.find(app => app.lecture === lecture.id);

      let statusStr = '';
      let isRead = false;

      if (myApp) {
        statusStr = myApp.assignment_status.toLowerCase();
        isRead = myApp.is_notification_read;
      } else {
        statusStr = lecture.my_application_status?.toLowerCase() || '';
      }

      // 2. 반려(rejected)된 강의는 캘린더에서 숨김 처리
      if (statusStr === 'rejected') {
        return [];
      }

      // 3. 최종 상태 결정 로직
      // assigned(배정됨) 상태라도 알림을 안 읽었으면 'PENDING(확정대기)'로 표시
      let myStatus: InstructorEventStatus = 'APPLIED';
      if (statusStr === 'assigned') {
        myStatus = isRead ? 'CONFIRMED' : 'PENDING';
      } else {
        myStatus = 'APPLIED';
      }

      // 4. 강사 및 매니저 목록 구성
      // 위젯에서 담당자를 표시할 수 있도록 'MANAGER'를 목록 맨 앞에 추가합니다.
      const instructorsList: any[] = [];

      if (lecture.manager_name) {
        instructorsList.push({
          name: `${lecture.manager_name} 매니저`,
          phone: lecture.manager_phone || '',
          role: 'MANAGER',
        });
      }

      // 확정된 다른 강사들 추가
      if (Array.isArray(lecture.confirmed_instructors)) {
        lecture.confirmed_instructors.forEach((str) => {
          // "이름(role)" 형태 파싱
          const match = str.match(/^(.*)\((.*)\)$/);
          if (match) {
            instructorsList.push({
              name: match[1],
              phone: '',
              role: match[2].toUpperCase().includes('MAIN') ? 'MAIN' : 'ASSISTANT',
            });
          } else {
            instructorsList.push({ name: str, phone: '', role: 'ASSISTANT' });
          }
        });
      }

      // 5. 스케줄별로 이벤트 객체 생성 (1강의 N일정)
      return lecture.schedules.map((schedule) => ({
        id: `${lecture.id}-${schedule.id}`, // 고유 ID 생성
        title: lecture.title,
        content: lecture.content || '',
        location: lecture.location || '장소 미정', // 상세 조회로 채워진 장소

        start: combineDateTime(schedule.date, schedule.start_time),
        end: combineDateTime(schedule.date, schedule.end_time),

        category: mapCategory(lecture.type),
        status: 'CONFIRMED' as LectureStatus, // 강의 자체는 개설됨
        instructorStatus: myStatus, // 나의 상태 (신청/확정대기/확정)
        instructors: instructorsList, // 매니저 정보 포함
      }));
    });

    return events;
  } catch (error) {
    console.error('[일정 조회 실패]', error);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   [API] 강의 상세 정보 조회 (모달 팝업용)
   ───────────────────────────────────────────────────────────── */
export async function fetchLectureDetail(lectureId: string) {
  // ID 형식: "lectureId-scheduleId" -> 앞부분만 추출
  const realId = lectureId.split('-')[0];
  const url = `${BASE_URL}/api/lectures/lectures/${realId}/`;

  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return null;

    const json = await res.json();
    const data = unwrapResponse(json);

    const instructors: any[] = [];

    // 매니저 추가
    if (data.manager_name) {
      instructors.push({
        name: data.manager_name,
        phone: data.manager_phone || '',
        role: 'MANAGER'
      });
    }

    // 확정 강사 추가
    if (Array.isArray(data.confirmed_instructors)) {
      data.confirmed_instructors.forEach((str: string) => {
        const match = str.match(/^(.*)\((.*)\)$/);
        if (match) {
          instructors.push({
            name: match[1],
            phone: '',
            role: match[2].toUpperCase().includes('MAIN') ? 'MAIN' : 'ASSISTANT'
          });
        } else {
          instructors.push({ name: str, phone: '', role: 'ASSISTANT' });
        }
      });
    }

    return {
      title: data.title,
      content: data.content,
      location: data.location,
      instructors: instructors,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   [API] 최근 공지사항 조회 (대시보드 패널용)
   ───────────────────────────────────────────────────────────── */
export async function fetchLatestNotices(): Promise<Notice[]> {
  const url = `${BASE_URL}/api/announcements/`;
  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });
    if (!res.ok) return [];

    const json = await res.json();
    let realData = unwrapResponse(json);

    // 날짜 포맷 (YYYY-MM-DD HH:mm)
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
  } catch {
    return [];
  }
}