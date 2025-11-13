// src/app/instructor/dashboard/components/LatestNoticesPanel.tsx
'use client';

import styled from 'styled-components';
import type { DashboardNotice } from '../data/latestNotices';
import { truncateText } from '../utils/truncate';

/**
 * 캘린더 아래 왼쪽에 들어갈 "최신 공지" 패널
 * - 제목 + 상위 5개 공지 제목만 노출
 * - 제목이 길면 ... 으로 줄임 (text-overflow: ellipsis)
 */

const Panel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  span {
    font-size: 0.75rem;
    color: #9ca3af;
  }
`;

const List = styled.ol`
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
`;

const Index = styled.span`
  width: 18px;
  text-align: right;
  font-weight: 600;
  color: #6b7280;
`;

const Title = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  color: #111827;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

type Props = {
  notices: DashboardNotice[];
};

export default function LatestNoticesPanel({ notices }: Props) {
  return (
    <Panel>
      <Header>
        <h3>🔔 최신 공지</h3>
        <span>최근 5개</span>
      </Header>

      <List>
        {notices.slice(0, 5).map((notice, idx) => (
          <ItemRow key={notice.id}>
            <Index>{idx + 1}</Index>
            <Title title={notice.title}>{truncateText(notice.title, 35)}</Title>
          </ItemRow>
        ))}
      </List>
    </Panel>
  );
}
