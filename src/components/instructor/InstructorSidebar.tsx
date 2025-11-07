// src/components/instructor/InstructorSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import type { ReactNode } from "react";

type Item = {
  href: string;
  label: string;
  icon: ReactNode;
  match?: (p: string) => boolean;
};

const items: Item[] = [
  {
    href: "/instructor/dashboard",
    label: "홈",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
      </svg>
    ),
  },
  {
    href: "/instructor/notices",
    label: "공지사항",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1z"
        />
      </svg>
    ),
  },
  {
    href: "/instructor/calendar",
    label: "나의 강의 캘린더",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 14H5V10h14z"
        />
      </svg>
    ),
  },
  {
    href: "/instructor/lectures",
    label: "강의 신청 캘린더",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 3H5a2 2 0 0 0-2 2v3h18V5a2 2 0 0 0-2-2M3 21h18V10H3z"
        />
      </svg>
    ),
  },
  {
    href: "/instructor/messages",
    label: "메시지",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
        />
      </svg>
    ),
  },
];

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <Aside>
      <Nav>
        {items.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <ItemLink key={href} href={href} $active={active}>
              <IconWrap>{icon}</IconWrap>
              <span>{label}</span>
            </ItemLink>
          );
        })}
      </Nav>
    </Aside>
  );
}

/* styled-components */
const Aside = styled.aside`
  width: 260px;
  background: #3a3a3a;
  color: #fff;
  padding: 12px;
  border-right: 1px solid #2d2d2d;
  position: sticky;
  top: 56px; /* 헤더 아래로 */
  height: calc(100dvh - 56px);
  z-index: 10;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#4a4a4a" : "#444")};
  border: 1px solid ${({ $active }) => ($active ? "#5a5a5a" : "#393939")};
  color: #eaeaea;
  text-decoration: none;
  transition: 0.15s background, 0.15s border;

  &:hover {
    background: #4c4c4c;
    border-color: #5a5a5a;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const IconWrap = styled.div`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: #d6d6d6;
`;
