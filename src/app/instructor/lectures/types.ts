// src/app/instructor/dashboard/types.ts

export type EventStatus = InstructorEventItem["instructorStatus"];

export type Category =
  | "GENERAL"
  | "COMPETITION"
  | "CAMP"
  | "DOROLAND"
  | "BOOTH"
  | "ETC";

// 매니저 쪽과 동일한 강의 상태 (시스템 전체 공통)
export type LectureStatus =
  | "RECRUITING"
  | "ALLOCATING"
  | "CONFIRMED"
  | "COMPLETED";

// 강사가 한 강의에서 어떤 상태인지 (강사 관점)
export type InstructorEventStatus =
  | "APPLIED" // 신청됨
  | "PENDING" // 확정대기
  | "CONFIRMED"; // 배정됨(확정)

// 강사 정보
export type InstructorProfile = {
  name: string;
  phone: string;
  role: "MAIN" | "ASSISTANT";
};

// 기본 강의 정보
export type BaseEvent = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  category: Category;
  status: LectureStatus;
  location?: string;
  content?: string;
  instructors: InstructorProfile[];
};

// 강사 대시보드용 이벤트 타입
export type InstructorEventItem = BaseEvent & {
  instructorStatus: InstructorEventStatus;
};

// 공지 타입 (매니저와 동일 형태)
export type DashboardNotice = {
  id: number;
  title: string;
  createdAt: string;
};
