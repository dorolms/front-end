// src/app/manager/dashboard/components/RecruitmentStatusWidget.tsx
'use client';

import styled from 'styled-components';
import type { RecruitmentItem } from '../types';

const Widget = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
  }
`;

const ListArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
`;

const ListRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title { font-size: 0.95rem; font-weight: 600; color: #111; }
  .date { font-size: 0.8rem; color: #888; }
`;

const StatusBadge = styled.div<{ $type: 'recruit' | 'check' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;

  color: ${(props) => (props.$type === 'recruit' ? '#2563EB' : '#059669')};
  background: ${(props) => (props.$type === 'recruit' ? '#EFF6FF' : '#ECFDF5')};
  padding: 6px 12px;
  border-radius: 20px;
`;

type Props = {
  items: RecruitmentItem[];
};

export default function RecruitmentStatusWidget({ items }: Props) {
  return (
    <Widget>
      <Header>
        <h3>강사 모집 및 배정 현황</h3>
      </Header>
      <ListArea>
        {items.map((item) => (
          <ListRow key={item.id}>
            <Info>
              <span className="title">{item.title}</span>
              <span className="date">{item.date} 진행</span>
            </Info>

            {item.status === 'RECRUITING' ? (
              <StatusBadge $type="recruit">
                <span>지원</span>
                <strong>{item.currentCount}명</strong>
              </StatusBadge>
            ) : (
              <StatusBadge $type="check">
                <span>확인</span>
                {/* 분모: 배정된 인원, 분자: 확인한 인원 */}
                <strong>{item.currentCount}/{item.targetCount}</strong>
              </StatusBadge>
            )}
          </ListRow>
        ))}
        {items.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            진행 중인 모집 건이 없습니다.
          </div>
        )}
      </ListArea>
    </Widget>
  );
}