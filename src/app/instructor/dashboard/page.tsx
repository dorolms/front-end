/**
 * /instructor/dashboard/page.tsx
 * - 서버 컴포넌트: metadata 가능
 * - 실제 UI/상태는 클라 컴포넌트(ClientPage)로 분리
 */

export const metadata = {
  title: '대시보드 | DORO LMS',
  description: '강사용 대시보드 (주간 일정 + 다음 강의)',
};

import ClientPage from './ClientPage';

export default function Page() {
  return <ClientPage />;
}
