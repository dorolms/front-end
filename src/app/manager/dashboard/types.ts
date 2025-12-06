// src/app/manager/dashboard/types.ts

export type Category =
  | 'GENERAL'
  | 'COMPETITION'
  | 'CAMP'
  | 'DOROLAND'
  | 'BOOTH'
  | 'ETC';

export type LectureStatus = 'RECRUITING' | 'ALLOCATING' | 'CONFIRMED' | 'COMPLETED';

// 강사 정보 타입
export type InstructorProfile = {
  name: string;
  phone: string;
  role: 'MAIN' | 'ASSISTANT'; // 주강사 | 보조강사
};

// 캘린더용 이벤트 아이템 (매니저용)
export type ManagerEventItem = {
  id: string;
  title: string;
  start: string; // ISO String
  end: string;   // ISO String
  category: Category;
  status: LectureStatus;

  // [기존 필드]
  location?: string;
  content?: string;
  instructors: InstructorProfile[];

  // [NEW] 상세 정보 필드 추가
  target?: string;         // 대상
  capacity?: string;       // 정원
  fee?: string;            // 강사료
  note?: string;           // 참고사항
  attachment_url?: string; // 참고자료

  // 다중 일정
  schedules?: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  }>;
};

// ... 나머지 RecruitmentItem, DashboardNotice 등은 기존 유지
export type RecruitmentItem = {
  id: number;
  title: string;
  date: string;
  status: 'RECRUITING' | 'ALLOCATING';
  currentCount: number;
  targetCount: number;
};

export type DashboardNotice = {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  content: string;
};