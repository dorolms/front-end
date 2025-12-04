"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import NotificationList from "@/components/instructor/NotificationList";
import { getNotificationsAPI } from "@/components/instructor/NotificationList/api";

type HeaderProps = {
  isAuth: boolean;
  userName?: string;
  userRole?: "instructor" | "manager";
  onLogout?: () => void;
};

// ... (스타일 컴포넌트들: Bar, Inner, Left, Right, Badge, NotiWrapper, IconBtn, Logout, Name 등은 기존과 동일) ...
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
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"
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
  const [hasUnread, setHasUnread] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

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

  // [수정 1] 강사(instructor)일 때만 배지 상태 확인 API 호출
  useEffect(() => {
    if (isAuth && userRole === "instructor") {
      getNotificationsAPI()
        .then((data) => {
          const unreadExists = data.some((item: any) => !item.is_read);
          setHasUnread(unreadExists);
        })
        .catch((err) => console.error("Badge Check Fail:", err));
    }
  }, [isAuth, userRole]); // userRole 의존성 추가

  const toggleNoti = () => {
    setIsNotiOpen(!isNotiOpen);
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

            {/* [수정 2] userRole이 instructor일 때만 알림 영역 렌더링 */}
            {userRole === "instructor" && (
              <NotiWrapper ref={notiRef}>
                <IconBtn
                  aria-label="알림"
                  onClick={toggleNoti}
                >
                  <BellIcon />
                  {hasUnread && <Badge />}
                </IconBtn>

                {isNotiOpen && <NotificationList />}
              </NotiWrapper>
            )}

            <IconBtn aria-label="메시지">
              <MailIcon />
            </IconBtn>
            <Logout onClick={onLogout}>LOGOUT</Logout>
          </Right>
        ) : null}
      </Inner>
    </Bar>
  );
}