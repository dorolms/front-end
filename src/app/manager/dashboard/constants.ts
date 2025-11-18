// src/app/manager/dashboard/constants.ts

export const MANAGER_THEME = {
  GENERAL: '#FFF8E1',      // 아주 연한 노랑 (배경)
  COMPETITION: '#E3F2FD',  // 아주 연한 하늘
  CAMP: '#E8F5E9',         // 아주 연한 연두
  DOROLAND: '#E8EAF6',     // 아주 연한 남색
  BOOTH: '#FCE4EC',        // 아주 연한 핑크
  ETC: '#F5F5F5',          // 아주 연한 회색
};

export const MANAGER_BORDER = {
  GENERAL: '#FFD54F',      // 진한 노랑 (왼쪽 띠/텍스트)
  COMPETITION: '#64B5F6',
  CAMP: '#81C784',
  DOROLAND: '#7986CB',
  BOOTH: '#F06292',
  ETC: '#BDBDBD',
};

// 글씨는 가독성을 위해 통일된 짙은 색 or 포인트 색상 사용
export const getTextColor = (category: string) => {
  return '#374151'; // 기본적으로 진한 회색 (가독성 최우선)
};