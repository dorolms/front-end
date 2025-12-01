// src/app/instructor/notices/components/Pagination.tsx
'use client';

import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$active ? '#3b82f6' : '#e2e8f0')};
  background: ${(props) => (props.$active ? '#3b82f6' : '#ffffff')};
  color: ${(props) => (props.$active ? '#ffffff' : '#64748b')};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? '#2563eb' : '#f1f5f9')};
    color: ${(props) => (props.$active ? '#ffffff' : '#1e293b')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
    background: #f8fafc;
  }
`;

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  const go = (p: number) => onPageChange(Math.min(Math.max(p, 1), totalPages));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <Wrap>
      <PageButton onClick={() => go(1)} disabled={page === 1}>&laquo;</PageButton>
      <PageButton onClick={() => go(page - 1)} disabled={page === 1}>&lsaquo;</PageButton>

      {pages.map((p) => (
        <PageButton
          key={p}
          $active={p === page}
          onClick={() => go(p)}
        >
          {p}
        </PageButton>
      ))}

      <PageButton onClick={() => go(page + 1)} disabled={page === totalPages}>&rsaquo;</PageButton>
      <PageButton onClick={() => go(totalPages)} disabled={page === totalPages}>&raquo;</PageButton>
    </Wrap>
  );
}