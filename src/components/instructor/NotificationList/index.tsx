"use client";

import React, { useEffect, useState } from "react";
import { getNotificationsAPI, markAsReadAPI } from "./api";
import * as S from "./styles";

// --- Types ---
type NotificationItem = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

type FilterType = "ALL" | "UNREAD" | "READ";

// 부모(Header)에게서 받을 함수 타입 정의
type Props = {
  // 현재 안 읽은 알림 개수를 부모에게 전달
  onUpdateBadge?: (unreadCount: number) => void;
};

// --- Icons ---
const BellIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
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

// [재발송] / [재전송] (옵션으로 괄호 내용 포함) 붙은 것도 원본문 기준으로 같게 보려는용
const normalizeMessage = (msg: string) => {
  if (!msg) return "";
  return msg
    .replace(/^\[재(발송|전송)\]\s*(\([^)]*\))?\s*/u, "") // [재발송] (~~) 제거
    .trim();
};

// --- Component ---
export default function NotificationList({ onUpdateBadge }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");

  // 최초 알림 목록 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getNotificationsAPI();
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        // 안 읽은 알림이 필터링에서 잘리지 않도록 넉넉하게 100개 저장
        setNotifications(sorted.slice(0, 100));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // notifications 상태가 바뀔 때마다 부모에게 unread 개수 전달
  useEffect(() => {
    if (!onUpdateBadge) return;
    const unread = notifications.filter((n) => !n.is_read).length;
    onUpdateBadge(unread);
  }, [notifications, onUpdateBadge]);

  // 중복된 알림 프론트엔드 일괄 처리
  const handleMarkAsRead = async (
    id: number,
    currentStatus: boolean,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    if (currentStatus) return; // 이미 읽은거면 패스

    // 1. 클릭한 알림의 메시지 찾기
    const targetNoti = notifications.find((n) => n.id === id);
    if (!targetNoti) return;

    // 2. 클릭한 알림의 "원본문" 기준 메시지
    const targetMsg = normalizeMessage(targetNoti.message);

    // 3. 원본문이 같고, 아직 안 읽은 알림들 찾기
    const sameNotifications = notifications.filter(
      (n) => normalizeMessage(n.message) === targetMsg && !n.is_read
    );

    // 4. UI 선반영 (원본문이 같은 알림 전부 읽음 처리)
    setNotifications((prev) =>
      prev.map((n) => {
        if (normalizeMessage(n.message) === targetMsg) {
          return { ...n, is_read: true };
        }
        return n;
      })
    );

    try {
      // 5. API 요청 병렬 처리
      const apiPromises = sameNotifications.map((n) =>
        markAsReadAPI(n.id)
      );
      await Promise.all(apiPromises);

      // 이제는 여기서 onUpdateBadge를 직접 호출할 필요 없음
      // notifications 상태가 바뀌면 위 useEffect에서 자동으로 부모에게 전달됨
    } catch (error) {
      console.error("일괄 읽음 처리 중 오류:", error);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;

    // UI 선반영
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    try {
      await Promise.all(unread.map((n) => markAsReadAPI(n.id)));
      // 마찬가지로, 상태 변경 → useEffect에서 unreadCount를 부모에 전달
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  // 필터링 로직
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.is_read;
    if (filter === "READ") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <S.Container onClick={(e) => e.stopPropagation()}>
      <S.Header>
        <S.TopRow>
          <S.TitleArea>
            <h2>알림</h2>
            <span>읽지 않은 알림 {unreadCount}개</span>
          </S.TitleArea>
          <S.MarkAllBtn onClick={handleMarkAllRead}>
            모두 읽음
          </S.MarkAllBtn>
        </S.TopRow>

        <S.FilterTabs>
          <S.TabBtn
            $active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          >
            전체
          </S.TabBtn>
          <S.TabBtn
            $active={filter === "UNREAD"}
            onClick={() => setFilter("UNREAD")}
          >
            안 읽음
          </S.TabBtn>
          <S.TabBtn
            $active={filter === "READ"}
            onClick={() => setFilter("READ")}
          >
            읽음
          </S.TabBtn>
        </S.FilterTabs>
      </S.Header>

      <S.List>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.slice(0, 20).map((noti) => (
            <S.NotificationCard
              key={noti.id}
              $isRead={noti.is_read}
              onClick={(e) =>
                handleMarkAsRead(noti.id, noti.is_read, e)
              }
            >
              <div className="top-row">
                <div
                  className="icon-box"
                  onClick={(e) =>
                    handleMarkAsRead(noti.id, noti.is_read, e)
                  }
                >
                  {noti.is_read ? <CheckIcon /> : <BellIcon />}
                </div>

                <div className="content-area">
                  <span className="badge">
                    {noti.is_read ? "읽음" : "New"}
                  </span>
                  <div className="message">{noti.message}</div>
                </div>
              </div>
              <div className="time">{timeAgo(noti.created_at)}</div>
            </S.NotificationCard>
          ))
        ) : (
          <S.EmptyState>
            {filter === "UNREAD"
              ? "새로운 알림이 없습니다."
              : "알림이 없습니다."}
          </S.EmptyState>
        )}
      </S.List>
    </S.Container>
  );
}
