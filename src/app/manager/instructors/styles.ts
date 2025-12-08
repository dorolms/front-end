'use client';

import styled from 'styled-components';

// --- Styled Components ---

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 8px 0 24px;
`;

export const PageContainer = styled.div`
  width: 100%;
  /* [유지] 상단 Nav 바 고려 패딩 (100px) */
  padding: 40px 40px 0 40px; 
  background-color: #f9fafb;
  /* [유지] 화면 전체 높이 고정 */
  height: calc(100vh - 80px); 
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden; 
`;

export const Header = styled.div`
  flex-shrink: 0;
  h1 { font-size: 26px; font-weight: 800; color: #111; margin: 0; }
  p { font-size: 14px; color: #666; margin-top: 8px; }
`;

export const TopFixedArea = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 10px;
`;

// 1. 검색 드롭다운 영역
export const SearchSection = styled.div`
  position: relative; width: 100%; max-width: 500px;
`;

// [색상 수정] Focus #3478F6
export const SearchInput = styled.input`
  width: 100%; padding: 14px 16px; font-size: 15px; border: 1px solid #e5e7eb;
  border-radius: 10px; background-color: white;
  padding-right: 40px; /* 화살표 공간 */
  transition: all 0.2s;
  
  /* placeholder 색상 흐리게 */
  &::placeholder { color: #9ca3af; transition: color 0.2s; }

  &:focus { outline: none; border-color: #3478F6; box-shadow: 0 0 0 3px rgba(52, 120, 246, 0.1); }
`;

// [추가] 드롭다운 화살표 아이콘 (스타일만 추가)
export const ArrowIcon = styled.div`
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  color: #9ca3af; pointer-events: none;
  display: flex; align-items: center;
`;

export const DropdownList = styled.ul`
  position: absolute; top: 100%; left: 0; right: 0; margin-top: 8px;
  background: white; border: 1px solid #e5e7eb; border-radius: 10px;
  max-height: 300px; overflow-y: auto; z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
  list-style: none; padding: 4px 0;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; }
`;

// [색상 수정] Hover #EFF6FF
export const DropdownItem = styled.li`
  padding: 12px 16px; cursor: pointer; display: flex; flex-direction: column; gap: 2px;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
  &:hover { background-color: #EFF6FF; }
  
  .name { font-weight: 600; color: #111; font-size: 15px; }
  .meta { font-size: 12px; color: #888; }
  `;
  
  
  // 2. 명함 스타일 프로필
  
  export const ProfileCard = styled.div`
    background: white; border-radius: 16px; padding: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;
    display: flex; align-items: flex-start; gap: 30px;
  `;
  
  // [색상 수정] #EFF6FF, #3478F6
  export const ProfileImage = styled.div`
    width: 100px; height: 100px; border-radius: 50%; flex-shrink: 0;
    background-color: #EFF6FF; color: #3478F6;
    display: flex; justify-content: center; align-items: center;
    font-size: 36px; font-weight: 700;
    border: 4px solid #f5f3ff;
  `;
  
  export const ProfileInfo = styled.div`
    flex: 1; display: flex; flex-direction: column; gap: 10px;
  `;

export const NameTag = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    font-size: 26px;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.5px;
  }
`;

// [신규] 전공/소속을 감싸는 래퍼
export const MajorWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2px; /* 이름과의 간격 미세 조정 */
`;

// [신규] 전공 박스 (MajorBox) 스타일
export const MajorBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background-color: #EFF6FF; /* 연한 파랑 배경 */
  color: #3478F6; /* 비비드 파랑 텍스트 */
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #dbeafe; /* 테두리 살짝 */
  
  /* 아이콘 스타일 */
  svg { width: 16px; height: 16px; }
`;

// export const ContactInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
//   margin-top: 8px;
//   padding-top: 16px;
//   border-top: 1px solid #f3f4f6; /* 구분선 추가로 깔끔하게 */
  
//   div {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     font-size: 14px;
//     color: #6b7280;
//     font-weight: 400;
//   }
// `;

// 3. 포트폴리오 상세 (구조 변경)

// [유지] 카드 형태로 디자인 변경
export const PortfolioSection = styled.div`
  flex: 1;
  min-height: 0; /* Flex 자식 스크롤 필수 */
  background: white; 
  
  /* [유지] 전체 둥글게 */
  border-radius: 16px;
  
  /* [유지] 하단 여백 추가 (바닥에서 띄우기) */
  margin-bottom: 40px;
  
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb; /* 테두리 복구 */
  
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내부 스크롤이 둥근 모서리 침범 방지 */
`;

// 고정된 헤더 영역
export const PortfolioHeader = styled.div`
  flex-shrink: 0;
  padding: 30px 40px 20px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
`;

// 실제 스크롤되는 내용 영역
export const PortfolioScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px 40px 60px;

  &::-webkit-scrollbar { width: 10px; }
  &::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 5px; border: 2px solid #fff; }
  &::-webkit-scrollbar-track { background-color: transparent; }
`;

export const SectionTitle = styled.h3`
  font-size: 18px; font-weight: 700; color: #111; margin: 0;
`;

export const PortfolioContent = styled.div`
  font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 16px; 
  background: white; border-radius: 16px; border: 1px dashed #e5e7eb;
  margin-bottom: 40px; /* 하단 여백 */
`;