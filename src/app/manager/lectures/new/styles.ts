'use client';

import styled from 'styled-components';

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