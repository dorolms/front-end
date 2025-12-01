'use client';
/**
 * ClientPage.tsx (Client Component)
 * - 이 페이지의 "컨테이너" 역할.
 * - 상태(검색어, 페이지, 선택된 공지)와 로직(필터/페이지네이션 훅 사용)을 관리.
 * - 프리젠테이션 컴포넌트(SearchBar/NoticeTable/Pagination/NoticeModal)를 조립.
 * - 추후 API 연동 시, mockNotices → 서버 데이터로 교체만 하면 됨.
 */

import { useState } from 'react';
import { mockNotices } from './data/mock';
import { useNotices } from './hooks/useNotices';
import { Container, Header, Title } from './styles';
import SearchBar from './components/SearchBar';
import NoticeTable from './components/NoticeTable';
import Pagination from './components/Pagination';
import NoticeModal from './components/NoticeModal';
import type { Notice } from './types';

export default function ClientPage() {
  // 검색어 상태 (입력 변경 시 업데이트)
  const [query, setQuery] = useState('');
  // 페이지 상태 (페이지 클릭 시 변경)
  const [page, setPage] = useState(1);
  // 선택된 공지(모달 오픈/클로즈 제어)
  const [selected, setSelected] = useState<Notice | null>(null);

  // 공지 필터링 및 페이지네이션 로직: 별도 훅으로 분리
  const { pageItems, totalPages } = useNotices(mockNotices, {
    query,
    page,
    pageSize: 10, // 한 페이지에 10개
  });

  return (
    <>
      <Container>
        {/* 상단 헤더: 타이틀 + 검색바 */}
        <Header>
          <Title>공지사항</Title>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={() => setPage(1)} // 검색 실행 시 1페이지로 이동
          />
        </Header>

        {/* 공지 목록 테이블: 제목 클릭 시 모달 오픈 */}
        <NoticeTable rows={pageItems} onClickTitle={setSelected} />

        {/* 페이지네이션: 현재 페이지/총 페이지 전달 */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>

      {/* 상세 모달: 선택된 공지가 있을 때만 표시 */}
      {selected && (
        <NoticeModal
          notice={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
