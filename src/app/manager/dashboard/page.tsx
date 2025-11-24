// src/app/manager/dashboard/page.tsx

import ClientPage from './ClientPage';

export const metadata = {
  title: '매니저 대시보드 | DORO LMS',
  description: '강의 일정 및 모집 현황 관리',
};

export default function Page() {
  return <ClientPage />;
}