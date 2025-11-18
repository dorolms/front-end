'use client';
/**
 * ClientPage.tsx
 */

import { useState } from 'react';
import { mockNotices } from './data/mock'; // 경로 확인 필요
import { useNotices } from './hooks/useNotices'; // 경로 확인 필요
import { Container, Header, Title, NewNoticeButton } from './styles'; // 경로 확인 필요
import SearchBar from './components/SearchBar';
import NoticeTable from './components/NoticeTable';
import Pagination from './components/Pagination';
import NoticeModal from './components/NoticeModal';
import NoticeFormModal, { NoticePayload } from './components/NoticeFormModal';
import SuccessModal from './components/SuccessModal';
import type { Notice } from './types';

export default function ClientPage() {
  const [notices, setNotices] = useState(mockNotices);

  // UI 상태
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // 모달 상태
  const [selected, setSelected] = useState<Notice | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null); // null: 생성, Notice: 수정
  const [successMsg, setSuccessMsg] = useState('');

  // 데이터 필터링 훅
  const { pageItems, totalPages } = useNotices(notices, {
    query,
    page,
    pageSize: 10,
  });

  // --- 핸들러 ---

  const handleOpenNewForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleStartEdit = () => {
    setEditing(selected);
    setSelected(null);
    setFormOpen(true);
  };

  /** 등록/수정 로직 */
  const handleSubmit = (payload: NoticePayload) => {
    if (editing) {
      // 수정
      setNotices(
        notices.map((n) => (n.id === editing.id ? { ...n, ...payload } : n)),
      );
      setSuccessMsg('공지가 수정되었습니다.');
    } else {
      // 생성
      const newNotice: Notice = {
        id: Date.now(),
        author: '매니저',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ...payload,
      };
      setNotices([newNotice, ...notices]);
      setSuccessMsg('새 공지가 등록되었습니다.');
    }
    setFormOpen(false);
  };

  /** 삭제 로직 (새로 추가됨) */
  const handleDelete = (id: number) => {
    // 데이터에서 제거
    setNotices(notices.filter((n) => n.id !== id));

    // 모달 닫기 및 성공 메시지
    setFormOpen(false);
    setEditing(null); // 편집 상태 초기화
    setSuccessMsg('공지가 삭제되었습니다.');
  };

  return (
    <>
      <Container>
        <Header>
          <Title>공지사항</Title>
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

        <NoticeTable rows={pageItems} onClickTitle={setSelected} />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>

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
          onDelete={handleDelete} // 여기서 삭제 함수 전달
          onClose={() => setFormOpen(false)}
          isSubmitting={false}
        />
      )}

      {/* 3. 성공 알림 모달 */}
      {successMsg && (
        <SuccessModal message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
    </>
  );
}