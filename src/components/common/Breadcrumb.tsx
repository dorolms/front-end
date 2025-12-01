// src/components/common/Breadcrumb.tsx
"use client";

import Link from "next/link";
import styled from "styled-components";

type Crumb = {
  label: string; // 화면에 보일 이름 (홈, 공지사항 등)
  href?: string; // 클릭해서 이동할 링크 (마지막 항목은 보통 없음)
};

type Props = {
  items: Crumb[];
};

const Wrapper = styled.nav`
  width: 100%;
  padding: 10px 16px;
  background: #f9fbff; /* 살짝 옅은 배경 */
  font-size: 13px;
  color: #555;
  margin-bottom: 16px;
`;

const List = styled.ul`
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CrumbLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Current = styled.span`
  font-weight: 600;
  color: #222;
`;

const Separator = styled.span`
  color: #999;
`;

export function Breadcrumb({ items }: Props) {
  const lastIndex = items.length - 1;

  return (
    <Wrapper aria-label="현재 위치">
      <List>
        {items.map((item, index) => {
          const isLast = index === lastIndex;

          return (
            <li key={index}>
              {isLast || !item.href ? (
                <Current>{item.label}</Current>
              ) : (
                <CrumbLink href={item.href}>{item.label}</CrumbLink>
              )}

              {!isLast && <Separator> &gt; </Separator>}
            </li>
          );
        })}
      </List>
    </Wrapper>
  );
}
