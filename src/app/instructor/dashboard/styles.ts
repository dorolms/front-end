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
  align-items: center;    /* 자식들을 중앙 정렬해서 폭을 맞춘다 */
`;

/** 캘린더 박스 – 피그마 기준 width */
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

/** 두 번째 줄: 카드 줄, 캘린더와 같은 폭으로 맞춤 */
export const CardRow = styled.div`
  width: 1064px;
  display: flex;
  justify-content: flex-end;  /* 폭 안에서 오른쪽 끝에 카드 붙이기 */
`;

/** 다음 강의 카드 – 피그마 사이즈 */
export const CardBox = styled.div`
  width: 571px;
  height: 342px;
`;
