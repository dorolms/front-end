"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import ManagerSidebar from "@/components/manager/ManagerSidebar";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<"instructor" | "manager" | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedName = window.localStorage.getItem("userName");
    const storedRole = window.localStorage.getItem("userRole") as
      | "instructor"
      | "manager"
      | null;

    if (storedName) {
      setUserName(storedName);
    }
    if (storedRole === "instructor" || storedRole === "manager") {
      setUserRole(storedRole);
    } else {
      // 매니저 영역이니까 기본값을 manager로
      setUserRole("manager");
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("userName");
      window.localStorage.removeItem("userRole");
    }
    router.replace("/"); // 로그인 페이지로 이동
  };

  return (
    <Shell>
      {/* 상단 헤더 */}
      <Header
        isAuth={!!userName}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* 본문 (좌: 사이드바 / 우: 콘텐츠) */}
      <Body>
        <ManagerSidebar />
        <Main>{children}</Main>
      </Body>
    </Shell>
  );
}

/* styled-components */
const Shell = styled.div`
  min-height: 100dvh;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  flex: 1 1 auto;
`;

const Main = styled.main`
  min-height: calc(100dvh - 56px);
  padding: 20px;
`;
