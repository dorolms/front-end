/**
 * _hooks/useNotices.ts
 * - 공지 목록을 검색어로 필터링하고, 현재 페이지에 맞게 잘라 반환하는 훅.
 * - 필터/페이지 계산을 useMemo로 최적화하여 불필요한 렌더링을 방지.
 * - API 연동 시 서버 사이드에서 필터링/페이지네이션을 수행하도록
 *   이 훅의 내부를 교체하거나, 훅을 제거하고 서버 데이터 패칭으로 대체 가능.
 */

import { useMemo } from 'react';
import type { Notice } from '../types';

type Opts = {
  query: string;
  page: number;
  pageSize: number;
};

export function useNotices(all: Notice[], { query, page, pageSize }: Opts) {
  // 1) 검색어로 필터링: title 기준 (필요하면 content/author 포함 확장)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((n) => n.title.toLowerCase().includes(q));
  }, [all, query]);

  // 2) 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // 현재 page가 totalPages를 넘어가면 보정
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return { filtered, pageItems, totalPages };
}
