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
  location?: string;
  content?: string; // 강의 내용
  instructors: InstructorProfile[]; // 배정된 강사 목록
};

// ... 나머지 RecruitmentItem, DashboardNotice 등은 기존과 동일
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
};