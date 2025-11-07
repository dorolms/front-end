"use client";

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

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 추가
    router.replace("/"); // 로그인 페이지로 이동
  };

  return (
    <Shell>
      {/* 상단 헤더 */}
      <Header
        isAuth={true}
        userName="김지수"
        userRole="manager"
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
