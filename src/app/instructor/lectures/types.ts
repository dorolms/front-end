// src/app/instructor/lectures/types.ts

export type LectureType = 'general' | 'doroland' | 'booth' | 'etc' | 'competition' | 'camp';

export type LectureApiStatus = 'RECRUITING' | 'COMPETITION' | 'ALLOCATING' | 'COMPLETED';

// 캘린더에서 사용하는 상태 (모집중/완료만)
export type CalendarStatus = 'RECRUITING' | 'COMPLETED';

export interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

// // 리스트뷰에서 사용하는 테이블 행 타입
// export interface LectureListRow {
//   id: number;
//   no: number;
//   type: string;
//   division: string;
//   title: string;
//   applicationPeriod: string;
//   applicationLabel: string;
//   statusLabel: string;
// }

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
  my_application_status: 'pending' | 'confirmed' | 'rejected' | null;
}