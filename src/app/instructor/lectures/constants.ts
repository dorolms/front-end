// src/app/instructor/dashboard/constants.ts

// 매니저 대시보드와 동일한 색상 팔레트 사용
export const INSTRUCTOR_THEME = {
  GENERAL: '#FFF8E1',
  COMPETITION: '#E3F2FD',
  CAMP: '#E8F5E9',
  DOROLAND: '#E8EAF6',
  BOOTH: '#FCE4EC',
  ETC: '#F5F5F5',
};

export const INSTRUCTOR_BORDER = {
  GENERAL: '#FFD54F',
  COMPETITION: '#64B5F6',
  CAMP: '#81C784',
  DOROLAND: '#7986CB',
  BOOTH: '#F06292',
  ETC: '#BDBDBD',
};

export const getTextColor = (category: string) => '#374151';

export const STATUS_COLOR = {
  APPLIED: '#F59E0B', // 주황
  PENDING: '#3B82F6', // 파랑
  CONFIRMED: '#10B981', // 초록 (실제 카드는 카테고리 색을 주로 사용)
} as const;
