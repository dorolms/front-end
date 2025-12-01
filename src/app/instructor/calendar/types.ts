// src/app/instructor/lectures/types.ts
export type LectureType = 'general' | 'doroland' | 'booth' | 'etc' | 'competition' | 'camp';
export type LectureApiStatus = 'RECRUITING' | 'COMPETITION' | 'ALLOCATING' | 'COMPLETED';
// 캘린더에서 사용하는 상태 (모집중/완료만)
export type CalendarStatus = 'RECRUITING' | 'COMPLETED';

// 강사의 배정 상태
export type AssignmentStatus = 'PENDING' | 'ASSIGNED' | 'REJECTED';

// 나의 강의 캘린더 필터
export type MyCalendarFilter = 'all' | 'ASSIGNED' | 'PENDING';

export interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

// 나의 강의 캘린더용 스케줄 (API 응답)
export interface MySchedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  lecture_id: number;
  lecture_title: string;
  lecture_location: string;
  lecture_status: LectureApiStatus;
  confirmed_instructors: string[];
  // 나중에 백엔드에서 추가될 수 있는 필드
  lecture_type?: LectureType;
}

export interface Lecture {
  id: number;
  title: string;
  type: LectureType;
  category: string | null;
  status: LectureApiStatus;
  
  end_date: string;
  recruitment_main: number;
  recruitment_assist: number;
  applicant_count_main: number;
  applicant_count_assist: number;
  my_application_status: string | null;
  schedules: Schedule[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  extendedProps: {
    lecture: Lecture;
    schedule: Schedule;
  };
}

// 나의 강의 캘린더 이벤트
export interface MyCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    schedule: MySchedule;
  };
}

// 리스트뷰에서 사용하는 테이블 행 타입
export interface LectureListRow {
  id: number;
  no: number;
  type: string;
  division: string;
  title: string;
  applicationPeriod: string;
  applicationLabel: string;
  statusLabel: string;
}

// 강의 상세 정보 (API 응답)
export interface LectureDetail {
  id: number;
  title: string;
  type: LectureType;
  category: string | null;
  status: LectureApiStatus;
  location: string;
  target: string;
  capacity: string;
  content: string;
  end_date: string;
  fee: string;
  recruitment_main: number;
  recruitment_assist: number;
  note: string;
  attachment_url: string | null;
  user: any | null;
  schedules: Schedule[];
  applications: any | null;
  confirmed_instructors: any[];
}