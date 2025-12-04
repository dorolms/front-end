// src/app/instructor/dashboard/styles.ts
'use client';

import styled from 'styled-components';

export const Wrap = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const BreadCrumb = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 8px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 8px 0 24px;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 상단 캘린더 영역
export const CalendarBox = styled.div`
  width: 100%;
  height: 100%; /* 캘린더 높이 */
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 16px 24px;
  box-sizing: border-box;
`;

// 하단 2개 카드 영역
export const CardRow = styled.div`
  display: flex;
  gap: 24px;
  height: 320px;
`;

export const LeftPanel = styled.div`
  flex: 1;
`;

export const RightPanel = styled.div`
  flex: 1;
`;
