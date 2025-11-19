// src/app/manager/dashboard/components/RecruitmentStatusWidget.tsx
'use client';

import styled from 'styled-components';
import type { RecruitmentItem } from '../types';

// --- Icons ---
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const InboxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
);

// --- Styled Components ---

const Widget = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #ffffff;
  /* 왼쪽 공지사항 위젯과 동일한 그림자 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  /* 상단 포인트 컬러 바 (통일감) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
`;

const Header = styled.div`
  padding: 20px 22px; /* 패딩 여유 있게 */
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.5px;

    svg { color: #3b82f6; }
  }
`;

const ListArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0 12px; /* 스크롤바와 내용 사이 간격 */

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const ListRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
  cursor: pointer;
  border-radius: 8px;
  margin: 4px 0;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 12px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0; /* 텍스트 말줄임 처리를 위해 필요 */

  .title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 500;
  }
`;

/* 뱃지 스타일 고도화 */
const StatusBadge = styled.div<{ $type: 'recruit' | 'check' }>`
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  justify-content: center;
  min-width: 70px; /* 너비 고정해서 깔끔하게 */
  padding: 6px 12px;
  border-radius: 10px;
  gap: 2px;

  /* 타입별 색상 테마 */
  ${(props) => (props.$type === 'recruit' ? `
    background: #eff6ff;
    color: #3b82f6;
    border: 1px solid #dbeafe;
  ` : `
    background: #ecfdf5;
    color: #10b981;
    border: 1px solid #d1fae5;
  `)}

  .label {
    font-size: 0.7rem;
    font-weight: 600;
    opacity: 0.8;
  }

  .value {
    font-size: 1rem;
    font-weight: 800;
    line-height: 1;
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 0.9rem;
  height: 100%;
`;

type Props = {
  items: RecruitmentItem[];
};

export default function RecruitmentStatusWidget({ items }: Props) {
  return (
    <Widget>
      <Header>
        <h3>
          <UsersIcon />
          강사 모집 및 배정
        </h3>
      </Header>
      <ListArea>
        {items.length === 0 ? (
          <EmptyState>
            <InboxIcon />
            <span>현재 진행 중인 모집 건이 없습니다.</span>
          </EmptyState>
        ) : (
          items.map((item) => (
            <ListRow key={item.id}>
              <Info>
                <div className="title" title={item.title}>{item.title}</div>
                <div className="meta">
                  <CalendarIcon />
                  {item.date} 진행
                </div>
              </Info>

              {item.status === 'RECRUITING' ? (
                // 모집 중 (파란색)
                <StatusBadge $type="recruit">
                  <span className="label">지원자</span>
                  <span className="value">{item.currentCount}명</span>
                </StatusBadge>
              ) : (
                // 배정/확인 중 (초록색)
                <StatusBadge $type="check">
                  <span className="label">배정완료</span>
                  <span className="value">{item.currentCount}/{item.targetCount}</span>
                </StatusBadge>
              )}
            </ListRow>
          ))
        )}
      </ListArea>
    </Widget>
  );
}