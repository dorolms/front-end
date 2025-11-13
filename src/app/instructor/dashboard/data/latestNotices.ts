// src/app/instructor/dashboard/data/latestNotices.ts

export type DashboardNotice = {
  id: number;
  title: string;
  createdAt: string; // '2025-11-10' 이런 형식 (필요하면 UI에서 사용)
};

export const latestNotices: DashboardNotice[] = [
  {
    id: 1,
    title: "[학교로 찾아가는 생활과학교실] - 키트 배송 안내 123456789",
    createdAt: "2025-11-10",
  },
  {
    id: 2,
    title: "[도로랜드] 강사 일정 안내",
    createdAt: "2025-11-09",
  },
  {
    id: 3,
    title: "[숨기초] 강의자료 업로드 안내",
    createdAt: "2025-11-08",
  },
  {
    id: 4,
    title: "[단원청소년수련관] 살라샬라어프레임입니다",
    createdAt: "2025-11-07",
  },
  {
    id: 5,
    title: "5번째 공지사항입니다.",
    createdAt: "2025-11-06",
  },
];
