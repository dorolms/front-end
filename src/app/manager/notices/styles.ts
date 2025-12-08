'use client';
/**
 * styles.ts
 * - /manager/notices 페이지의 공용 레이아웃 스타일 (styled-components).
 * - Header, Title, Container 및 '+ 새 공지' 버튼 스타일을 정의.
 */

import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 8px 0 24px;
`;

// '+ 새 공지' 버튼 스타일
export const NewNoticeButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '+';
    font-size: 1.25rem;
  }
  &:hover {
    background-color: #eee;
  }
`;