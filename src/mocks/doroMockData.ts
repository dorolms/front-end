// src/mocks/doroMockData.ts
// ---------------------------------------------
// DORO 통합 목업 데이터 (DBML mirror)
// - 관계(FK) 일관성 유지
// - API 나오면 이 파일에서 shape만 교체하면 됨
// ---------------------------------------------

/** ------------------------
 *  Enums (DBML mirror)
 *  ------------------------ */
export type UserRole = "manager" | "instructor";

export type LectureType =
  | "general"
  | "competition"
  | "camp"
  | "doroland"
  | "booth"
  | "etc";

export type LectureStatus = "recruiting" | "allocating" | "completed";

export type LectureRole = "main" | "assist";

export type AssignmentStatus = "pending" | "assigned";

/** ------------------------
 *  Tables (DBML mirror)
 *  ------------------------ */
export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string; // ISO
}

export interface Lecture {
  lecture_id: number;
  title: string;
  type: LectureType;
  category?: string | null;
  status: LectureStatus;

  lecture_start_datetime: string; // ISO
  lecture_end_datetime: string; // ISO

  location?: string | null;
  manager_id: number; // FK -> User.user_id (role=manager)
  target_audience?: string | null;
  content_description?: string | null;

  special_notes?: string | null;
  attachment_url?: string | null;

  created_at: string; // ISO
}

// (DBML에 미완성이라 합리적 가정으로 설계)
// 강의가 여러 타임일 수 있으므로 1:N
export interface LectureTime {
  lecture_time_id: number;
  lecture_id: number; // FK -> Lecture.lecture_id
  start_datetime: string; // ISO
  end_datetime: string; // ISO
  note?: string | null;
}

export interface LectureRecruitment {
  lecture_id: number; // PK & FK -> Lecture.lecture_id
  application_start_date: string; // YYYY-MM-DD
  application_end_date: string; // YYYY-MM-DD

  max_participants: number;
  recruitment_main_needed: number;
  recruitment_assist_needed: number;

  fee_main: number;
  fee_assist: number;
}

export interface Application {
  application_id: number;
  lecture_id: number; // FK -> Lecture.lecture_id
  user_id: number; // FK -> User.user_id (role=instructor)
  applied_role: LectureRole;

  portfolio_snapshot?: string | null;

  assignment_status: AssignmentStatus;
  assigned_role?: LectureRole | null;

  applied_at: string; // ISO
}

export interface Announcement {
  announcement_id: number;
  author_id: number; // FK -> User.user_id (manager)
  author_name: string; // denormalized (DBML note 반영)
  title: string;
  content: string;
  created_at: string; // ISO
}

export interface Message {
  message_id: number;
  sender_id: number; // FK -> User.user_id
  recipient_id: number; // FK -> User.user_id
  content: string;
  sent_at: string; // ISO
  read_at?: string | null; // ISO | null
}

export interface Notification {
  notification_id: number;
  user_id: number; // FK -> User.user_id (instructor)
  lecture_id?: number | null; // FK -> Lecture.lecture_id
  message: string;
  is_read: boolean;
  created_at: string; // ISO
}

/** ------------------------
 *  Mock Data
 *  - FK consistent
 *  - 2025-11 기준
 *  ------------------------ */

// Users
export const MOCK_USERS: User[] = [
  {
    user_id: 1,
    name: "도로쌤(매니저)",
    email: "manager@doro.com",
    password: "hashed_pw_manager",
    role: "manager",
    created_at: "2025-10-01T09:00:00+09:00",
  },
  {
    user_id: 2,
    name: "김지수",
    email: "jisu@doro.com",
    password: "hashed_pw_jisu",
    role: "instructor",
    created_at: "2025-10-03T10:30:00+09:00",
  },
  {
    user_id: 3,
    name: "김지훈",
    email: "jihun@doro.com",
    password: "hashed_pw_jihun",
    role: "instructor",
    created_at: "2025-10-05T11:00:00+09:00",
  },
];

// Lectures
export const MOCK_LECTURES: Lecture[] = [
  {
    lecture_id: 10,
    title: "[초등] 로봇 기초 교육",
    type: "general",
    category: "robot",
    status: "recruiting",
    lecture_start_datetime: "2025-11-05T09:00:00+09:00",
    lecture_end_datetime: "2025-11-05T11:00:00+09:00",
    location: "남양초 1층 과학실",
    manager_id: 1,
    target_audience: "초등 4~6학년",
    content_description: "로봇 키트로 기초 구조/코딩 학습",
    special_notes: "노트북 지참",
    attachment_url: null,
    created_at: "2025-10-10T14:00:00+09:00",
  },
  {
    lecture_id: 11,
    title: "[중등] 코딩 대회 대비 특강",
    type: "competition",
    category: "coding",
    status: "allocating",
    lecture_start_datetime: "2025-11-11T13:00:00+09:00",
    lecture_end_datetime: "2025-11-11T15:00:00+09:00",
    location: "성남 OO중",
    manager_id: 1,
    target_audience: "중등",
    content_description: "대회 유형 문제 풀이/전략",
    special_notes: null,
    attachment_url: "https://example.com/attach/11.pdf",
    created_at: "2025-10-12T15:00:00+09:00",
  },
  {
    lecture_id: 12,
    title: "[고등] AI 기초 캠프",
    type: "camp",
    category: "ai",
    status: "completed",
    lecture_start_datetime: "2025-11-21T14:00:00+09:00",
    lecture_end_datetime: "2025-11-21T16:00:00+09:00",
    location: "경기고 2층 세미나실",
    manager_id: 1,
    target_audience: "고등",
    content_description: "AI 이론 + 실습 체험형 캠프",
    special_notes: "실습 계정 사전 배포",
    attachment_url: null,
    created_at: "2025-10-15T09:30:00+09:00",
  },
];

