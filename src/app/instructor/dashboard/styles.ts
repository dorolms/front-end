'use client';
import styled from 'styled-components';

export const Wrap = styled.div`
  width: 100%;
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

/**
 * 전체 레이아웃
 * 1줄: 캘린더
 * 2줄: 오른쪽 정렬된 '다음 강의' 카드
 * 둘 다 같은 폭(1064px)으로 가운데 정렬
 */
export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;    /* 캘린더/카드 전체를 가운데 정렬 */
`;

export const CalendarBox = styled.div`
  width: 1064px;
  height: 375px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 16px 24px 24px;
  box-sizing: border-box;
  overflow: hidden;
`;

/** 2번째 줄: 왼쪽 최신 공지 / 오른쪽 다음 강의 */
export const CardRow = styled.div`
  width: 1064px;
  display: flex;
  justify-content: space-between;  /* 왼쪽, 오른쪽으로 배치 */
  gap: 24px;
`;

/** 최신 공지 박스 (왼쪽) */
export const LatestNoticeBox = styled.div`
  flex: 0 0 500px; /* 대략적인 폭, 필요하면 수치 조절 */
  height: 220px;
`;

/** 다음 강의 카드 (오른쪽) */
export const CardBox = styled.div`
  flex: 0 0 530px;
  height: 342px;
`;
