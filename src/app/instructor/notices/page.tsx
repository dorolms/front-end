/**
 * page.tsx (Server Component)
 * - Next.js App Router에서 라우트 엔트리 포인트.
 * - 반드시 서버 컴포넌트여야 하므로 'use client' 금지.
 * - 페이지 메타데이터(export const metadata)는 서버 환경에서만 허용됨.
 * - 실제 UI/상태 로직은 ClientPage(클라 컴포넌트)로 분리하여 렌더.
 */

export const metadata = {
  title: '공지사항 | DORO LMS',
  description: '강사용 공지사항 목록',
};

import ClientPage from './ClientPage';

export default function Page() {
  // 서버 컴포넌트에서는 단순히 클라 컴포넌트를 반환
  return <ClientPage />;
}
