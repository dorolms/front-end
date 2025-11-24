/**
 * _types.ts
 * - 이 라우트(공지사항)에서 사용하는 타입을 정의.
 * - 백엔드 DB 모델(Announcement, User 등)의 필드 중
 *   프론트 표시/처리에 필요한 최소 필드만 노출.
 */
export type Notice = {
  id: number;
  title: string;
  author: string;   // User.name
  createdAt: string; // 'YYYY-MM-DD HH:mm' or ISO string
  content: string;
};
