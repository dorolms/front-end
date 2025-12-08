// src/app/instructor/dashboard/types.ts

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
  role: "MAIN" | "ASSISTANT" | "MANAGER";
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
  instructorStatus: InstructorEventStatus; // 나의 상태

  // [상세 조회 필드 추가]
  target?: string; // 대상 (고등학생 등)
  capacity?: string; // 정원 (30명 등)
  fee?: string; // 강사료
  note?: string; // 특이 사항
  attachment_url?: string; // 첨부 파일

  // 다중 일정 배열
  schedules?: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  }>;
};

// 공지 타입 (매니저와 동일 형태)
export type DashboardNotice = {
  id: number;
  title: string;
  createdAt: string;
};
