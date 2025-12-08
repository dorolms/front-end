import type { Notice } from "../../instructor/notices/types";
import type {
  InstructorEventItem,
  Category,
  InstructorEventStatus,
  LectureStatus,
} from "./types";

const BASE_URL = "http://127.0.0.1:8000";

// 1. 강의 목록 조회 응답
type BackendLecture = {
  id: number;
  title: string;
  type: string;
  category: string;
  status: string;
  my_application_status: string | null;
  schedules: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  }[];
  // 목록 API에서 location이 올 수도 있고 안 올 수도 있음
  location?: string;
  content?: string;
};

// 2. 지원 현황 조회 응답
type BackendApplication = {
  id: number;
  lecture: number;
  assignment_status: string;
  is_notification_read: boolean;
};

// 3. 상세 조회 응답
type BackendLectureDetail = {
  id: number;
  title: string;
  type: string;
  category: string;
  status: string;
  location: string; // 상세에는 확실히 있음
  target: string;
  capacity: string;
  content: string;
  fee: string;
  note: string;
  attachment_url: string;
  manager_name: string;
  manager_phone: string;
  schedules: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  }>;
  confirmed_instructors: string[];
};

// 유틸 함수
const mapCategory = (type: string): Category => {
  const t = type?.toUpperCase();
  if (["GENERAL", "COMPETITION", "CAMP", "DOROLAND", "BOOTH"].includes(t))
    return t as Category;
  return "GENERAL";
};

