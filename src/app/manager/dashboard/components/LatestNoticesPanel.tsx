// src/app/manager/dashboard/components/LatestNoticesPanel.tsx
'use client';

import Link from 'next/link'; // [1] Link 임포트
import styled from 'styled-components';
import type { DashboardNotice } from '../types';

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
    color: #1f2937;
  }
`;

// [2] 더보기 버튼 스타일링 (Link 컴포넌트 확장)
const MoreLink = styled(Link)`
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #4b5563; /* 호버 시 약간 진하게 */
    text-decoration: underline;
  }
`;

const List = styled.ol`
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.95rem;
  padding: 6px 0;
  border-bottom: 1px solid #f9f9f9;

  &:last-child { border-bottom: none; }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;

  .index {
    font-weight: 600;
    color: #6b7280;
    min-width: 14px;
  }
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #374151;
    cursor: pointer;
  }
  .text:hover {
    text-decoration: underline;
  }
`;

const DateText = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
  white-space: nowrap;
`;

type Props = {
  notices: DashboardNotice[];
};

export default function LatestNoticesPanel({ notices }: Props) {
  const top5 = notices.slice(0, 6);

  return (
    <Panel>
      <Header>
        <h3>최근 공지</h3>
        {/* [3] 클릭 시 /manager/notices로 이동 */}
        <MoreLink href="/manager/notices">더보기 &gt;</MoreLink>
      </Header>
      <List>
        {top5.map((notice, idx) => (
          <ItemRow key={notice.id}>
            <TitleArea>
              <span className="index">{idx + 1}.</span>
              {/* 개별 공지 클릭 시 상세 페이지로 이동하고 싶다면 여기에도 Link를 걸 수 있습니다 */}
              <Link
                href={`/manager/notices/${notice.id}`}
                className="text"
                title={notice.title}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {notice.title}
              </Link>
            </TitleArea>
            <DateText>{notice.createdAt}</DateText>
          </ItemRow>
        ))}
      </List>
    </Panel>
  );
}