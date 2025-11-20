'use client';

import styled from 'styled-components';

// --- 1. Styled Components (설정 페이지 레이아웃) ---

export const PageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 80px); /* 상단 네비바 높이(80px 가정) 제외 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 페이지 전체 스크롤 방지 */
  background-color: #ffffff;
`;

export const Header = styled.div`
  flex-shrink: 0;
  padding: 30px 40px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #111;
  margin: 0;
`;

// [유지] BackButton 정의 (BackLink 아님)
export const BackButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
    color: #333;
  }
`;

// [핵심] 스크롤되는 메인 폼 영역
export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 40px;
`;

// [수정] 폼 레이아웃 (중앙 정렬 제거, 꽉 채우기)
export const FormLayout = styled.form`
  /* max-width: 1000px; // 제거 */
  /* margin: 0 auto; // 제거 */
  
  /* 하단 스크롤 여유 공간 */
  padding-bottom: 60px; 
`;

// [핵심] 좌우 분리 Row
// [수정] 좌우 분리 Row
// [수정] 좌우 분리 Row
export const FormRow = styled.div`
  display: grid;
  /* [수정] 좌측 라벨 너비를 220px에서 180px로 줄여 더 넓은 입력창 확보 */
  grid-template-columns: 180px 1fr; 
  align-items: stretch;
  border-bottom: 1px solid #e5e7eb;

  &:first-of-type {
    border-top: 1px solid #e5e7eb;
  }
`;

// [핵심] 좌측 라벨
// [수정] 좌측 라벨
export const FormLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #374151;
  
  /* 1. 요청하신 배경색 추가 */
  background-color: #f9fafb; 
  /* 2. 내부 여백 추가 */
  padding: 24px;
  /* 3. 우측 구분선 추가 */
  border-right: 1px solid #e5e7eb;

  span.required { color: #e11d48; margin-left: 2px; }
  p { font-size: 13px; color: #6b7280; font-weight: 400; margin-top: 6px; }
`;

// [핵심] 우측 입력창 영역
// [수정] 우측 입력창 영역
export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  
  /* 1. 라벨과 동일한 패딩 적용 */
  padding: 24px;
`;

// 입력 필드 (스타일 정리)
// [색상 변경] Focus #3478F6
export const Input = styled.input`
  padding: 12px 14px; font-size: 15px; border: 1px solid #d1d5db; border-radius: 8px;
  width: 100%; transition: all 0.2s;
  &:focus { outline: none; border-color: #3478F6; box-shadow: 0 0 0 3px rgba(52, 120, 246, 0.1); }
`;

// [색상 변경] Focus #3478F6
export const TextArea = styled.textarea`
  padding: 12px 14px; font-size: 15px; border: 1px solid #d1d5db; border-radius: 8px;
  min-height: 200px; resize: vertical; line-height: 1.6; font-family: inherit;
  &:focus { outline: none; border-color: #3478F6; box-shadow: 0 0 0 3px rgba(52, 120, 246, 0.1); }
`;

// [색상 변경] Focus #3478F6
export const Select = styled.select`
  padding: 12px 14px; font-size: 15px; border: 1px solid #d1d5db; border-radius: 8px;
  background-color: #fff; width: 100%;
  &:focus { outline: none; border-color: #3478F6; }
`;

export const Row = styled.div`
  display: flex; gap: 12px; align-items: center;
  > div { flex: 1; } 
  > span { color: #9ca3af; margin: 0 4px; }
`;

export const InputWrapper = styled.div`
  position: relative; display: flex; align-items: center; width: 100%;
  .unit { position: absolute; right: 12px; color: #6b7280; font-size: 13px; }
  input[data-has-unit="true"] { padding-right: 40px; }
`;

// [색상 변경] #3478F6, #EFF6FF
export const FileLabel = styled.label`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 16px; background-color: #f9fafb; border: 2px dashed #d1d5db;
  border-radius: 8px; cursor: pointer; color: #6b7280; font-size: 13px; transition: all 0.2s;
  &:hover { border-color: #3478F6; color: #3478F6; background-color: #EFF6FF; }
  .icon { font-size: 20px; }
`;

export const SearchButton = styled.button`
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  padding: 8px 12px; font-size: 13px; font-weight: 600; color: #374151;
  background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px;
  cursor: pointer; transition: all 0.2s;
  &:hover { background-color: #e5e7eb; }
`;

export const SearchResultList = styled.ul`
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background: white; border: 1px solid #e5e7eb; border-radius: 8px;
  max-height: 220px; overflow-y: auto; z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  list-style: none; padding: 4px 0; margin: 0;
`;

// [색상 변경] Hover: #EFF6FF, #3478F6
export const SearchResultItem = styled.li`
  padding: 12px 16px; cursor: pointer; font-size: 14px;
  color: #374151; transition: all 0.1s; border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
  &:hover { background-color: #EFF6FF; color: #3478F6; }
  .email { color: #9ca3af; font-size: 13px; margin-left: 6px; font-weight: 400; }
`;

// 하단 고정 버튼바
export const FixedBottomBar = styled.div`
  flex-shrink: 0;
  background: white; padding: 16px 40px; border-top: 1px solid #e5e7eb;
  display: flex; justify-content: flex-end; gap: 12px;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.03); z-index: 100;
`;

// [색상 변경] Primary: #3478F6, Hover: #2563EB
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 32px; font-size: 15px; font-weight: 700; border-radius: 8px; cursor: pointer;
  ${({ $variant }) => $variant === 'primary' ? `
    background-color: #3478F6; color: white; border: none;
    &:hover { background-color: #2563EB; }
  ` : `
    background-color: white; color: #374151; border: 1px solid #d1d5db;
    &:hover { background-color: #f9fafb; }
  `}
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;