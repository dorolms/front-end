'use client';
/**
 * Pagination.tsx
 * - 페이지 번호를 리스트하고, 페이지 이동(onPageChange)을 처리하는 컴포넌트.
 * - 첫/이전/다음/끝 버튼 로직 포함.
 */

import styled from 'styled-components';

// (styled-components 코드는 instructor와 동일)
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
  /** 현재 페이지 번호 */
  page: number;
  /** 총 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 호출될 콜백 함수 */
  onPageChange: (p: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  // 페이지 이동 (1 ~ totalPages 범위 보정)
  const go = (p: number) => onPageChange(Math.min(Math.max(p, 1), totalPages));

  // 표시할 페이지 번호 배열 (예: [1, 2, 3, 4, 5])
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5); // (간단한 5개)

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
        >
          {p}
        </button>
      ))}

      <button onClick={() => go(page + 1)} disabled={page === totalPages} aria-label="다음 페이지">
        &rsaquo;
      </button>
      <button onClick={() => go(totalPages)} disabled={page === totalPages} aria-label="마지막 페이지">
        &raquo;
      </button>
    </Wrap>
  );
}