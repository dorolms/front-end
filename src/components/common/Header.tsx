"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import styled from "styled-components";
import NotificationList from "@/components/instructor/NotificationList";
import { getNotificationsAPI } from "@/components/instructor/NotificationList/api";
import ManagerNotificationList from "@/components/manager/NotificationList";

type HeaderProps = {
  isAuth: boolean;
  userName?: string;
  userRole?: "instructor" | "manager";
  onLogout?: () => void;
};

// --- Styled Components ---
const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  border: 1px solid #ccc;
`;

const Inner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  padding: 0 32px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #2f4f75;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 1px solid #fff;
  z-index: 10;
`;

const NotiWrapper = styled.div`
  position: relative;
`;

const IconBtn = styled.button`
  position: relative;
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;

  &:active {
    background: #f5f5f5;
  }
`;

const Logout = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: #eee;
  cursor: pointer;
  font-weight: 600;
`;

const Name = styled.span`
  font-weight: 700;
  margin-right: 4px;
`;

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}



export default function Header({
  isAuth,
  userName,
  userRole,
  onLogout,
}: HeaderProps) {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // ⬅ 안 읽은 개수
  const notiRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 알림창 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * 페이지 최초 로드 시, 강사의 현재 안 읽은 알림 개수 조회
   * (NotificationList 열기 전에도 배지 표시되도록)
   */
  const checkBadgeStatus = useCallback(() => {
    if (isAuth && userRole === "instructor") {
      getNotificationsAPI()
        .then((data) => {
          const unread = data.filter((item: any) => !item.is_read).length;
          setUnreadCount(unread);
        })
        .catch((err) => console.error("Badge Check Fail:", err));
    }
  }, [isAuth, userRole]);

  useEffect(() => {
    checkBadgeStatus();
  }, [checkBadgeStatus]);

  const toggleNoti = () => {
    setIsNotiOpen((prev) => !prev);
  };

  const roleLabel =
    userRole === "instructor"
      ? "강사님"
      : userRole === "manager"
      ? "매니저님"
      : "";

  return (
    <Bar>
      <Inner>
        <Left>
          <Link href="/">
            <img src="/logo.svg" alt="DORO" width={153} height={45} />
          </Link>
        </Left>

        {isAuth ? (
          <Right>
            <Name>
              {userName} {roleLabel}{" "}
            </Name>

            {/* 강사 또는 매니저일 때 알림 영역 표시 */}
            {(userRole === "instructor" || userRole === "manager") && (
              <NotiWrapper ref={notiRef}>
                <IconBtn aria-label="알림" onClick={toggleNoti}>
                  <BellIcon />
                  {/* 강사용 배지: unreadCount가 1개 이상일 때 표시 */}
                  {userRole === "instructor" && unreadCount > 0 && <Badge />}
                </IconBtn>

                {isNotiOpen && (
                  <>
                    {userRole === "instructor" ? (
                      // ⬇ NotificationList 에서 상태가 바뀔 때마다 unreadCount를 올려줌
                      <NotificationList onUpdateBadge={setUnreadCount} />
                    ) : (
                      <ManagerNotificationList />
                    )}
                  </>
                )}
              </NotiWrapper>
            )}
            <Logout onClick={onLogout}>LOGOUT</Logout>
          </Right>
        ) : null}
      </Inner>
    </Bar>
  );
}
