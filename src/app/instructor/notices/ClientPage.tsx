'use client';

import { useState, useEffect } from 'react';
import * as API from './api'; // API 파일 import
import { useNotices } from './hooks/useNotices';
import { Container, Header, Title } from './styles';
import SearchBar from './components/SearchBar';
import NoticeTable from './components/NoticeTable';
import Pagination from './components/Pagination';
import NoticeModal from './components/NoticeModal';
import type { Notice } from './types';

export default function ClientPage() {
  // 초기값은 빈 배열
  const [notices, setNotices] = useState<Notice[]>([]);

  // UI 상태
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Notice | null>(null);

  // [API 연동] 페이지 로드 시 데이터 불러오기
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await API.fetchNotices();
    setNotices(data);
  };

  // 필터링 훅 (검색/페이징)
  const { pageItems, totalPages } = useNotices(notices, {
    query,
    page,
    pageSize: 10,
  });

  return (
    <>
      <Container>
        <Header>
          <Title>공지사항</Title>
          {/* 검색창만 표시 */}
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={() => setPage(1)}
          />
        </Header>

        <NoticeTable rows={pageItems} onClickTitle={setSelected} />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>

      {/* 상세 보기 모달 */}
      {selected && (
        <NoticeModal
          notice={selected}
          onClose={() => setSelected(null)}
          // NoticeModal 내부에서 처리되어 있어야 함
        />
      )}
    </>
  );
}