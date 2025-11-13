'use client';
/**
 * ClientPage.tsx (Client Component)
 * - /manager/notices 페이지의 실제 UI와 상호작용을 담당하는 "컨테이너" 컴포넌트.
 * - 모든 상태(데이터, 검색어, 모달)와 로직(CRUD 핸들러)을 이 파일에서 통합 관리.
 * - 하위 UI 컴포넌트(Table, Pagination, Modals)를 조립하고 props를 전달.
 */

import { useState } from 'react';
import { mockNotices } from './data/mock';
import { useNotices } from './hooks/useNotices';
import { Container, Header, Title, NewNoticeButton } from './styles';
import SearchBar from './components/SearchBar';
import NoticeTable from './components/NoticeTable';
import Pagination from './components/Pagination';
import NoticeModal from './components/NoticeModal';
import NoticeFormModal, { NoticePayload } from './components/NoticeFormModal';
import SuccessModal from './components/SuccessModal';
import type { Notice } from './types';

export default function ClientPage() {
  // 1. 데이터 상태: 공지사항 원본 목록 (현재 mock, 추후 API 연동)
  const [notices, setNotices] = useState(mockNotices);

  // 2. UI 제어 상태
  const [query, setQuery] = useState(''); // 검색어
  const [page, setPage] = useState(1); // 현재 페이지

  // 3. 모달 제어 상태
  const [selected, setSelected] = useState<Notice | null>(null); // 상세 모달 (선택된 공지)
  const [isFormOpen, setFormOpen] = useState(false); // 폼 모달 (열림/닫힘)
  const [editing, setEditing] = useState<Notice | null>(null); // 폼 모드 (null: 생성, Notice: 수정)
  const [successMsg, setSuccessMsg] = useState(''); // 성공 모달 (메시지)

  // 4. 데이터 로직 (필터링/페이지네이션)
  const { pageItems, totalPages } = useNotices(notices, {
    query,
    page,
    pageSize: 10,
  });

  // --- 이벤트 핸들러 ---

  /** '+ 새 공지' 버튼 클릭: '생성' 모드로 폼 모달 열기 */
  const handleOpenNewForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  /** 상세 모달 내 '수정' 버튼 클릭: '수정' 모드로 폼 모달 열기 */
  const handleStartEdit = () => {
    setEditing(selected); // 현재 선택된 공지를 수정 대상으로
    setSelected(null); // 상세 모달 닫기
    setFormOpen(true); // 폼 모달 열기
  };

  /** 폼 모달 '등록'/'수정' 버튼 클릭: 데이터 C/U 로직 수행 */
  const handleSubmit = (payload: NoticePayload) => {
    if (editing) {
      // 수정 로직
      setNotices(
        notices.map((n) => (n.id === editing.id ? { ...n, ...payload } : n)),
      );
      setSuccessMsg('공지가 수정되었습니다.');
    } else {
      // 생성 로직 (mock 데이터 기준)
      const newNotice: Notice = {
        id: Date.now(),
        author: '매니저',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ...payload,
      };
      setNotices([newNotice, ...notices]);
      setSuccessMsg('새 공지가 등록되었습니다.');
    }
    setFormOpen(false); // 폼 모달 닫기
  };

  return (
    <>
      <Container>
        <Header>
          <Title>공지사항</Title>
          {/* 검색바 + 새 공지 버튼 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => setPage(1)}
            />
            <NewNoticeButton onClick={handleOpenNewForm}>
              새 공지
            </NewNoticeButton>
          </div>
        </Header>

        {/* 공지 목록 테이블 */}
        <NoticeTable rows={pageItems} onClickTitle={setSelected} />

        {/* 페이지네이션 */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>

      {/* --- 모달 영역 --- */}

      {/* 1. 상세 보기 모달 */}
      {selected && (
        <NoticeModal
          notice={selected}
          onClose={() => setSelected(null)}
          onEdit={handleStartEdit}
        />
      )}

      {/* 2. 작성/수정 폼 모달 */}
      {isFormOpen && (
        <NoticeFormModal
          initialData={editing}
          onSubmit={handleSubmit}
          onClose={() => setFormOpen(false)}
          isSubmitting={false} // API 연동 시 로딩 상태
        />
      )}

      {/* 3. 성공 알림 모달 */}
      {successMsg && (
        <SuccessModal message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
    </>
  );
}