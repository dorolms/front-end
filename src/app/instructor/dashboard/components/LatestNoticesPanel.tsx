// src/app/instructor/dashboard/components/LatestNoticesPanel.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import type { DashboardNotice } from '../types';
import type { Notice } from '../../notices/types';
import NoticeModal from '../../notices/components/NoticeModal';

// --- Icons ---
const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const BellIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const DotIcon = () => (
  <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// --- Styled Components ---

const Panel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f5;
  box-sizing: border-box;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;

  /* 상단 블루 그라데이션 바 */
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: #3b82f6;
    }
  }
`;

const MoreLink = styled(Link)`
  font-size: 0.85rem;
  color: #64748b;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #3b82f6;
    transform: translateX(2px);
  }
`;

const List = styled.ul`
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.9rem;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  flex-grow: 1;

  .bullet-icon {
    font-weight: 600;
    color: #94a3b8;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
  }

  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #334155;
    font-weight: 600;
    text-decoration: none;
    flex-grow: 1;

    &:hover {
      color: #3b82f6;
    }
  }
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

// --- Component ---

type Props = {
  notices: DashboardNotice[];
};

export default function LatestNoticesPanel({ notices }: Props) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const top6 = notices.slice(0, 5);

  // 날짜 포맷팅 함수 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <>
      <Panel>
        <Header>
          <h3>
            <BellIcon />
            최근 공지
          </h3>
          <MoreLink href="/instructor/notices">
            더보기
            <ArrowRightIcon />
          </MoreLink>
        </Header>

        <List>
          {top6.map((notice) => (
            <ItemRow key={notice.id}>
              <TitleArea>
                <span className="bullet-icon">
                  <DotIcon />
                </span>
                <Link
                  href={`/instructor/notices/${notice.id}`}
                  className="text"
                  title={notice.title}
                  // 페이지 이동 막고, 대시보드에서 바로 모달만 띄우기
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedNotice(notice as unknown as Notice);
                  }}
                >
                  {notice.title}
                </Link>
              </TitleArea>
              <DateText>{formatDate(notice.createdAt)}</DateText>
            </ItemRow>
          ))}

          {top6.length === 0 && (
            <EmptyState>등록된 공지사항이 없습니다.</EmptyState>
          )}
        </List>
      </Panel>

      {selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </>
  );
}
