// src/app/instructor/dashboard/types.ts

export type Category =
  | 'GENERAL'
  | 'COMPETITION'
  | 'CAMP'
  | 'DOROLAND'
  | 'BOOTH'
  | 'ETC';

export type LectureStatus = 'RECRUITING' | 'ALLOCATING' | 'CONFIRMED' | 'COMPLETED';

// 내 신청 상태
export type InstructorEventStatus = 'APPLIED' | 'PENDING' | 'CONFIRMED';

export type InstructorProfile = {
  name: string;
  phone: string;
  role: 'MAIN' | 'ASSISTANT' | 'MANAGER'; // 매니저 포함
};

// 기본 강의 정보
export type BaseEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  category: Category;
  status: LectureStatus;
  location?: string;
  content?: string;
  instructors: InstructorProfile[];
};

// 강사 대시보드용 이벤트 아이템 (상세 정보 포함)
export type InstructorEventItem = BaseEvent & {
  instructorStatus: InstructorEventStatus; // 나의 상태

  // [상세 조회 필드 추가]
  target?: string;         // 대상 (고등학생 등)
  capacity?: string;       // 정원 (30명 등)
  fee?: string;            // 강사료
  note?: string;           // 특이 사항
  attachment_url?: string; // 첨부 파일

  // 다중 일정 배열
  schedules?: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  }>;
};

export type DashboardNotice = {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  content: string;
};