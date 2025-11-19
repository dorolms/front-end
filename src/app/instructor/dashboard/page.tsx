// src/app/instructor/dashboard/page.tsx

import ClientPage from './ClientPage';

export const metadata = {
  title: '강사 대시보드 | DORO LMS',
  description: '내 강의 일정 및 신청 현황 확인',
};

export default function Page() {
  return <ClientPage />;
}
