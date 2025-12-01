// src/components/lecture/LectureDetailModal.styles.ts
"use client";

import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

export const Dialog = styled.div`
  width: 520px;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

export const Body = styled.div`
  font-size: 14px;
  line-height: 1.6;
`;

export const Row = styled.div`
  display: flex;
  margin-bottom: 4px;
  gap: 8px;
`;

export const Label = styled.span`
  width: 72px;
  font-weight: 600;
  color: #555;
`;

export const Value = styled.span`
  flex: 1;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

export const Button = styled.button<{
  $variant?: "primary" | "ghost" | "danger" | "disabled";
}>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  cursor: pointer;

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background: #2563eb;
          color: #ffffff;
        `;
      case "danger":
        return `
          background: #ef4444;
          color: #ffffff;
        `;
      case "disabled":
        return `
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        `;
      case "ghost":
      default:
        return `
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        `;
    }
  }}
`;
