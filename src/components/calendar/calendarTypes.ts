// src/components/calendar/calendarTypes.ts

/** 페이지별 상태 타입을 주입할 수 있는 공용 캘린더 이벤트 */
export type CalendarEvent<Status extends string, Meta = unknown> = {
  id: number | string;
  date: string; // "YYYY-MM-DD"
  timeLabel: string; // "09:00 ~ 11:00"
  title: string;
  status: Status; // 페이지별로 주입
  type: string; // general / camp / booth ...
  meta?: Meta; // 신청여부, 내 상태 등 페이지별 확장 필드
};

/** 모달 버튼 한 개 정의 */
export type ModalAction = {
  label: string;
  onClick: (id: number | string) => void;
  variant?: "primary" | "danger" | "ghost";
  disabled?: boolean;
};
