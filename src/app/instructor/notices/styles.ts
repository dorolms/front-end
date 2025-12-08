'use client';
/**
 * _styles.ts
 * - 공지 페이지 레이아웃의 공용 스타일 정의.
 * - 각 컴포넌트 내부 스타일은 해당 파일에서 관리하고,
 *   페이지 단위에서 공유하는 레이아웃 정도만 이 파일에 둠.
 * - styled-components 기반 (팀 기준에 따라 Tailwind로 대체 가능).
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
