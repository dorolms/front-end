/**
 * 대시보드에서 쓰는 타입들
 * - Status: 이벤트 확정 상태 (대시보드엔 CONFIRMED만 노출)
 * - Category: 강의 분류(색상 지정)
 */

export type Status = 'CONFIRMED' | 'PENDING_CONFIRM' | 'REQUESTED';

export type Category =
  | 'GENERAL'     // #FFE286
  | 'COMPETITION' // #83CBEB
  | 'BOOTH'       // #F6C6AC
  | 'CAMP'        // #B4E5A2
  | 'DOROLAND'    // #8EACF6
  | 'ETC';        // #BFBFBF

export type EventItem = {
  id: string;
  title: string;          // 캘린더 표시용
  start: string;          // ISO (예: '2025-09-10T09:00:00')
  end: string;            // ISO
  status: Status;         // 확정/대기/신청
  category: Category;     // 색상 분류
  location?: string;      // 상세 카드에 표시할 장소
  manager?: string;       // 담당자 표시
  content?: string;       // 컨텐츠/주제
};
