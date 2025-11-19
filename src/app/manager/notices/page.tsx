/**
 * page.tsx (Server Component)
 * - /manager/notices 경로의 Next.js App Router 진입점.
 * - 페이지의 <head> 메타데이터(title, description)를 설정.
 * - 실제 UI와 로직은 <ClientPage /> (클라이언트 컴포넌트)로 분리하여 렌더링.
 */

export const metadata = {
  title: '공지사항 관리 | DORO LMS',
  description: '매니저용 공지사항 등록, 수정, 조회 페이지',
};

import ClientPage from './ClientPage';

export default function Page() {
  // 서버 컴포넌트는 클라이언트 컴포넌트를 렌더링
  return <ClientPage />;
}