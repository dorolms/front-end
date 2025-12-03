'use client';

import { useState, useEffect } from 'react';
// import { mockNotices } from './data/mock';
import * as API from './api'; // API 함수 불러오기
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
  // 초기값을 빈 배열로 시작
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // UI 상태
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // 모달 상태
  const [selected, setSelected] = useState<Notice | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // 데이터 필터링 훅 (프론트에서 검색/페이징 처리)
  const { pageItems, totalPages } = useNotices(notices, {
    query,
    page,
    pageSize: 10,
  });

  // [추가] 페이지가 뜰 때 실제 데이터 불러오기
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setIsLoading(true);
      const data = await API.fetchNotices();
      setNotices(data);
    } catch (err) {
      console.error(err);
      alert('공지사항 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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

  /** 등록/수정 로직 (서버 연동) */
  const handleSubmit = async (payload: NoticePayload) => {
    try {
      if (editing) {
        // 수정 (PATCH)
        await API.updateNotice(editing.id, payload);
        setSuccessMsg('공지가 수정되었습니다.');
      } else {
        // 생성 (POST)
        await API.createNotice(payload);
        setSuccessMsg('새 공지가 등록되었습니다.');
      }
      // 성공 후 목록 다시 불러오기 (가장 확실한 방법)
      await loadNotices();
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  /** 삭제 로직 (서버 연동) */
  const handleDelete = async (id: number) => {

    try {
      // 삭제 (DELETE)
      await API.deleteNotice(id);

      // UI 반영 (API 다시 부르거나, 필터로 제거)
      setNotices((prev) => prev.filter((n) => n.id !== id));

      setFormOpen(false);
      setEditing(null);
      setSuccessMsg('공지가 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    }
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

        {/* 로딩 중 표시 */}
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <NoticeTable rows={pageItems} onClickTitle={setSelected} />
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>

      {/* 상세 모달 */}
      {selected && (
        <NoticeModal
          notice={selected}
          onClose={() => setSelected(null)}
          onEdit={handleStartEdit}
        />
      )}

      {/* 작성/수정 폼 모달 */}
      {isFormOpen && (
        <NoticeFormModal
          initialData={editing}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={() => setFormOpen(false)}
          isSubmitting={false}
        />
      )}

      {/* 성공 알림 모달 */}
      {successMsg && (
        <SuccessModal message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
    </>
  );
}