// LectureTimes (강의별 다회차 예시 포함)
export const MOCK_LECTURE_TIMES: LectureTime[] = [
  {
    lecture_time_id: 100,
    lecture_id: 10,
    start_datetime: "2025-11-05T09:00:00+09:00",
    end_datetime: "2025-11-05T11:00:00+09:00",
    note: "1회차",
  },
  {
    lecture_time_id: 110,
    lecture_id: 11,
    start_datetime: "2025-11-11T13:00:00+09:00",
    end_datetime: "2025-11-11T15:00:00+09:00",
    note: "단회 특강",
  },
  {
    lecture_time_id: 120,
    lecture_id: 12,
    start_datetime: "2025-11-21T14:00:00+09:00",
    end_datetime: "2025-11-21T16:00:00+09:00",
    note: "캠프 Day1",
  },
];

// Recruitment
export const MOCK_LECTURE_RECRUITMENTS: LectureRecruitment[] = [
  {
    lecture_id: 10,
    application_start_date: "2025-10-20",
    application_end_date: "2025-11-02",
    max_participants: 2,
    recruitment_main_needed: 1,
    recruitment_assist_needed: 1,
    fee_main: 150000,
    fee_assist: 80000,
  },
  {
    lecture_id: 11,
    application_start_date: "2025-10-18",
    application_end_date: "2025-11-07",
    max_participants: 1,
    recruitment_main_needed: 1,
    recruitment_assist_needed: 0,
    fee_main: 200000,
    fee_assist: 0,
  },
  {
    lecture_id: 12,
    application_start_date: "2025-10-01",
    application_end_date: "2025-10-31",
    max_participants: 2,
    recruitment_main_needed: 1,
    recruitment_assist_needed: 1,
    fee_main: 180000,
    fee_assist: 90000,
  },
];

// Applications
export const MOCK_APPLICATIONS: Application[] = [
  {
    application_id: 1000,
    lecture_id: 10,
    user_id: 2,
    applied_role: "main",
    portfolio_snapshot: "로봇/코딩 교육 경력 1년",
    assignment_status: "pending",
    assigned_role: null,
    applied_at: "2025-10-25T12:00:00+09:00",
  },
  {
    application_id: 1001,
    lecture_id: 10,
    user_id: 3,
    applied_role: "assist",
    portfolio_snapshot: "초등 캠프 보조 3회",
    assignment_status: "pending",
    assigned_role: null,
    applied_at: "2025-10-26T09:40:00+09:00",
  },
  {
    application_id: 1002,
    lecture_id: 11,
    user_id: 2,
    applied_role: "main",
    portfolio_snapshot: "대회 대비 특강 진행 경험",
    assignment_status: "assigned",
    assigned_role: "main",
    applied_at: "2025-10-22T18:10:00+09:00",
  },
  {
    application_id: 1003,
    lecture_id: 12,
    user_id: 3,
    applied_role: "assist",
    portfolio_snapshot: "AI 캠프 TA 경험",
    assignment_status: "assigned",
    assigned_role: "assist",
    applied_at: "2025-10-10T13:20:00+09:00",
  },
];

// Announcements
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    announcement_id: 500,
    author_id: 1,
    author_name: "도로쌤(매니저)",
    title: "11월 강의 배정 안내",
    content:
      "11월 강의는 11/08까지 배정 확정 예정입니다. 지원 현황을 꼭 확인해주세요.",
    created_at: "2025-11-01T10:00:00+09:00",
  },
];

// Messages
export const MOCK_MESSAGES: Message[] = [
  {
    message_id: 900,
    sender_id: 1,
    recipient_id: 2,
    content: "10번 강의 지원 확인했습니다. 배정은 곧 안내드릴게요!",
    sent_at: "2025-10-27T16:30:00+09:00",
    read_at: "2025-10-27T17:10:00+09:00",
  },
  {
    message_id: 901,
    sender_id: 2,
    recipient_id: 1,
    content: "네 확인했습니다! 감사합니다.",
    sent_at: "2025-10-27T17:12:00+09:00",
    read_at: null,
  },
];

// Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notification_id: 700,
    user_id: 2,
    lecture_id: 11,
    message: "📌 [중등] 코딩 대회 대비 특강에 주강사로 배정되었습니다.",
    is_read: false,
    created_at: "2025-11-08T09:00:00+09:00",
  },
  {
    notification_id: 701,
    user_id: 3,
    lecture_id: 12,
    message: "✅ [고등] AI 기초 캠프에 보조강사로 배정되었습니다.",
    is_read: true,
    created_at: "2025-11-02T10:00:00+09:00",
  },
];

/** ------------------------
 *  Handy lookup maps (optional)
 *  - 화면 개발 편의용
 *  ------------------------ */
export const USERS_BY_ID = new Map(MOCK_USERS.map((u) => [u.user_id, u]));
export const LECTURES_BY_ID = new Map(
  MOCK_LECTURES.map((l) => [l.lecture_id, l])
);
export const APPLICATIONS_BY_LECTURE = new Map<number, Application[]>();
for (const app of MOCK_APPLICATIONS) {
  const arr = APPLICATIONS_BY_LECTURE.get(app.lecture_id) ?? [];
  arr.push(app);
  APPLICATIONS_BY_LECTURE.set(app.lecture_id, arr);
}