const combineDateTime = (date: string, time: string) => {
  const safeDate = date || new Date().toISOString().split("T")[0];
  let safeTime = time || "00:00:00";
  if (safeTime.length === 7) safeTime = `0${safeTime}`;
  return `${safeDate}T${safeTime}`;
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
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
   [API] 내 강의 목록 조회 (캘린더용)
   ───────────────────────────────────────────────────────────── */
export async function fetchMyLectures(): Promise<InstructorEventItem[]> {
  const lectureUrl = `${BASE_URL}/api/lectures/lectures/`;
  const appUrl = `${BASE_URL}/api/lectures/applications/`;

  try {
    const [lecturesRes, appsRes] = await Promise.all([
      fetch(lectureUrl, { cache: "no-store", headers: getHeaders() }),
      fetch(appUrl, { cache: "no-store", headers: getHeaders() }),
    ]);

    if (!lecturesRes.ok) return [];

    const lecturesJson = await lecturesRes.json();
    let lectureList: BackendLecture[] = unwrapResponse(lecturesJson) || [];
    if (!Array.isArray(lectureList)) lectureList = [];

    let appList: BackendApplication[] = [];
    if (appsRes.ok) {
      const appsJson = await appsRes.json();
      appList = unwrapResponse(appsJson) || [];
      if (!Array.isArray(appList)) appList = [];
    }

    // 1. 내가 신청한 강의만 필터링
    const myLectures = lectureList.filter(
      (l) => l.my_application_status !== null
    );

    // 2. 목록에 '장소' 정보가 없을 수 있으므로, 각 강의마다 상세 정보를 가져와 채워넣습니다.
    const enrichedLectures = await Promise.all(
      myLectures.map(async (lecture) => {
        // 이미 location이 있으면 API 호출 안 함 (최적화)
        if (lecture.location) return lecture;

        try {
          const detailRes = await fetch(
            `${BASE_URL}/api/lectures/lectures/${lecture.id}/`,
            {
              cache: "no-store",
              headers: getHeaders(),
            }
          );
          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            const detailData = unwrapResponse(detailJson);
            // 상세 정보에서 location 등을 가져와 덮어씌움
            return {
              ...lecture,
              location: detailData.location || "장소 미정",
              content: detailData.content || lecture.content,
            };
          }
          return lecture;
        } catch {
          return lecture;
        }
      })
    );

    // 3. 캘린더 이벤트 포맷으로 변환
    const events = enrichedLectures.flatMap((lecture) => {
      const myApp = appList.find((app) => app.lecture === lecture.id);
      let statusStr = myApp
        ? myApp.assignment_status.toLowerCase()
        : lecture.my_application_status?.toLowerCase() || "";
      let isRead = myApp ? myApp.is_notification_read : false;

      if (statusStr === "rejected") return [];

      let myStatus: InstructorEventStatus = "APPLIED";
      if (statusStr === "assigned") {
        myStatus = isRead ? "CONFIRMED" : "PENDING";
      }

      // 기본 목록에서는 상세 강사 정보가 없을 수 있음 (빈 배열로 시작)
      const instructorsList: any[] = [];

      return lecture.schedules.map((schedule) => ({
        id: `${lecture.id}-${schedule.id}`, // composite ID
        title: lecture.title,
        content: lecture.content || "",
        // [중요] 여기서 채워진 location을 사용
        location: lecture.location || "장소 미정",
        start: combineDateTime(schedule.date, schedule.start_time),
        end: combineDateTime(schedule.date, schedule.end_time),
        category: mapCategory(lecture.type),
        status: (lecture.status || "RECRUITING") as LectureStatus,
        instructorStatus: myStatus,
        instructors: instructorsList,
      }));
    });

    return events;
  } catch (error) {
    console.error("[일정 조회 실패]", error);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   [API] 강의 상세 정보 조회 (모달용)
   ───────────────────────────────────────────────────────────── */
export async function fetchLectureDetail(lectureId: string | number) {
  // ID가 "10-12" 형태일 수 있으므로 앞부분(강의ID)만 추출
  const realId = String(lectureId).split("-")[0];
  const url = `${BASE_URL}/api/lectures/lectures/${realId}/`;

  try {
    const res = await fetch(url, { cache: "no-store", headers: getHeaders() });
    if (!res.ok) return null;

    const json = await res.json();
    const data: BackendLectureDetail = unwrapResponse(json);

    // 강사 목록 파싱
    const instructors: any[] = [];

    // 1. 매니저
    if (data.manager_name) {
      instructors.push({
        name: data.manager_name,
        phone: data.manager_phone || "",
        role: "MANAGER",
      });
    }

    // 2. 확정 강사
    if (Array.isArray(data.confirmed_instructors)) {
      data.confirmed_instructors.forEach((str: string) => {
        const match = str.match(/^(.*)\((.*)\)$/);
        if (match) {
          instructors.push({
            name: match[1],
            phone: "",
            role: match[2].toUpperCase().includes("MAIN")
              ? "MAIN"
              : "ASSISTANT",
          });
        } else {
          instructors.push({ name: str, phone: "", role: "ASSISTANT" });
        }
      });
    }

    // 모달에 필요한 모든 정보 반환
    return {
      title: data.title,
      content: data.content,
      location: data.location,
      status: data.status, // 모집중/배정중 등 상태 업데이트
      target: data.target,
      capacity: data.capacity,
      fee: data.fee,
      note: data.note,
      attachment_url: data.attachment_url,
      schedules: data.schedules, // 다중 일정 배열
      instructors: instructors,
    };
  } catch {
    return null;
  }
}

export async function fetchLatestNotices(): Promise<Notice[]> {
  const url = `${BASE_URL}/api/announcements/`;
  try {
    const res = await fetch(url, { cache: "no-store", headers: getHeaders() });
    if (!res.ok) return [];

    const json = await res.json();
    let realData = unwrapResponse(json);
    const formatDate = (d: string) =>
      d?.replace("T", " ").substring(0, 16) || "-";

    if (Array.isArray(realData)) {
      return realData.map((data: any) => ({
        id: data.id || data.announcementId || 0,
        title: data.title,
        content: data.content,
        author: data.author_name || data.authorName || "관리자",
        createdAt: formatDate(data.created_at || data.createdAt),
      }));
    }
    return [];
  } catch {
    return [];
  }
}
