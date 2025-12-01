"use client";

import styled, { css } from "styled-components";

type StatusStyle = {
  bg: string;
  text: string;
  border?: string;
  label?: string; // 필요하면 뱃지 앞에 라벨 찍을 때 사용
};

type Props<S extends string> = {
  status: S;
  typeColor: string;
  getStatusStyle: (status: S) => StatusStyle;
  children: React.ReactNode;
  className?: string;
};

const Badge = styled.div<{
  $bg: string;
  $text: string;
  $border?: string;
  $typeColor: string;
}>`
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.25;
  white-space: pre-wrap;
  cursor: pointer;

  ${({ $bg, $text, $border }) => css`
    background: ${$bg};
    color: ${$text};
    border: 1px solid ${$border ?? "transparent"};
  `}

  /* 타입 컬러(강의 유형) 왼쪽 바 */
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 8px 0 0 8px;
    background: ${({ $typeColor }) => $typeColor};
  }
`;

export function StatusBadge<S extends string>({
  status,
  typeColor,
  getStatusStyle,
  children,
  className,
}: Props<S>) {
  const style = getStatusStyle(status);

  return (
    <Badge
      className={className}
      $bg={style.bg}
      $text={style.text}
      $border={style.border}
      $typeColor={typeColor}
      aria-label={style.label ?? status}
    >
      {children}
    </Badge>
  );
}
