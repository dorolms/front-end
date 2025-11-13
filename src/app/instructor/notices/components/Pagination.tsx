'use client';
/**
 * Pagination.tsx
 * - 간단한 좌/우/처음/끝 이동 및 현재 페이지 하이라이트.
 * - 페이지 버튼은 총 페이지 수가 많을 경우 슬라이싱/스크롤 가능한 UI로 확장 가능.
 * - 접근성: 버튼에 aria-label 부여 가능.
 */

import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;

  button {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  button.active {
    background: #333;
    color: #fff;
    border-color: #333;
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  // 페이지 이동 시 안전 범위로 보정
  const go = (p: number) => onPageChange(Math.min(Math.max(p, 1), totalPages));

  // 단순 1~N 노출(최대 5개로 제한); 필요 시 현재 중심으로 동적 슬라이싱 확장 가능
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <Wrap>
      <button onClick={() => go(1)} disabled={page === 1} aria-label="첫 페이지">
        &laquo;
      </button>
      <button onClick={() => go(page - 1)} disabled={page === 1} aria-label="이전 페이지">
        &lsaquo;
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => go(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="다음 페이지"
      >
        &rsaquo;
      </button>
      <button
        onClick={() => go(totalPages)}
        disabled={page === totalPages}
        aria-label="마지막 페이지"
      >
        &raquo;
      </button>
    </Wrap>
  );
}
