"use client";

import { useEffect, useState } from "react";
import { getNotificationsAPI, markAsReadAPI } from "./api";
import * as S from "./styles"; // 스타일 파일 불러오기

// --- Types ---
type NotificationItem = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

type FilterType = 'ALL' | 'UNREAD' | 'READ';

// --- Icons ---
const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// --- Helper Functions ---
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// --- Component ---
export default function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getNotificationsAPI();
        const sorted = data.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setNotifications(sorted.slice(0, 100));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMarkAsRead = async (id: number, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentStatus) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await markAsReadAPI(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await Promise.all(unread.map((n) => markAsReadAPI(n.id)));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  // 필터링 로직
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.is_read;
    if (filter === 'READ') return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <S.Container onClick={(e) => e.stopPropagation()}>
      <S.Header>
        {/* 상단: 타이틀 + 모두읽음 버튼 */}
        <S.TopRow>
          <S.TitleArea>
            <h2>알림</h2>
            <span>읽지 않은 알림 {unreadCount}개</span>
          </S.TitleArea>
          <S.MarkAllBtn onClick={handleMarkAllRead}>모두 읽음</S.MarkAllBtn>
        </S.TopRow>

        {/* 하단: 필터 탭 */}
        <S.FilterTabs>
          <S.TabBtn
            $active={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
          >
            전체
          </S.TabBtn>
          <S.TabBtn
            $active={filter === 'UNREAD'}
            onClick={() => setFilter('UNREAD')}
          >
            안 읽음
          </S.TabBtn>
          <S.TabBtn
            $active={filter === 'READ'}
            onClick={() => setFilter('READ')}
          >
            읽음
          </S.TabBtn>
        </S.FilterTabs>
      </S.Header>

      <S.List>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.slice(0,20).map((noti) => (
            <S.NotificationCard
              key={noti.id}
              $isRead={noti.is_read}
              onClick={(e) => handleMarkAsRead(noti.id, noti.is_read, e)}
            >
              <div className="top-row">
                <div className="icon-box">
                  {noti.is_read ? <CheckIcon /> : <BellIcon />}
                </div>
                <div className="content-area">
                  <span className="badge">
                    {noti.is_read ? '읽음' : 'New'}
                  </span>
                  <div className="message">{noti.message}</div>
                </div>
              </div>
              <div className="time">{timeAgo(noti.created_at)}</div>
            </S.NotificationCard>
          ))
        ) : (
          <S.EmptyState>
            {filter === 'UNREAD' ? "새로운 알림이 없습니다." : "알림이 없습니다."}
          </S.EmptyState>
        )}
      </S.List>
    </S.Container>
  );
}