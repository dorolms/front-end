"use client";

import Link from "next/link";
import styled from "styled-components";

type HeaderProps = {
  isAuth: boolean; // 로그인 여부
  userName?: string; // 우측에 표시할 이름
  userRole?: "instructor" | "manager";
  onLogout?: () => void; // 로그아웃 핸들러(선택)
};

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

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
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
  const roleLabel =
    userRole === "instructor"
      ? "강사님"
      : userRole === "manager"
      ? "매니저님"
      : "";

  return (
    <Bar>
      <Inner>
        {/* 좌측: 로고 */}
        <Left>
          <Link href="/">
            <img src="/logo.svg" alt="DORO" width={153} height={45} />
          </Link>
        </Left>

        {/* 우측: 로그인했을 때만 표시 */}
        {isAuth ? (
          <Right>
            <Name>
              {userName} {roleLabel}{" "}
            </Name>
            <IconBtn aria-label="알림">
              <BellIcon />
            </IconBtn>
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
